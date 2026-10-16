/**
 * POST /api/assist: "Ask the baker" on the bread page.
 *
 * Answers questions about the lazy sourdough method in plain language. Every
 * number comes from the app's own engine (SourDoughMobile/src/lib), which the
 * model can only reach through the tools below; the model never computes a
 * time, duration, temperature or weight itself. Spec: ASSISTANT_SPEC.md.
 *
 * Nothing is stored except two rate-limit counters in KV (a salted hash of
 * the client IP per UTC day, and a global per-day count), both expiring
 * after 48 h.
 */
import Anthropic from '@anthropic-ai/sdk';
import { estimateLazyLoaf, planLazyBake, type LazyPlan, type ProofMode } from '../../SourDoughMobile/src/lib/lazyPlan';
import { roundToHalfHour, type LazyVessel } from '../../SourDoughMobile/src/lib/lazyMethod';
import { FALLBACK_HARDNESS } from '../../SourDoughMobile/src/lib/hardnessUtils';

// ── Types ───────────────────────────────────────────────────────────────

interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface Env {
  ANTHROPIC_API_KEY?: string;
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

/** The parts of the SDK client this Function uses (mocked in tests). */
export interface AssistClient {
  beta: { messages: { create(params: Anthropic.Beta.MessageCreateParamsNonStreaming): Promise<Anthropic.Beta.BetaMessage> } };
}

export interface AssistDeps {
  createClient(apiKey: string): AssistClient;
}

// ── Constants ───────────────────────────────────────────────────────────

const MODEL = 'claude-opus-5-5';
const MAX_TOKENS = 4000;
const MAX_TOOL_ROUNDS = 4;
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

Answer in at most 120 words. Lead with what to do now. Plain sentences, no headings, no
emoji. Use the baker's unit system from the context. Offer at most three actions, only
from the allowed set, and only when applying one would actually help.

You are not a food-safety authority. If the question is about whether something is safe
to eat (mould, a smell, raw dough), say that you can't judge that and that when in doubt
they should throw it out.

Always finish by calling the reply tool exactly once with your answer and any actions.`;
// The last line above is the one addition to the spec's §5.5 text: forced
// tool_choice is rejected on this model, so the prompt asks for the reply tool.

// ── Tools ───────────────────────────────────────────────────────────────

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: 'estimate_rise',
    description:
      "Estimate the rise (bulk) and counter-proof hours for this loaf at a room temperature, using the app's fermentation engine. Call this whenever the answer depends on how long the dough takes at some temperature or with changed percentages. Omitted percentages come from the baker's current formula.",
    strict: true,
    input_schema: {
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
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        readyAt: { type: 'string', format: 'date-time', description: 'ISO 8601 date-time with offset, in the baker’s time zone' },
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
    strict: true,
    input_schema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'reply',
    description:
      'Your final answer to the baker. Call this exactly once, last. actions are optional one-tap changes: set_room_temp, set_formula (only changed fields), set_vessel, reset_clock, and show_plan (shows the timeline from your latest plan_bake call).',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        reply: { type: 'string', description: 'At most 120 words, plain sentences, no headings, no emoji' },
        actions: {
          type: 'array',
          description: 'Zero to three actions',
          items: {
            anyOf: [
              {
                type: 'object',
                properties: { type: { type: 'string', const: 'set_room_temp' }, roomTempC: { type: 'number' } },
                required: ['type', 'roomTempC'],
                additionalProperties: false,
              },
              {
                type: 'object',
                properties: {
                  type: { type: 'string', const: 'set_formula' },
                  waterPct: { type: 'number' },
                  starterPct: { type: 'number' },
                  saltPct: { type: 'number' },
                },
                required: ['type'],
                additionalProperties: false,
              },
              {
                type: 'object',
                properties: { type: { type: 'string', const: 'set_vessel' }, vessel: { type: 'string', enum: ['cocotte', 'tin'] } },
                required: ['type', 'vessel'],
                additionalProperties: false,
              },
              {
                type: 'object',
                properties: { type: { type: 'string', const: 'reset_clock' } },
                required: ['type'],
                additionalProperties: false,
              },
              {
                type: 'object',
                properties: { type: { type: 'string', const: 'show_plan' } },
                required: ['type'],
                additionalProperties: false,
              },
            ],
          },
        },
      },
      required: ['reply', 'actions'],
      additionalProperties: false,
    },
    // Tools render before the system prompt, so this breakpoint caches the tool list.
    cache_control: { type: 'ephemeral' },
  },
];

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
  if (!isObj(c) || !onlyKeys(c, ['now', 'timeZone', 'unitSystem', 'formula', 'roomTempC', 'vessel', 'mixedAt', 'bulkHours'])) return null;
  if (!isIsoWithOffset(c.now) || !isTimeZone(c.timeZone)) return null;
  if (c.unitSystem !== 'metric' && c.unitSystem !== 'imperial') return null;
  if (c.vessel !== 'cocotte' && c.vessel !== 'tin') return null;
  if (!isNum(c.roomTempC) || c.roomTempC < -10 || c.roomTempC > 50) return null;
  if (c.mixedAt !== null && !(typeof c.mixedAt === 'string' && !isNaN(Date.parse(c.mixedAt)) && c.mixedAt.length <= 40)) return null;
  if (c.bulkHours !== null && !(isNum(c.bulkHours) && c.bulkHours > 0 && c.bulkHours < 200)) return null;
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
        starterTempC: overrides.starterTempC,
      },
      null,
      FALLBACK_HARDNESS,
      this.ctx.unitSystem,
    );
  }

  run(name: string, input: unknown): { result: unknown; isError?: boolean } {
    const i = isObj(input) ? input : {};
    const optNum = (k: string) => (isNum(i[k]) ? (i[k] as number) : undefined);
    switch (name) {
      case 'estimate_rise': {
        if (!isNum(i.roomTempC)) return { result: { error: 'roomTempC is required' }, isError: true };
        const est = this.estimate(i.roomTempC, {
          waterPct: optNum('waterPct'), starterPct: optNum('starterPct'),
          saltPct: optNum('saltPct'), starterTempC: optNum('starterTempC'),
        });
        if (!est) return { result: { error: 'The engine cannot estimate this formula' }, isError: true };
        return { result: { bulkHours: roundToHalfHour(est.bulkHours), proofHours: est.proofHours } };
      }
      case 'plan_bake': {
        if (!isIsoWithOffset(i.readyAt)) return { result: { error: 'readyAt must be ISO 8601 with an offset' }, isError: true };
        const proofMode: ProofMode = i.proofMode === 'fridge' ? 'fridge' : 'counter';
        const roomTempC = optNum('roomTempC');
        let bulkHours = roomTempC === undefined ? this.ctx.bulkHours : null;
        if (bulkHours == null) bulkHours = this.estimate(roomTempC ?? this.ctx.roomTempC)?.bulkHours ?? null;
        if (bulkHours == null) return { result: { error: 'The engine cannot estimate this formula' }, isError: true };
        const plan: LazyPlan = planLazyBake({
          readyAt: new Date(i.readyAt), bulkHours, proofMode, fridgeHours: optNum('fridgeHours'), vessel: this.ctx.vessel,
        });
        const tz = this.ctx.timeZone;
        this.lastPlan = {
          mixAt: toZonedIso(plan.mixAt, tz),
          steps: plan.steps.map((s) => ({ key: s.key, at: toZonedIso(s.at, tz) })),
        };
        return {
          result: {
            ...this.lastPlan,
            local: plan.steps.map((s) => `${s.key}: ${localLabel(s.at, tz)}`),
            totalHours: round1(plan.totalHours),
            bulkHours: roundToHalfHour(bulkHours),
            mixAtIsPast: plan.mixAt.getTime() < Date.parse(this.ctx.now),
          },
        };
      }
      case 'elapsed_since_mix': {
        if (!this.ctx.mixedAt) return { result: { mixedAt: null } };
        const hoursElapsed = (Date.parse(this.ctx.now) - Date.parse(this.ctx.mixedAt)) / 3_600_000;
        const bulk = this.ctx.bulkHours;
        return {
          result: {
            mixedAt: toZonedIso(new Date(this.ctx.mixedAt), this.ctx.timeZone),
            hoursElapsed: round1(Math.max(0, hoursElapsed)),
            bulkHours: bulk == null ? null : roundToHalfHour(bulk),
            hoursRemaining: bulk == null ? null : round1(Math.max(0, bulk - hoursElapsed)),
          },
        };
      }
      default:
        return { result: { error: `Unknown tool ${name}` }, isError: true };
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

export async function answer(client: AssistClient, req: AssistRequest): Promise<AssistResponse> {
  const tools = new ToolRunner(req.context);
  const messages: Anthropic.Beta.BetaMessageParam[] = req.messages.map((m, i) => ({
    role: m.role,
    content: i === 0 ? `${contextPreamble(req.context)}\n\n${m.text}` : m.text,
  }));

  let toolRounds = 0;
  // Up to MAX_TOOL_ROUNDS rounds of engine tools, then one more call to answer.
  for (let call = 0; call <= MAX_TOOL_ROUNDS + 1; call++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: TOOLS,
      tool_choice: { type: 'auto' },
      messages: [...messages],
    });

    if (response.stop_reason === 'refusal') return FALLBACK_REPLY;

    const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use');
    const replyCall = toolUses.find((b) => b.name === 'reply');
    if (replyCall) return cleanReplyInput(replyCall.input, tools.lastPlan) ?? FALLBACK_REPLY;

    if (toolUses.length === 0) {
      // Answered in prose without the reply tool: show the text, no actions.
      const text = response.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      const reply = cleanReply(text);
      return reply ? { reply, actions: [] } : FALLBACK_REPLY;
    }
    if (response.stop_reason === 'max_tokens') return FALLBACK_REPLY;

    const limitReached = toolRounds >= MAX_TOOL_ROUNDS;
    toolRounds++;
    messages.push({ role: 'assistant', content: response.content });
    messages.push({
      role: 'user',
      content: toolUses.map((t): Anthropic.Beta.BetaToolResultBlockParam => {
        if (limitReached) {
          return { type: 'tool_result', tool_use_id: t.id, is_error: true, content: 'Tool limit reached. Call reply now with what you have.' };
        }
        const { result, isError } = tools.run(t.name, t.input);
        return { type: 'tool_result', tool_use_id: t.id, content: JSON.stringify(result), ...(isError ? { is_error: true } : {}) };
      }),
    });
  }
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

const defaultDeps: AssistDeps = {
  createClient: (apiKey) => new Anthropic({ apiKey, maxRetries: 1, timeout: 60_000 }),
};

export async function handleAssist(request: Request, env: Env, deps: AssistDeps = defaultDeps, now = new Date()): Promise<Response> {
  // 1. Method
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 2. Origin
  const origin = request.headers.get('Origin');
  const originOk = (!!env.SITE_ORIGIN && origin === env.SITE_ORIGIN)
    || (env.ALLOW_LOCALHOST === '1' && origin === LOCALHOST_ORIGIN);
  if (!originOk) return json({ error: 'bad_origin' }, 403);

  // 3. Configuration (rate limiting needs KV and the salt as much as the model needs the key)
  if (!env.ANTHROPIC_API_KEY || !env.ASSIST_KV || !env.RATE_SALT) return json({ error: 'not_configured' }, 503);

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
    return json(await answer(deps.createClient(env.ANTHROPIC_API_KEY), parsed));
  } catch (err) {
    // Log the failure class only, never the question.
    console.error('assist: model call failed', err instanceof Anthropic.APIError ? `${err.status} ${err.name}` : (err as Error)?.name);
    return json(FALLBACK_REPLY);
  }
}

export const onRequest = (context: { request: Request; env: Env }): Promise<Response> =>
  handleAssist(context.request, context.env);
