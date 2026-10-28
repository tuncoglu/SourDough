/**
 * True when text is empty or a plain decimal number ("12", "0.5", ".5").
 * The single shared rule for numeric text inputs — previously copy-pasted
 * into NumberInput, TempRow, and the lacto calculator's mix grams update.
 */
export function isValidDecimalInput(text: string, allowNegative = false): boolean {
  if (text === '') return true;
  return allowNegative ? /^-?\d*\.?\d*$/.test(text) : /^\d*\.?\d*$/.test(text);
}
