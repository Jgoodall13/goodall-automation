import { isTerryEnabled, MAX_PROBLEM_LENGTH } from "@/lib/terry/config";
import { generateBlueprint } from "@/lib/terry/generate";
import { refundRun, takeRun, verifyHuman } from "@/lib/terry/guard";

// A blueprint usually takes 5-15s; leave room for one retry.
export const maxDuration = 120;

export async function POST(request: Request) {
  // Kill switch: off in production until TERRY_ENABLED=true is set in Vercel.
  if (!isTerryEnabled()) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  let body: { problem?: unknown; turnstileToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  // Vercel overwrites x-forwarded-for with the real client IP, so it can't be spoofed there.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // `node scripts/test-terry.mjs` can't solve Turnstile, so in dev only it may skip both gates.
  const devScript =
    process.env.NODE_ENV === "development" && request.headers.get("x-terry-dev-script") === "1";

  // 1. Human check.
  if (!devScript && !(await verifyHuman(body.turnstileToken, ip))) {
    return Response.json({ ok: false, error: "not_verified" }, { status: 403 });
  }

  // 2. Input.
  const problem = typeof body.problem === "string" ? body.problem.trim() : "";
  if (!problem || problem.length > MAX_PROBLEM_LENGTH) {
    return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  // 3. Daily limit.
  let remaining = 0;
  if (!devScript) {
    const run = await takeRun(ip);
    if (!run.ok) {
      return run.reason === "limited"
        ? Response.json({ ok: false, error: "rate_limited", remaining: 0 }, { status: 429 })
        : Response.json({ ok: false, error: "unavailable" }, { status: 503 });
    }
    remaining = run.remaining;
  }

  // 4. Terry.
  const result = await generateBlueprint(problem);
  if (!result.ok) {
    // The API being down isn't the visitor's fault, so they get that run back.
    if (result.reason === "api_error" && !devScript) await refundRun(ip);
    return Response.json({ ok: false, error: "terry_failed" }, { status: 502 });
  }
  return Response.json({ ok: true, blueprint: result.blueprint, remaining });
}
