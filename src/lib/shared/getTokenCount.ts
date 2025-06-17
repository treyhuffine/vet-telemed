/**
 * Estimates OpenAI token count using simple heuristics.
 * This is NOT exact but provides a rough estimate that's good enough for most purposes.
 * On average, OpenAI tokens are ~4 characters long in English.
 *
 * @param text The input text to estimate tokens for
 * @returns Estimated number of tokens
 */
export const TOKEN_ESTIMATED_CHARACTER_COUNT = 4;
export function getTokenCount({ text }: { text: string }): number {
  // Handle empty or invalid input
  if (!text) return 0;

  return Math.ceil(text.length / TOKEN_ESTIMATED_CHARACTER_COUNT);
}
