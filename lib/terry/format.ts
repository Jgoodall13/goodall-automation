import type { Blueprint } from "./schema";

/** Plain-text version of a blueprint, for the contact email. */
export function formatBlueprintText(blueprint: Blueprint): string {
  if (!blueprint.inScope) {
    return [
      "TERRY'S BLUEPRINT (out of scope)",
      "That's outside Jacob's wheelhouse.",
      blueprint.summary,
      "",
      "QUESTIONS TO ASK ANYONE THEY HIRE",
      ...blueprint.questionsForYou.map((q, i) => `${i + 1}. ${q}`),
    ].join("\n");
  }

  const lines = [
    "TERRY'S BLUEPRINT",
    `${blueprint.headline} [${blueprint.complexity}]`,
    blueprint.summary,
    "",
    "THE PLAN",
    ...blueprint.steps.flatMap((step, i) => [`${i + 1}. ${step.title} (${step.tool})`, `   ${step.why}`]),
  ];
  if (blueprint.humanCheckpoints.length > 0) {
    lines.push("", "HUMAN CHECKPOINTS", ...blueprint.humanCheckpoints.map((c) => `- ${c}`));
  }
  lines.push("", "YIKES", ...blueprint.yikes.map((y) => `! ${y}`));
  if (blueprint.questionsForYou.length > 0) {
    lines.push("", "QUESTIONS", ...blueprint.questionsForYou.map((q, i) => `${i + 1}. ${q}`));
  }
  return lines.join("\n");
}
