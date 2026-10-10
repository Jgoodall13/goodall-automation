import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

// Server-only. Terry's two gates before any model call: a Turnstile human check and a
// per-visitor daily limit. In production both fail closed: if either isn't configured or
// can't be reached, Terry doesn't run. In dev, an unconfigured gate is skipped.

const isDev = process.env.NODE_ENV === "development";

// Runs per visitor per 24 hours. Raise it while friends test, set it back to 1 for launch.
export const DAILY_LIMIT = Math.max(1, Number.parseInt(process.env.TERRY_DAILY_LIMIT ?? "", 10) || 1);
const WINDOW_SECONDS = 24 * 60 * 60;

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : null;

// Separate counters per environment, so local testing never uses up production runs.
const KEY_PREFIX = `terry:runs:${process.env.VERCEL_ENV ?? "local"}:`;

// The visitor's IP, hashed. The raw IP is never stored.
function runKey(ip: string) {
  return KEY_PREFIX + createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function verifyHuman(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isDev) return true;
    console.error("[terry] TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (typeof token !== "string" || !token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    console.error("[terry] could not reach Turnstile");
    return false;
  }
}

export type RunCheck =
  | { ok: true; remaining: number }
  | { ok: false; reason: "limited" | "unavailable" };

/** Counts one run for this visitor, or reports that they're out of runs. */
export async function takeRun(ip: string): Promise<RunCheck> {
  if (!redis) {
    if (isDev) return { ok: true, remaining: DAILY_LIMIT };
    console.error("[terry] KV_REST_API_URL / KV_REST_API_TOKEN are not set");
    return { ok: false, reason: "unavailable" };
  }
  const key = runKey(ip);
  try {
    // The 24h window starts at the visitor's first run (NX keeps later runs from extending it).
    const [count] = await redis.multi().incr(key).expire(key, WINDOW_SECONDS, "NX").exec<[number, number]>();
    if (count > DAILY_LIMIT) return { ok: false, reason: "limited" };
    return { ok: true, remaining: DAILY_LIMIT - count };
  } catch {
    console.error("[terry] rate limit store error");
    return { ok: false, reason: "unavailable" };
  }
}

/** Gives a run back, for failures that weren't the visitor's doing (e.g. the API was down). */
export async function refundRun(ip: string) {
  if (!redis) return;
  try {
    await redis.decr(runKey(ip));
  } catch {
    // Best effort; worst case the visitor waits for the window to reset.
  }
}
