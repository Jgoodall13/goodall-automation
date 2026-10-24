import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { RunLog } from "@/components/run-log";
import { TerryAttachmentProvider } from "@/components/terry/attachment";
import { TerryCard } from "@/components/terry/terry-card";
import { SITE } from "@/lib/site";
import { isTerryEnabled } from "@/lib/terry/config";

const reasons = [
  {
    title: "The right architecture, every time.",
    body: "Sometimes the answer is a script. Sometimes it's a multi-step agent with a custom dashboard. Knowing which one before anyone writes code is the job, and it's usually the cheaper answer.",
    tools: ["Power Automate", "Copilot Studio", "SuiteScript", "Next.js", "TypeScript", "Workflow Automation"],
  },
  {
    title: "Agents that survive production.",
    body: "Guardrails enforced in code, not requested in a prompt. Every user's own permissions. Every call traced, measured, and tuned. Not a demo that works once.",
    tools: [
      "Microsoft Foundry",
      "LangGraph",
      "Python",
      "MCP",
      "Foundry IQ",
      "Claude API",
      "RAG",
    ],
  },
  {
    title: "Deep in the systems.",
    body: "A decade inside ERPs, integrations, and cloud infrastructure. I've lived in the systems I'm automating, and I deploy, secure, and run what I build.",
    tools: [
      "NetSuite",
      "Microsoft 365",
      "Azure",
      "Entra ID",
      ".NET",
      "SQL Server",
      "Linux",
      "DevOps",
    ],
  },
];

export default function Home() {
  // Read at build time; the page is static. Flipping TERRY_ENABLED in Vercel needs a redeploy.
  const terryEnabled = isTerryEnabled();

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-24 sm:px-8 sm:pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-32">
        <div className="flex flex-col items-start gap-7">
          <p className="flex items-start gap-2.5 font-mono text-[13px] tracking-wide text-muted uppercase">
            <span className="mt-[5px] size-2 shrink-0 rounded-full bg-accent" />
            {SITE.pitch}
          </p>
          <h1 className="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Agents & Automations that do real work.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            From a script that saves an afternoon to an AI agent that works across your systems. I
            solve the problem, and build the solution your team needs.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="#contact">Tell me your problem</ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See the work
            </ButtonLink>
          </div>
        </div>
        <RunLog />
      </section>

      {/* Why me */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-[13px] tracking-wide text-accent-text uppercase">Why me</p>
            <h2 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
              Glad you asked.
            </h2>
          </div>
          <ol className="mt-14 grid gap-5 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <li
                key={reason.title}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-7"
              >
                <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
                <h3 className="text-2xl leading-snug font-semibold tracking-tight">{reason.title}</h3>
                <p className="leading-relaxed text-muted">{reason.body}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-3">
                  {reason.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-10 font-mono text-sm text-muted">
            I hunt the failures that don&apos;t throw errors.
          </p>
        </div>
      </section>

      {/* The bridge */}
      <section className="border-y border-term-line bg-term text-term-text">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-5 py-24 sm:px-8 lg:py-32">
          <p className="max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            <span className="text-accent">Want proof?</span> See the work.{" "}
            <span className="text-accent">Want ideas?</span> Take them.{" "}
            <span className="text-term-muted">
              When you&apos;re ready to build it properly, I&apos;m here.
            </span>
          </p>
          <ButtonLink href="/work">See the work →</ButtonLink>
        </div>
      </section>

      {/* Intake */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        {/* Lets Terry hand the form a blueprint. With nothing attached, the form is unchanged. */}
        <TerryAttachmentProvider>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-[13px] tracking-wide text-accent-text uppercase">Contact</p>
              <h2 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
                Got a problem? Perfect.
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                I solve them. Send me your name, your email, and what&apos;s broken. I&apos;ll get back
                to you with what we can do about it.
              </p>
              <ol className="mt-4 flex flex-col gap-3 font-mono text-sm text-muted">
                <li>
                  <span className="text-accent-text">01</span> You tell me what&apos;s eating your week.
                </li>
                <li>
                  <span className="text-accent-text">02</span> I come back with ideas and options.
                </li>
                <li>
                  <span className="text-accent-text">03</span> If it&apos;s a fit, we build it.
                </li>
              </ol>
              {terryEnabled && (
                <div className="mt-6">
                  <TerryCard />
                </div>
              )}
            </div>
            {/* Sticky on desktop so the form stays in view next to a long Terry blueprint. */}
            <div className="self-start rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-24">
              <ContactForm />
            </div>
          </div>
        </TerryAttachmentProvider>
      </section>
    </>
  );
}
