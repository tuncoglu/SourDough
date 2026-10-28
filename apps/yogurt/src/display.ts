/**
 * Turning the engine's text into what the page shows. The engine's step
 * titles and tips are written for the mobile app (emoji, em dashes, title
 * case); the web design uses plain sentences.
 */
import type { YogurtStepPoint } from '@sourdough/calc/models/types';

const LEADING_EMOJI = /^[\p{Extended_Pictographic}️‍]+\s*/u;
export const stripEmoji = (s: string): string => s.replace(LEADING_EMOJI, '');
const lowerFirst = (s: string): string => (/^[A-Z][a-z]/.test(s) ? s[0]!.toLowerCase() + s.slice(1) : s);

/** "Hour 4 — Halfway" → "Hour 4: halfway"; "Pre-heat — Denature Proteins" → "Pre-heat: denature proteins". */
export function stepTitle(p: YogurtStepPoint): string {
  const [head, ...rest] = p.label.split(' — ');
  const tail = rest.join(' — ');
  if (!tail) return p.label;
  const words = tail.replace(/\b([A-Z])([a-z]+)/g, (_m, a: string, b: string) => a.toLowerCase() + b);
  // "Complete — Chill" sits at an hour of its own: "Hour 8: complete, chill".
  if (!/^Hour \d/.test(head!) && p.hour != null) return `Hour ${p.hour}: ${lowerFirst(head!)}, ${words}`;
  return `${head}: ${words}`;
}

export interface SplitAdvice {
  /** The engine's advice about this temperature, pre-heating, milk and straining, as plain sentences. */
  tips: string[];
  /** The contamination warning, split into its heading and the rest. */
  contamination: string | null;
}

export function splitAdvice(advice: string[]): SplitAdvice {
  const tips: string[] = [];
  let contamination: string | null = null;
  for (const raw of advice) {
    const t = stripEmoji(raw);
    if (/^Signs of contamination/i.test(t)) {
      const rest = t.replace(/^Signs of contamination:?\s*/i, '');
      contamination = rest.charAt(0).toUpperCase() + rest.slice(1);
    }
    else tips.push(t);
  }
  return { tips, contamination };
}

/** A culture's own tips, with the science-only lines (marked with the microscope) set aside. */
export function splitCultureTips(tips: string[] | undefined): { practical: string[]; science: string[] } {
  const practical: string[] = [];
  const science: string[] = [];
  for (const raw of tips ?? []) {
    (raw.startsWith('🔬') ? science : practical).push(stripEmoji(raw));
  }
  return { practical, science };
}

export function hoursLabel(h: number): string {
  const r = h < 10 ? Math.round(h * 2) / 2 : Math.round(h);
  return `${r} h`;
}
