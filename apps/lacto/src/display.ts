const LEADING_EMOJI = /^[\p{Extended_Pictographic}️‍]+\s*/u;
export const stripEmoji = (s: string): string => s.replace(LEADING_EMOJI, '');

export interface SplitAdvice {
  tips: string[];
  /** The mould and kahm-yeast note, which is shown as a warning of its own. */
  mould: string | null;
}

/** The engine's advice as plain sentences, with the mould note set apart. */
export function splitAdvice(advice: string[]): SplitAdvice {
  const tips: string[] = [];
  let mould: string | null = null;
  for (const raw of advice) {
    const t = stripEmoji(raw);
    if (/Fuzzy mould/i.test(t)) mould = t;
    else tips.push(t);
  }
  return { tips, mould };
}

/** A style's own tips, with the science-only lines (marked with the microscope) set aside. */
export function splitStyleTips(tips: string[] | undefined): { practical: string[]; science: string[] } {
  const practical: string[] = [];
  const science: string[] = [];
  for (const raw of tips ?? []) (raw.startsWith('🔬') ? science : practical).push(stripEmoji(raw));
  return { practical, science };
}

export function spoons(n: number): string {
  return n < 0.1 ? n.toFixed(2) : n < 1 ? n.toFixed(1) : n.toFixed(1).replace(/\.0$/, '');
}
