/**
 * Client side of "Ask the baker" (POST /api/assist, see ASSISTANT_SPEC.md).
 *
 * Pure TypeScript: request building, response checking and action labels.
 * The UI lives in components/AskCard.tsx; the server in functions/api/assist.ts.
 */
import { formatTemp } from './unitConversion';
import type { LazyStep, LazyVessel } from './lazyMethod';
import type { UnitSystem } from '../models/types';

export const ASSISTANT_CONSENT_KEY = 'sourdough_assistant_consent_v1';
export const ASSIST_MAX_USER_TURNS = 6;
export const ASSIST_MAX_CHARS = 500;

export interface AssistContext {
  now: string;
  timeZone: string;
  unitSystem: UnitSystem;
  formula: { flourGrams: number; waterPct: number; starterPct: number; saltPct: number; starterHydration: number };
  roomTempC: number;
  vessel: LazyVessel;
  mixedAt: string | null;
  bulkHours: number | null;
}

export type AssistTurn = { role: 'user' | 'assistant'; text: string };

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

export type AssistOutcome =
  | { kind: 'answer'; response: AssistResponse }
  | { kind: 'busy' }     // 429: rate_limited / daily_cap
  | { kind: 'hide' }     // 503 not_configured, or no network
  | { kind: 'error' };   // anything else

/** Whether the build turned the assistant on (EXPO_PUBLIC_ASSISTANT_ENABLED=1). */
export function assistantEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ASSISTANT_ENABLED === '1';
}

/** ISO 8601 with the device's UTC offset, e.g. 2026-10-16T10:00:00+01:00. */
export function isoWithOffset(d: Date): string {
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const offset = -d.getTimezoneOffset();
  const sign = offset < 0 ? '-' : '+';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    + `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
}

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function isAction(a: unknown): a is AssistAction {
  if (typeof a !== 'object' || a === null) return false;
  const t = (a as { type?: unknown }).type;
  return t === 'set_room_temp' || t === 'set_formula' || t === 'set_vessel' || t === 'reset_clock' || t === 'show_plan';
}

/** Map an HTTP result to what the card should do. */
export function interpretAssistResult(status: number, body: unknown): AssistOutcome {
  const error = typeof body === 'object' && body !== null ? (body as { error?: unknown }).error : undefined;
  if (status === 429 && (error === 'rate_limited' || error === 'daily_cap')) return { kind: 'busy' };
  if (status === 503 && error === 'not_configured') return { kind: 'hide' };
  if (status !== 200 || typeof body !== 'object' || body === null) return { kind: 'error' };
  const { reply, actions } = body as { reply?: unknown; actions?: unknown };
  if (typeof reply !== 'string' || !reply.trim() || !Array.isArray(actions)) return { kind: 'error' };
  return { kind: 'answer', response: { reply, actions: actions.filter(isAction).slice(0, 3) } };
}

/** POST the question. A network failure hides the card for the session. */
export async function askBaker(
  url: string,
  context: AssistContext,
  messages: AssistTurn[],
  fetchImpl: typeof fetch = fetch,
): Promise<AssistOutcome> {
  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, messages }),
    });
  } catch {
    return { kind: 'hide' };
  }
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return interpretAssistResult(res.status, body);
}

const STEP_TITLES: Record<LazyStep['key'], string> = {
  mix: 'Mix', rise: 'Rise', shape: 'Shape', proof: 'Proof', bake: 'Bake', cool: 'Cool',
};

export function planStepTitle(key: string): string {
  return STEP_TITLES[key as LazyStep['key']] ?? key;
}

const pct = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;

/** Button label for an action, or null for show_plan (rendered inline, no button). */
export function actionLabel(action: AssistAction, unitSystem: UnitSystem): string | null {
  switch (action.type) {
    case 'set_room_temp':
      return `Use ${formatTemp(action.roomTempC, unitSystem, 0)}`;
    case 'set_formula': {
      const parts: string[] = [];
      if (action.waterPct != null) parts.push(`water ${pct(action.waterPct)}`);
      if (action.starterPct != null) parts.push(`starter ${pct(action.starterPct)}`);
      if (action.saltPct != null) parts.push(`salt ${pct(action.saltPct)}`);
      return `Use ${parts.join(' · ')}`;
    }
    case 'set_vessel':
      return `Switch to ${action.vessel === 'cocotte' ? 'Cocotte' : 'Loaf tin'}`;
    case 'reset_clock':
      return 'Reset the clock';
    case 'show_plan':
      return null;
  }
}
