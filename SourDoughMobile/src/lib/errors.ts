/**
 * Error utilities — typed error handling and type guards.
 */

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/** Extract a human-readable message from any thrown value. */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'An unknown error occurred';
}
