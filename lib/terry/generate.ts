import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { TERRY_SYSTEM_PROMPT } from "./prompt";
import { type Blueprint, BlueprintSchema, blueprintProblems, withAzureQuestion } from "./schema";

// Server-only: imports the API key via the SDK. Never import this from a client component.

// TERRY_MODEL, not ANTHROPIC_MODEL: Claude Code reads ANTHROPIC_MODEL from the shell, and a
// value meant for it would silently change Terry's model too.
const MODEL = process.env.TERRY_MODEL || "claude-sonnet-5-5";

// Thinking is on (adaptive) and counts toward max_tokens, so leave room beyond the ~1K-token
// blueprint itself. A truncated answer fails validation and costs a retry.
const MAX_TOKENS = 8000;

const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
const outputFormat = betaZodOutputFormat(BlueprintSchema);

export type TerryResult =
  | { ok: true; blueprint: Blueprint }
  | { ok: false; reason: "api_error" | "refused" | "invalid_output" };

// An attempt can also fail on our own rules (blueprintProblems); the retry is told which.
type Attempt = TerryResult | { ok: false; reason: "broke_rules"; problems: string[] };

export async function generateBlueprint(problem: string): Promise<TerryResult> {
  // One retry when the output is malformed or breaks the rules. API errors aren't retried
  // here; the SDK already retried them once.
  let feedback: string[] = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    const result = await attemptBlueprint(problem, feedback);
    if (result.ok) return result;
    if (result.reason === "broke_rules") feedback = result.problems;
    else if (result.reason !== "invalid_output") return result;
  }
  return { ok: false, reason: "invalid_output" };
}

async function attemptBlueprint(problem: string, feedback: string[]): Promise<Attempt> {
  let content = `<visitor_problem>\n${problem}\n</visitor_problem>`;
  if (feedback.length > 0) {
    // Our own rule names, never visitor text, so this is safe outside the data tags.
    content += `\n\nA previous blueprint for this problem was rejected because: ${feedback.join("; ")}. Produce a corrected blueprint.`;
  }

  let message;
  try {
    message = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Server-side fallback: if Sonnet 5.5's safety classifiers decline (rare for this
      // prompt), the API re-runs the request on Anthropic's recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: outputFormat },
      system: TERRY_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      // Log the status only. Never log the visitor's description.
      console.error("[terry] API error:", err.status, err.name);
      return { ok: false, reason: "api_error" };
    }
    // The SDK throws when the structured output doesn't parse or fails the zod schema.
    console.error("[terry] output failed schema validation");
    return { ok: false, reason: "invalid_output" };
  }

  if (message.stop_reason === "refusal") {
    console.error("[terry] model declined:", message.stop_details?.category ?? "unknown");
    return { ok: false, reason: "refused" };
  }

  const blueprint = message.parsed_output;
  if (!blueprint) {
    console.error("[terry] no structured output; stop_reason:", message.stop_reason);
    return { ok: false, reason: "invalid_output" };
  }

  const problems = blueprintProblems(blueprint);
  if (problems.length > 0) {
    console.error("[terry] blueprint broke the rules:", problems.join("; "));
    return { ok: false, reason: "broke_rules", problems };
  }

  return { ok: true, blueprint: withAzureQuestion(blueprint) };
}
