import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { RunLog } from "@/components/run-log";
import { TerryAttachmentProvider } from "@/components/terry/attachment";
import { TerryCard } from "@/components/terry/terry-card";
import { SITE } from "@/lib/site";
import { isTerryEnabled } from "@/lib/terry/config";

const reasons = [
  {
    title: "10 years in the trenches.",
    body: "A decade inside .NET, NetSuite, and ecommerce. I don't need a tour of your systems. I've lived in them.",
    tools: [
      ".NET",
      "NetSuite",
      "SuiteScript",
      "SQL Server",
      "TypeScript",
      "Node.js",
      "Python",
      "React",
    ],
  },
  {
    title: "Agents and automation.",
    body: "I build the thing that actually does the work. Not a slick demo that works once, a system your team stops thinking about. Copilot Studio when you live in Teams. Claude when the job needs real reasoning.",
    tools: [
      "Copilot Studio",
      "Azure AI Foundry",
      "Power Automate",
      "Claude API",
      "Custom MCP servers",
      "RAG",
    ],
  },
  {
    title: "The cloud doesn't scare me.",
    body: "I don't hand off a prototype and disappear. I deploy it, secure it, and keep it running. Your IT team will like me too.",
    tools: ["Azure", "Entra ID", "Linux", "DevOps pipelines"],
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
            I automate the work your team hates.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            You run on Microsoft 365, NetSuite, and spreadsheets held together with hope. I build
            the agents and flows that make it run itself.
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
        </div>
      </section>

      {/* The cocky bridge */}
      <section className="border-y border-term-line bg-term text-term-text">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-5 py-24 sm:px-8 lg:py-32">
          <p className="max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            <span className="text-accent">Want proof?</span> Go look at the work.{" "}
            <span className="text-accent">Want ideas?</span> Take them. Seriously, steal whatever you
            want.{" "}
            <span className="text-term-muted">
              When you&apos;re ready to actually build it, I&apos;m right here.
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
