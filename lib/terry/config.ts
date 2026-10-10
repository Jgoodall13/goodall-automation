// Shared by server and client code. Keep zod out of this file so importing it from a
// client component doesn't pull the schema library into the browser bundle.

export const MAX_PROBLEM_LENGTH = 1500;

/**
 * Server-only. Terry is always on in dev; in production only when TERRY_ENABLED=true,
 * which should wait until Turnstile and the rate limit are in. Gates both the API route
 * and whether the home page renders the Terry card.
 */
export function isTerryEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.TERRY_ENABLED === "true";
}
