# Site update v2: AI agents, architected and built

## What's changing and why
Goodall Automation keeps its name, but the message shifts. **Automation is the result; AI agents are the method.**
The site should read as: *I architect and build AI agents that run your processes*: single agents,
multi-agent systems, and the orchestration between them, with workflow automation as the right answer when an agent isn't needed.

This is the **first step** of a bigger update coming over the next few months (new title, more certifications,
more projects). Keep changes focused. Don't redesign. The goal is direction, plus a certifications section
that's ready to grow.

**Tone:** same as now: confident, calm, dry. Judgment over hype.

## Ground rules
- Work in phases and **STOP after each one** for review.
- Don't touch the contact form's behavior, rate limiting, Turnstile, or Resend.
- Keep projects anonymized: no employer, customer, colleague, or vendor names, no record numbers, no repo URLs. Product names (NetSuite, Wrike, Stripe, Teams) are fine.
- **Offer vs. proof:** multi-agent and orchestration can appear as *what Jacob offers*.
- The site copy has changed since earlier briefs. Find the current strings in the repo rather than assuming earlier wording.

---

## Phase 1: Home page positioning + metadata

### Hero
- **Eyebrow:** `AI agents, architected and built`
- **Headline (replace "Agents & Automations that do real work."):**
  > I architect and build AI agents that run your processes.
- **Subhead (replace):**
  > One agent, a team of agents, or just a well-placed workflow. I design the architecture, build it, and run it in production. And if a script will do, I'll tell you.
- Keep both buttons ("Tell me your problem", "See the work").
- **Leave the run log as-is** (vendor-inbox example).

### Why me
Keep the "Why me / Glad you asked." heading and the three-beat layout.

**01: The right architecture, every time.** (replace body)
> One agent or several? Copilot Studio or code? Or no agent at all? Deciding that before anyone builds is the job, and it's usually the cheaper answer.

Chips: keep current, make sure they include `Agent architecture` `Copilot Studio` `Microsoft Foundry` `Power Automate` `MCP`

**02: Agents that survive production.** (keep body)
Chips: keep current, make sure they include `Microsoft Foundry` `LangGraph` `Python` `MCP` `Foundry IQ` `Evals & tracing`

**03: Deep in the systems.** (replace body)
> A decade inside ERPs, integrations, and cloud infrastructure. Agents are only as good as their access to real systems, and I know how to give them that access safely.

Chips: keep current.

Keep the closing line: *I hunt the failures that don't throw errors.*

### Terry card copy (contact section)
Update the card description to:
> My blueprint agent. Describe the process, and Terry sketches the architecture: a workflow, one agent, or a team of agents, plus the risks. Optional. The form below works fine without him.

### Metadata
- Title: `Goodall Automation · AI agents, architected and built`
- Description: `AI agent architecture and implementation for growing businesses. Single agents, multi-agent systems, and workflow automation, built on the systems you already run.`
- Update Open Graph tags to match.
- Footer tagline: keep "Automate it all."

**STOP. Show me the home page (desktop + phone, light + dark).**

---

## Phase 2: Certifications section (data-driven, ready to grow)

### Placement
Home page, **directly under the three Why me beats**, above the closing line.
Small mono label in the existing style: `Certifications`.

### Data
Create `lib/certifications.ts`:

```ts
export type CertStatus = "earned" | "in-progress";

export type Certification = {
  code: string;            // "AI-103"
  name: string;            // full official name
  issuer: "Microsoft" | "AWS";
  level: "Associate" | "Expert" | "Professional" | "Specialty";
  status: CertStatus;
  earnedDate?: string;     // "2026-12"
  credentialUrl?: string;  //Probably won't use
};

export const CERTIFICATIONS: Certification[] = [
  {
    code: "AI-103",
    name: "Microsoft Certified: Azure AI Apps and Agents Developer Associate",
    issuer: "Microsoft",
    level: "Associate",
    status: "in-progress",
  },
];
```

- Layout must work with 1 cert today and about 8 later (AI-103, AZ-104, AI-200, AI-300, AI-500, AB-100, plus AWS). A responsive grid of compact cards is fine. Keep it visually quieter than the three beats.
- Order: newest earned first


**STOP. Show me the section in dev (with AI-103 in progress) and confirm it's hidden in a production build.**

---

## Phase 3: Terry, architecture-first

Terry should now lead with the **architecture call**: workflow, single agent, or multi-agent. That decision is the
core of Jacob's pitch, and Terry should show it.

### schema.ts
Add two fields to `BlueprintSchema`:

```ts
export const ARCHITECTURES = ["Workflow automation", "Single agent", "Multi-agent"] as const;

architecture: z.enum(ARCHITECTURES).nullable(),   // null when out of scope
architectureWhy: z.string().max(200).nullable(),  // why this shape, and why not the simpler one
```

In `blueprintProblems()`:
- In scope: `architecture` and `architectureWhy` must both be non-null.
- Out of scope: both must be null.
- Run `architectureWhy` through the same code-pattern and language-pattern checks as the other text fields.

Leave `ALLOWED_TOOLS` unchanged.

### prompt.ts
1. Opening line: change to *"...Jacob Goodall's AI agent architecture and implementation practice. Visitors describe an operational problem; you return a short blueprint."*
2. Add a new section **before** "Choosing the agent":

```
Choosing the architecture (decide this first, smallest that works):
- Workflow automation: the rules are fixed and the inputs are structured. No AI judgment needed. Say plainly that no agent is needed; that honesty is the point.
- Single agent: the work needs judgment over messy input (emails, documents, questions) or tools from a few systems, but it's one job.
- Multi-agent: only when the work splits into distinct jobs that need different tools, permissions, or instructions (e.g. one agent triages and classifies, a separate agent with narrower permissions writes to the system of record). Say why one agent isn't enough. Never pick multi-agent just because it sounds advanced.
- architectureWhy: one or two plain sentences on why this shape, and why not the simpler one.
```

3. In "How to fill in the blueprint", add `architecture` and `architectureWhy` with the rules above. Out of scope: both null.
4. Keep everything else: playbook facts, hosting rules, scope, voice, yikes guidance.

### Rendering
- Show `architecture` as a pill next to the headline (same style the old complexity pill used), with `architectureWhy` as one muted line under the summary.
- Include both in the "attached blueprint" badge preview and in the Resend email, right after the headline.

### Tests / QA (add these to the existing Terry checks)
- [ ] "Every night we export a CSV from NetSuite and email it to the same 3 people" → **Workflow automation**, and it says no agent is needed.
- [ ] "Sales reps keep asking ops for order status in Teams" → **Single agent** (Copilot Studio over an MCP connection).
- [ ] "Vendor emails come in about POs; we need them classified, matched to the right PO, and updated in NetSuite with a human approving risky changes" → Single agent or Multi-agent. If multi-agent, `architectureWhy` must justify the split.
- [ ] Out-of-scope prompt → `architecture` and `architectureWhy` null, no pill rendered.
- [ ] Existing QA still passes: no code, no languages, RESTlet caller rule, Azure standards question.

**STOP. Run the QA prompts and show me the blueprints.**

---

## Phase 4: Sweep + QA
1. Search the repo for leftover old positioning and list the hits before changing anything: `Agents & Automations that do real work`, `AI agents & workflow automation`, `workflow automation practice`.
2. Fix hits in user-facing copy and metadata.
3. Check:
   - [ ] Home and Work at desktop and phone widths, light and dark
   - [ ] Certifications: visible in dev, hidden in a production build
   - [ ] Anchor links still work
   - [ ] Type check, lint, and build pass

**STOP. Report what changed.**

---

## Coming later (don't build now)
- New title from Overture → update hero/about copy.
- More certifications as earned (data change only).
- New projects (multi-agent and orchestration work once it's in production) → Work page.
- Usual Suspects reworked into agent use cases.
- Terry's playbook updated for multi-agent orchestration patterns once Jacob better understand his style and implimentation.