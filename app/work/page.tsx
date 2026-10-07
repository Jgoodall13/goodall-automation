import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real automation and AI agent projects: the problem, what I built, why I picked the tools, and what it saved.",
};

export default function WorkPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24">
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="font-mono text-[13px] tracking-wide text-accent-text uppercase">The work</p>
          <h1 className="text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
            Receipts.
          </h1>
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            Every project here follows the same shape: the problem, what I built, why I picked
            those tools, and what it saved. Steal any idea you like. When you want it built right,
            you know where to find me.
          </p>
          <p className="font-mono text-sm text-muted">
            Client details are anonymized. The problems are real.
          </p>
        </div>

        <nav aria-label="Projects" className="mt-14">
          <ol className="grid gap-3 md:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.slug}>
                <a
                  href={`#${project.slug}`}
                  className="group flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition hover:border-ink"
                >
                  <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
                  <span className="font-semibold tracking-tight">{project.title}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{project.summary}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {projects.map((project, i) => (
          <article
            key={project.slug}
            id={project.slug}
            className="grid gap-10 border-t border-line py-16 lg:grid-cols-[300px_1fr] lg:gap-16 lg:py-24"
          >
            <header className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
              <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
                {project.title}
              </h2>
              <p className="text-muted">{project.client}</p>
              <ul className="flex flex-wrap gap-2 pt-1">
                {project.stack.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </header>

            <div className="flex max-w-2xl flex-col gap-10">
              <Block label="The problem">{project.problem}</Block>
              <Block label="The build">{project.build}</Block>
              <Block label="Why these tools">{project.whyTheseTools}</Block>
              <div className="flex flex-col gap-4">
                <h3 className="font-mono text-[13px] tracking-wide text-accent-text uppercase">
                  The result
                </h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {project.results.map((result) => (
                    <div
                      key={result.label}
                      className="flex flex-col-reverse gap-1 rounded-2xl border border-line bg-surface p-6"
                    >
                      <dt className="text-[15px] text-muted">{result.label}</dt>
                      <dd className="text-4xl font-semibold tracking-tight">{result.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-24 sm:px-8 lg:py-32">
          <h2 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Seen enough? Your problem could be the next write-up.
          </h2>
          <ButtonLink href="/#contact">Tell me your problem</ButtonLink>
        </div>
      </section>
    </>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-mono text-[13px] tracking-wide text-accent-text uppercase">{label}</h3>
      <p className="text-lg leading-relaxed">{children}</p>
    </div>
  );
}
