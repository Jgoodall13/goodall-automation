import { z } from "zod";

// Every tool Terry may put in a blueprint. The API enforces this as a JSON-schema enum,
// so a tool outside the list can't come back even if the prompt is ignored.
export const ALLOWED_TOOLS = [
  "NetSuite SuiteScript",
  "NetSuite RESTlet",
  "NetSuite Saved Search",
  "NetSuite Workflow",
  "Power Automate",
  "Copilot Studio",
  "Microsoft Foundry",
  "SharePoint Lists",
  "Teams",
  "Outlook / Exchange",
  "Entra ID",
  "Dataverse",
  "Azure Functions",
  "Azure Container Apps",
  "Azure SQL Database",
  "Azure Table Storage",
  "Azure Key Vault",
  "Application Insights",
  "MCP server",
  "Claude API",
  "RAG",
  "Wrike API",
  "3PL / partner API",
] as const;

// The shape sent to the model as structured output. Length limits aren't enforced by the
// API itself; the SDK moves them into the schema descriptions and checks them on parse.
export const BlueprintSchema = z.object({
  inScope: z.boolean(),
  headline: z.string().max(90),
  summary: z.string().max(400),
  steps: z
    .array(
      z.object({
        title: z.string().max(60),
        tool: z.enum(ALLOWED_TOOLS),
        why: z.string().max(200),
      }),
    )
    .max(5),
  humanCheckpoints: z.array(z.string().max(160)).max(3),
  yikes: z.array(z.string().max(200)).max(3),
  // null only when inScope is false.
  complexity: z.enum(["Small", "Medium", "Large"]).nullable(),
  questionsForYou: z.array(z.string().max(160)).max(3),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;

// Terry never picks a language for Azure compute; this question brings the client's
// preference to the call instead.
export const AZURE_STANDARDS_QUESTION =
  "Does your IT team have a preferred language or standards for services in Azure?";
const AZURE_COMPUTE = new Set(["Azure Functions", "Azure Container Apps"]);
const LANGUAGE_QUESTION = /preferred language/i;

/**
 * Guarantees the Azure standards question appears, worded exactly, when the plan uses Azure
 * Functions or Container Apps, and never otherwise. Keeps the 3-question cap.
 */
export function withAzureQuestion(blueprint: Blueprint): Blueprint {
  // Out-of-scope questions are for whoever the visitor hires, so leave them alone.
  if (!blueprint.inScope) return blueprint;
  const usesAzureCompute = blueprint.steps.some((step) => AZURE_COMPUTE.has(step.tool));
  const others = blueprint.questionsForYou.filter((q) => !LANGUAGE_QUESTION.test(q));
  const questionsForYou = usesAzureCompute
    ? [...others.slice(0, 2), AZURE_STANDARDS_QUESTION]
    : others;
  return { ...blueprint, questionsForYou };
}

// Looks like code, config, or markup. Terry explains what and why, never how.
const CODE_PATTERN = /`|=>|[{}]|<\/?[a-z][\w-]*[^>]*>/i;

// A RESTlet is called into NetSuite, so something in the plan must be able to sign
// OAuth 1.0a. Power Automate and Copilot Studio can't.
const RESTLET_CALLERS: ReadonlySet<string> = new Set([
  "Azure Functions",
  "Azure Container Apps",
  "3PL / partner API",
]);

// Jacob picks the language on the call, so an in-scope blueprint never names one.
const LANGUAGE_PATTERN = /\.net\b|\bc#|\bpython\b|\btypescript\b|\bjavascript\b|\bfastapi\b/i;
// Case-sensitive on purpose: "node" is also an ordinary word.
const NODE_PATTERN = /\bNode(\.js)?\b/;

/**
 * Rules the JSON schema can't express: what an in-scope vs. out-of-scope blueprint must
 * contain, and "no code, ever". Returns the problems found, or an empty array.
 */
export function blueprintProblems(blueprint: Blueprint): string[] {
  const problems: string[] = [];

  if (blueprint.inScope) {
    if (blueprint.steps.length < 2) problems.push("in-scope blueprint needs at least 2 steps");
    if (blueprint.yikes.length < 1) problems.push("in-scope blueprint needs at least 1 yikes");
    if (blueprint.complexity === null) problems.push("in-scope blueprint needs a complexity");
    const tools = blueprint.steps.map((step) => step.tool);
    if (tools.includes("NetSuite RESTlet") && !tools.some((tool) => RESTLET_CALLERS.has(tool))) {
      problems.push("RESTlet has no caller that can sign OAuth 1.0a");
    }
  } else {
    if (blueprint.steps.length > 0) problems.push("out-of-scope blueprint must not have steps");
    if (blueprint.questionsForYou.length < 1) problems.push("out-of-scope answer needs questions");
  }

  const text = [
    blueprint.headline,
    blueprint.summary,
    ...blueprint.steps.flatMap((step) => [step.title, step.why]),
    ...blueprint.humanCheckpoints,
    ...blueprint.yikes,
    ...blueprint.questionsForYou,
  ];
  if (text.some((line) => CODE_PATTERN.test(line))) problems.push("contains code-like text");
  // Out-of-scope answers may echo the visitor's own stack ("a Python shop"), so only in scope.
  if (
    blueprint.inScope &&
    text.some((line) => LANGUAGE_PATTERN.test(line) || NODE_PATTERN.test(line))
  ) {
    problems.push("names a programming language or framework");
  }

  return problems;
}
