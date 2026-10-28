/**
 * POST /api/assist: "Ask the baker" on the bread page.
 *
 * Answers questions about the lazy sourdough method in plain language. Every
 * number comes from the app's own engine (packages/calc/src/lib), which the
 * model can only reach through the tools below; the model never computes a
 * time, duration, temperature or weight itself. Spec: ASSISTANT_SPEC.md.
 *
 * Nothing is stored except two rate-limit counters in KV (a salted hash of
 * the client IP per UTC day, and a global per-day count), both expiring
 * after 48 h.
 */
import { chat, type LlmEnv, type LlmMessage, type ToolDef } from './llm';
import { estimateLazyLoaf, planLazyBake, type LazyPlan, type ProofMode } from '../../packages/calc/src/lib/lazyPlan';
import { roundToHalfHour, type LazyVessel } from '../../packages/calc/src/lib/lazyMethod';
import { FALLBACK_HARDNESS } from '../../packages/calc/src/lib/hardnessUtils';
import { findFlour } from '../../packages/calc/src/lib/flourSearch';

// ── Types ───────────────────────────────────────────────────────────────

interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface Env extends LlmEnv {
  ASSIST_KV?: KVLike;
  SITE_ORIGIN?: string;
  ALLOW_LOCALHOST?: string;
  RATE_SALT?: string;
  ASSIST_PER_IP_DAILY?: string;
  ASSIST_GLOBAL_DAILY?: string;
}

export interface AssistContext {
  now: string;
  timeZone: string;
  unitSystem: 'metric' | 'imperial';
  formula: { flourGrams: number; waterPct: number; starterPct: number; saltPct: number; starterHydration: number };
  roomTempC: number;
  /** Tap water temperature when known; otherwise the water is at room temperature. */
  waterTempC?: number;
  /** The bowl flours, when not a single default flour. */
  flours?: { label: string; grams: number }[];
  vessel: LazyVessel;
  mixedAt: string | null;
  bulkHours: number | null;
}

export interface AssistRequest {
  context: AssistContext;
  messages: { role: 'user' | 'assistant'; text: string }[];
}

export type AssistAction =
  | { type: 'set_room_temp'; roomTempC: number }
  | { type: 'set_formula'; waterPct?: number; starterPct?: number; saltPct?: number }
  | { type: 'set_vessel'; vessel: LazyVessel }
  | { type: 'reset_clock' }
  | { type: 'show_plan'; plan: { mixAt: string; steps: { key: string; at: string }[] } };

export interface AssistResponse {
  reply: string;
  actions: AssistAction[];
}

// ── Constants ───────────────────────────────────────────────────────────

/** Model calls per request; the model must have called reply by the last one. */
const MAX_ROUNDS = 4;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_USER_TURNS = 6;
const MAX_USER_CHARS = 500;
const MAX_ASSISTANT_CHARS = 2000;
const MAX_REPLY_WORDS = 120;
const MAX_ACTIONS = 3;
const RATE_TTL_SECONDS = 48 * 3600;
const LOCALHOST_ORIGIN = 'http://localhost:8081';

export const FALLBACK_REPLY: AssistResponse = {
  reply: "Sorry, I can't help with that one. The steps on this page still apply.",
  actions: [],
};

export const SYSTEM_PROMPT = `You help home bakers with one recipe: the lazy sourdough method on this page. One bowl,
no autolyse, no kneading, no folding schedule. The six steps are mix, rise, shape, proof,
bake, cool. Do not suggest techniques the method leaves out (autolyse, kneading, timed
folds, pre-shaping, bench rest, scoring, bannetons) unless the user asks about them.

Every time, duration, temperature or weight you mention must come from a tool result or
from the context you were given. Never estimate one yourself. If a tool can't answer,
say what the baker should look for instead (doubled, domed, bubbly, jiggles; a floured
finger dent that springs back slowly).

The context's bulkHours is how long the rise takes now; call estimate_rise only for a
different temperature or formula. When the baker states a temperature, use exactly that
temperature in estimate_rise and in any set_room_temp action. Salt does not change the
rise estimate: never say it makes the rise faster or slower. If the context's mixedAt is
set, the dough is already mixed: work from the time elapsed and do not plan a new mix
time. If the baker asks for a plan without saying when the loaf should be ready, ask for
the time instead of assuming one. If plan_bake says mixAtIsPast, say it is too late to be
ready by then and offer to plan for a later time; do not offer show_plan.

Answer in at most 120 words. Lead with what to do now. Plain sentences, no headings, no
emoji. Use the baker's unit system from the context. Offer at most three actions, only
from the allowed set, and only when applying one would actually help.

You are not a food-safety authority. Only if the baker asks whether something is safe to
eat (mould, a smell, raw dough), say that you can't judge that and that when in doubt
they should throw it out. For every other question, never mention food safety, throwing
dough out, or anything you can't judge.

Always finish by calling the reply tool exactly once with your answer and any actions.`;
// The last line above is the one addition to the spec's §5.5 text, as §3 asks:
// the model must finish with the reply function.

// ── Tools ───────────────────────────────────────────────────────────────

const PLAN_SCHEMA = {
  type: 'object',
  description: "Copy it from your latest plan_bake result; the server always shows the engine's plan",
  properties: {
    mixAt: { type: 'string' },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: { key: { type: 'string' }, at: { type: 'string' } },
        required: ['key', 'at'],
        additionalProperties: false,
      },
    },
  },
  required: ['mixAt', 'steps'],
  additionalProperties: false,
};

const ACTION_SCHEMAS = [
  {
    type: 'object',
    properties: { type: { type: 'string', enum: ['set_room_temp'] }, roomTempC: { type: 'number' } },
    required: ['type', 'roomTempC'],
    additionalProperties: false,
  },
  {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['set_formula'] },
      waterPct: { type: 'number' },
      starterPct: { type: 'number' },
      saltPct: { type: 'number' },
    },
    required: ['type'],
    additionalProperties: false,
  },
  {
    type: 'object',
    properties: { type: { type: 'string', enum: ['set_vessel'] }, vessel: { type: 'string', enum: ['cocotte', 'tin'] } },
    required: ['type', 'vessel'],
    additionalProperties: false,
  },
  {
    type: 'object',
    properties: { type: { type: 'string', enum: ['reset_clock'] } },
    required: ['type'],
    additionalProperties: false,
  },
  {
    type: 'object',
    properties: { type: { type: 'string', enum: ['show_plan'] }, plan: PLAN_SCHEMA },
    required: ['type', 'plan'],
    additionalProperties: false,
  },
];

// Byte-identical on every request so DeepSeek's prefix cache can hit.
export const TOOLS: ToolDef[] = [
  {
    name: 'estimate_rise',
    description:
      "Estimate the rise (bulk) and counter-proof hours for this loaf at a room temperature, using the app's fermentation engine. Call this whenever the answer depends on how long the dough takes at some temperature or with changed percentages. Omitted percentages come from the baker's current formula.",
    parameters: {
      type: 'object',
      properties: {
        roomTempC: { type: 'number', description: 'Room temperature in °C' },
        waterPct: { type: 'number', description: "Water, baker's % of flour" },
        starterPct: { type: 'number', description: "Starter, baker's % of flour" },
        saltPct: { type: 'number', description: "Salt, baker's % of all flour" },
        starterTempC: { type: 'number', description: 'Starter temperature in °C (default 4, straight from the fridge)' },
      },
      required: ['roomTempC'],
      additionalProperties: false,
    },
  },
  {
    name: 'plan_bake',
    description:
      "Work backwards from when the baker wants the loaf cool and ready to slice to when to mix, with the start time of each of the six steps. Call this for any 'I want bread by …' question. Times come back in the baker's time zone.",
    parameters: {
      type: 'object',
      properties: {
        readyAt: { type: 'string', description: "ISO 8601 date-time with offset, in the baker's time zone" },
        proofMode: { type: 'string', enum: ['counter', 'fridge'], description: 'counter: proof on the counter; fridge: proof overnight in the fridge and bake from cold' },
        fridgeHours: { type: 'number', description: 'Fridge proof length in hours (fridge only; default 12, kept within 8–16)' },
        roomTempC: { type: 'number', description: "Room temperature in °C, if different from the context's" },
      },
      required: ['readyAt', 'proofMode'],
      additionalProperties: false,
    },
  },
  {
    name: 'elapsed_since_mix',
    description:
      'How long ago the baker mixed (from the page clock), the estimated rise, and the hours left. Call this for any question about dough that is already rising.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'reply',
    description:
      'Your final answer to the baker. Call this exactly once, last. actions are optional one-tap changes: set_room_temp, set_formula (only changed fields), set_vessel, reset_clock, and show_plan (the timeline from your latest plan_bake call).',
    parameters: {
      type: 'object',
      properties: {
        reply: { type: 'string', description: 'At most 120 words, plain sentences, no headings, no emoji' },
        actions: { type: 'array', description: 'Zero to three actions', items: { anyOf: ACTION_SCHEMAS } },
      },
      required: ['reply', 'actions'],
      additionalProperties: false,
    },
  },
];

/**
 * Minimal JSON Schema check for the subset the tool schemas use: object
 * (required, additionalProperties: false), array (items), string, number,
 * enum and anyOf.
 */
export function matchesSchema(schema: Record<string, unknown>, value: unknown): boolean {
  if (Array.isArray(schema.anyOf)) return (schema.anyOf as Record<string, unknown>[]).some((s) => matchesSchema(s, value));
  if (Array.isArray(schema.enum) && !(schema.enum as unknown[]).includes(value)) return false;
  switch (schema.type) {
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'array':
      return Array.isArray(value) && (!schema.items || value.every((v) => matchesSchema(schema.items as Record<string, unknown>, v)));
    case 'object': {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
      const props = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
      const obj = value as Record<string, unknown>;
      if (((schema.required ?? []) as string[]).some((k) => !(k in obj))) return false;
      return Object.entries(obj).every(([k, v]) => (k in props ? matchesSchema(props[k], v) : schema.additionalProperties !== false));
    }
    default:
      return true;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const onlyKeys = (o: Record<string, unknown>, keys: readonly string[]) => Object.keys(o).every((k) => keys.includes(k));
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

function isIsoWithOffset(s: unknown): s is string {
  return typeof s === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(s)
    && !isNaN(Date.parse(s));
}

function isTimeZone(s: unknown): s is string {
  if (typeof s !== 'string' || s.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: s });
    return true;
  } catch {
    return false;
  }
}

/** Validate the request body. Unknown keys anywhere are rejected. */
export function parseAssistRequest(body: unknown): AssistRequest | null {
  if (!isObj(body) || !onlyKeys(body, ['context', 'messages'])) return null;
  const c = body.context;
  if (!isObj(c) || !onlyKeys(c, ['now', 'timeZone', 'unitSystem', 'formula', 'roomTempC', 'waterTempC', 'flours', 'vessel', 'mixedAt', 'bulkHours'])) return null;
  if (!isIsoWithOffset(c.now) || !isTimeZone(c.timeZone)) return null;
  if (c.unitSystem !== 'metric' && c.unitSystem !== 'imperial') return null;
  if (c.vessel !== 'cocotte' && c.vessel !== 'tin') return null;
  if (!isNum(c.roomTempC) || c.roomTempC < -10 || c.roomTempC > 50) return null;
  if (c.mixedAt !== null && !(typeof c.mixedAt === 'string' && !isNaN(Date.parse(c.mixedAt)) && c.mixedAt.length <= 40)) return null;
  if (c.bulkHours !== null && !(isNum(c.bulkHours) && c.bulkHours > 0 && c.bulkHours < 200)) return null;
  if (c.waterTempC !== undefined && !(isNum(c.waterTempC) && c.waterTempC >= -10 && c.waterTempC <= 50)) return null;
  if (c.flours !== undefined) {
    const fl = c.flours;
    if (!Array.isArray(fl) || fl.length === 0 || fl.length > 3) return null;
    for (const r of fl) {
      if (!isObj(r) || !onlyKeys(r, ['label', 'grams']) || typeof r.label !== 'string' || r.label.length > 100) return null;
      if (!(isNum(r.grams) && r.grams > 0 && r.grams <= 20000)) return null;
    }
  }
  const f = c.formula;
  const formulaKeys = ['flourGrams', 'waterPct', 'starterPct', 'saltPct', 'starterHydration'] as const;
  if (!isObj(f) || !onlyKeys(f, formulaKeys) || !formulaKeys.every((k) => isNum(f[k]))) return null;
  const formula = f as AssistContext['formula'];
  if (!(formula.flourGrams > 0 && formula.flourGrams <= 20000)) return null;
  if (!(formula.waterPct > 0 && formula.waterPct <= 200 && formula.starterPct > 0 && formula.starterPct <= 200)) return null;
  if (!(formula.saltPct >= 0 && formula.saltPct <= 10 && formula.starterHydration > 0 && formula.starterHydration <= 300)) return null;

  const m = body.messages;
  if (!Array.isArray(m) || m.length === 0) return null;
  let userTurns = 0;
  for (let i = 0; i < m.length; i++) {
    const msg = m[i];
    if (!isObj(msg) || !onlyKeys(msg, ['role', 'text']) || typeof msg.text !== 'string') return null;
    const expected = i % 2 === 0 ? 'user' : 'assistant';
    if (msg.role !== expected) return null;
    const limit = msg.role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (msg.text.trim().length === 0 || msg.text.length > limit) return null;
    if (msg.role === 'user') userTurns++;
  }
  if (userTurns > MAX_USER_TURNS || m[m.length - 1].role !== 'user') return null;
  return body as unknown as AssistRequest;
}

/** ISO 8601 with the offset of `timeZone` at that instant, e.g. 2026-10-24T19:08:00+01:00. */
export function toZonedIso(date: Date, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  const offsetMin = Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  const sign = offsetMin < 0 ? '-' : '+';
  const abs = Math.abs(offsetMin);
  const off = `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${off}`;
}

function localLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
}

// ── Engine tools ────────────────────────────────────────────────────────

/** A mix time up to this far in the past still counts as "mix now". */
const PAST_GRACE_MS = 15 * 60_000;

type PlanResult = { mixAt: string; steps: { key: string; at: string }[] };

class ToolRunner {
  /** The latest plan_bake result, attached to a show_plan action. */
  lastPlan: PlanResult | null = null;

  constructor(private ctx: AssistContext) {}

  private estimate(roomTempC: number, overrides: { waterPct?: number; starterPct?: number; saltPct?: number; starterTempC?: number } = {}) {
    const f = this.ctx.formula;
    return estimateLazyLoaf(
      {
        flourGrams: f.flourGrams,
        waterPct: overrides.waterPct ?? f.waterPct,
        starterPct: overrides.starterPct ?? f.starterPct,
        saltPct: overrides.saltPct ?? f.saltPct,
        starterHydration: f.starterHydration,
        roomTempC,
        waterTempC: this.ctx.waterTempC,
        starterTempC: overrides.starterTempC,
        flours: this.ctx.flours?.map((r) => ({ flour: findFlour(r.label), grams: r.grams })),
      },
      null,
      FALLBACK_HARDNESS,
      this.ctx.unitSystem,
    );
  }

  /** Run an engine tool on schema-checked arguments and return its JSON result. */
  run(name: string, i: Record<string, unknown>): unknown {
    const optNum = (k: string) => (isNum(i[k]) ? (i[k] as number) : undefined);
    switch (name) {
      case 'estimate_rise': {
        if (!isNum(i.roomTempC)) return { error: 'roomTempC is required' };
        const est = this.estimate(i.roomTempC, {
          waterPct: optNum('waterPct'), starterPct: optNum('starterPct'),
          saltPct: optNum('saltPct'), starterTempC: optNum('starterTempC'),
        });
        if (!est) return { error: 'The engine cannot estimate this formula' };
        return { bulkHours: roundToHalfHour(est.bulkHours), proofHours: est.proofHours };
      }
      case 'plan_bake': {
        if (this.ctx.mixedAt) return { error: 'The dough is already mixed, so there is nothing to plan. Do not call plan_bake again: call elapsed_since_mix if you need the time left, then reply.' };
        if (!isIsoWithOffset(i.readyAt)) return { error: 'readyAt must be ISO 8601 with an offset' };
        const proofMode: ProofMode = i.proofMode === 'fridge' ? 'fridge' : 'counter';
        const roomTempC = optNum('roomTempC');
        let bulkHours = roomTempC === undefined ? this.ctx.bulkHours : null;
        if (bulkHours == null) bulkHours = this.estimate(roomTempC ?? this.ctx.roomTempC)?.bulkHours ?? null;
        if (bulkHours == null) return { error: 'The engine cannot estimate this formula' };
        const plan: LazyPlan = planLazyBake({
          readyAt: new Date(i.readyAt), bulkHours, proofMode, fridgeHours: optNum('fridgeHours'), vessel: this.ctx.vessel,
        });
        const tz = this.ctx.timeZone;
        const planResult: PlanResult = {
          mixAt: toZonedIso(plan.mixAt, tz),
          steps: plan.steps.map((s) => ({ key: s.key, at: toZonedIso(s.at, tz) })),
        };
        // A plan whose mix time has already passed can't be met, so it is never shown as a plan.
        const mixAtIsPast = plan.mixAt.getTime() < Date.parse(this.ctx.now) - PAST_GRACE_MS;
        this.lastPlan = mixAtIsPast ? null : planResult;
        return {
          ...planResult,
          local: plan.steps.map((s) => `${s.key}: ${localLabel(s.at, tz)}`),
          totalHours: round1(plan.totalHours),
          bulkHours: roundToHalfHour(bulkHours),
          mixAtIsPast,
        };
      }
      case 'elapsed_since_mix': {
        if (!this.ctx.mixedAt) return { mixedAt: null };
        const hoursElapsed = (Date.parse(this.ctx.now) - Date.parse(this.ctx.mixedAt)) / 3_600_000;
        const bulk = this.ctx.bulkHours;
        return {
          mixedAt: toZonedIso(new Date(this.ctx.mixedAt), this.ctx.timeZone),
          hoursElapsed: round1(Math.max(0, hoursElapsed)),
          bulkHours: bulk == null ? null : roundToHalfHour(bulk),
          hoursRemaining: bulk == null ? null : round1(Math.max(0, bulk - hoursElapsed)),
        };
      }
      default:
        return { error: `Unknown tool ${name}` };
    }
  }
}

// ── Output validation ───────────────────────────────────────────────────

function cleanReply(text: unknown): string | null {
  if (typeof text !== 'string') return null;
  const cleaned = text
    .split('\n')
    .map((line) => line.replace(/^\s*#+\s*/, ''))
    .join('\n')
    .replace(/\*\*/g, '')
    .replace(/\p{Extended_Pictographic}️?/gu, '')
    .trim();
  if (!cleaned) return null;
  const words = cleaned.split(/\s+/);
  return words.length > MAX_REPLY_WORDS ? `${words.slice(0, MAX_REPLY_WORDS).join(' ')}…` : cleaned;
}

/** Validate one model action; null drops it. */
export function cleanAction(raw: unknown, lastPlan: PlanResult | null): AssistAction | null {
  if (!isObj(raw)) return null;
  switch (raw.type) {
    case 'set_room_temp':
      if (!isNum(raw.roomTempC) || raw.roomTempC < 5 || raw.roomTempC > 35) return null;
      return { type: 'set_room_temp', roomTempC: round1(raw.roomTempC) };
    case 'set_formula': {
      const out: { type: 'set_formula'; waterPct?: number; starterPct?: number; saltPct?: number } = { type: 'set_formula' };
      if (isNum(raw.waterPct)) out.waterPct = round1(clamp(raw.waterPct, 55, 100));
      if (isNum(raw.starterPct)) out.starterPct = round1(clamp(raw.starterPct, 5, 50));
      if (isNum(raw.saltPct)) out.saltPct = round1(clamp(raw.saltPct, 0, 3));
      return Object.keys(out).length > 1 ? out : null;
    }
    case 'set_vessel':
      return raw.vessel === 'cocotte' || raw.vessel === 'tin' ? { type: 'set_vessel', vessel: raw.vessel } : null;
    case 'reset_clock':
      return { type: 'reset_clock' };
    case 'show_plan':
      // The plan always comes from the engine, never from the model's text.
      return lastPlan ? { type: 'show_plan', plan: lastPlan } : null;
    default:
      return null;
  }
}

export function cleanReplyInput(input: unknown, lastPlan: PlanResult | null): AssistResponse | null {
  if (!isObj(input)) return null;
  const reply = cleanReply(input.reply);
  if (!reply) return null;
  const actions: AssistAction[] = [];
  const seen = new Set<string>();
  for (const raw of Array.isArray(input.actions) ? input.actions : []) {
    const a = cleanAction(raw, lastPlan);
    if (!a || seen.has(a.type)) continue;
    seen.add(a.type);
    actions.push(a);
    if (actions.length === MAX_ACTIONS) break;
  }
  return { reply, actions };
}

// ── Model loop ──────────────────────────────────────────────────────────

function contextPreamble(ctx: AssistContext): string {
  return `<context>\n${JSON.stringify(ctx, null, 2)}\n</context>\n\n` +
    'The context is what the bread page currently shows: now and timeZone are from the baker’s device, ' +
    'formula percentages are baker’s % of flour, bulkHours is the rise estimate on the page (null if none), ' +
    'mixedAt is when the baker pressed "I\'ve mixed" (null if not mixed yet).';
}

const TOOL_SCHEMAS = new Map(TOOLS.map((t) => [t.name, t.parameters]));

/** JSON.parse the model's arguments and check them against the tool's schema; null if either fails. */
export function parseToolArguments(name: string, json: string): Record<string, unknown> | null {
  const schema = TOOL_SCHEMAS.get(name);
  if (!schema) return null;
  let value: unknown;
  try {
    value = JSON.parse(json || '{}');
  } catch {
    return null;
  }
  return matchesSchema(schema, value) ? (value as Record<string, unknown>) : null;
}

export async function answer(env: Env, req: AssistRequest): Promise<AssistResponse> {
  const tools = new ToolRunner(req.context);
  const messages: LlmMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...req.messages.map((m, i): LlmMessage => ({
      role: m.role,
      content: i === 0 ? `${contextPreamble(req.context)}\n\n${m.text}` : m.text,
    })),
  ];

  const called: string[] = []; // tool names only, for logs; never the content
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const turn = await chat(env, [...messages], TOOLS);

    if (turn.toolCalls.length === 0) {
      // Answered in plain text instead of calling reply: show it, no actions.
      const reply = cleanReply(turn.content);
      if (!reply) console.warn('assist: empty reply after tools:', called.join(',') || 'none');
      return reply ? { reply, actions: [] } : FALLBACK_REPLY;
    }

    const replyCall = turn.toolCalls.find((c) => c.name === 'reply');
    if (replyCall) {
      const args = parseToolArguments('reply', replyCall.arguments);
      const response = args && cleanReplyInput(args, tools.lastPlan);
      if (response) return response;
      console.warn('assist: invalid reply arguments after tools:', called.join(',') || 'none');
    }

    // Run every call in the round; malformed arguments get an error result.
    messages.push({ role: 'assistant', content: turn.content, tool_calls: turn.toolCalls });
    for (const call of turn.toolCalls) {
      called.push(call.name);
      const args = parseToolArguments(call.name, call.arguments);
      const result = args && call.name !== 'reply' ? tools.run(call.name, args) : { error: 'bad_arguments' };
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }
  console.warn('assist: no reply within the round limit; tools:', called.join(','));
  return FALLBACK_REPLY;
}

// ── Guards and handler ──────────────────────────────────────────────────

async function sha256Hex(s: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function limitFrom(value: string | undefined, fallback: number): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function handleAssist(request: Request, env: Env, now = new Date()): Promise<Response> {
  // 1. Method
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 2. Origin
  const origin = request.headers.get('Origin');
  const originOk = (!!env.SITE_ORIGIN && origin === env.SITE_ORIGIN)
    || (env.ALLOW_LOCALHOST === '1' && origin === LOCALHOST_ORIGIN);
  if (!originOk) return json({ error: 'bad_origin' }, 403);

  // 3. Configuration (rate limiting needs KV and the salt as much as the model needs the key)
  if (!env.DEEPSEEK_API_KEY || !env.ASSIST_KV || !env.RATE_SALT) return json({ error: 'not_configured' }, 503);

  // 4. Body size and schema
  const declared = parseInt(request.headers.get('Content-Length') ?? '', 10);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return json({ error: 'bad_request' }, 400);
  let parsed: AssistRequest | null = null;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length <= MAX_BODY_BYTES) parsed = parseAssistRequest(JSON.parse(raw));
  } catch {
    parsed = null;
  }
  if (!parsed) return json({ error: 'bad_request' }, 400);

  // 5. Rate limits (KV is eventually consistent; slight overshoot is fine)
  const day = now.toISOString().slice(0, 10);
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ipKey = `ip:${await sha256Hex(ip + env.RATE_SALT)}:${day}`;
  const globalKey = `global:${day}`;
  const kv = env.ASSIST_KV;
  const [ipCount, globalCount] = (await Promise.all([kv.get(ipKey), kv.get(globalKey)])).map((v) => parseInt(v ?? '0', 10) || 0);
  if (ipCount >= limitFrom(env.ASSIST_PER_IP_DAILY, 20)) return json({ error: 'rate_limited' }, 429);
  if (globalCount >= limitFrom(env.ASSIST_GLOBAL_DAILY, 1500)) return json({ error: 'daily_cap' }, 429);
  await Promise.all([
    kv.put(ipKey, String(ipCount + 1), { expirationTtl: RATE_TTL_SECONDS }),
    kv.put(globalKey, String(globalCount + 1), { expirationTtl: RATE_TTL_SECONDS }),
  ]);

  try {
    return json(await answer(env, parsed));
  } catch (err) {
    // Log the failure class only, never the question.
    console.error('assist: model call failed', err instanceof Error ? `${err.name}: ${err.message}` : 'unknown');
    return json(FALLBACK_REPLY);
  }
}

export const onRequest = (context: { request: Request; env: Env }): Promise<Response> =>
  handleAssist(context.request, context.env);
