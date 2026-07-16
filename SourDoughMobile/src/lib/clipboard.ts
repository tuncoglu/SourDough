/**
 * Cross-platform clipboard utility.
 * Web: Navigator.clipboard API (no deprecated execCommand).
 * Native: uses expo-share (caller should use Share.share directly).
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
