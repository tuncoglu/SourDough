const LEADING_EMOJI = /^[\p{Extended_Pictographic}️‍]+\s*/u;
export const stripEmoji = (s: string): string => s.replace(LEADING_EMOJI, '');
