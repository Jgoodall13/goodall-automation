import type { Blueprint } from "@/lib/terry/schema";

// Renders one of Terry's blueprints. No hooks, so it works anywhere: the Terry card now,
// the attached-blueprint preview in the contact form later.
export function BlueprintView({ blueprint }: { blueprint: Blueprint }) {
  if (!blueprint.inScope) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-lg leading-snug font-semibold tracking-tight">
          That&apos;s outside Jacob&apos;s wheelhouse. Here&apos;s what I&apos;d ask anyone you hire:
        </p>
        <p className="text-[15px] leading-relaxed text-muted">{blueprint.summary}</p>
        <NumberedList items={blueprint.questionsForYou} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xl leading-snug font-semibold tracking-tight text-balance">
            {blueprint.headline}
          </p>
          {blueprint.complexity && (
            <span className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
              {blueprint.complexity}
            </span>
          )}
        </div>
        <p className="text-[15px] leading-relaxed text-muted">{blueprint.summary}</p>
      </div>

      <Section label="The plan">
        <ol className="flex flex-col gap-5">
          {blueprint.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
              <div className="flex flex-col items-start gap-1.5">
                <span className="font-semibold tracking-tight">{step.title}</span>
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
                  {step.tool}
                </span>
                <span className="text-[15px] leading-relaxed text-muted">{step.why}</span>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {blueprint.humanCheckpoints.length > 0 && (
        <Section label="Human checkpoints">
          <BulletList items={blueprint.humanCheckpoints} />
        </Section>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-term-line bg-term p-5 text-term-text sm:p-6">
        <p className="text-lg font-semibold tracking-tight text-accent">Yikes</p>
        <ul className="flex flex-col gap-3">
          {blueprint.yikes.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
              <span aria-hidden className="font-mono text-accent">!</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {blueprint.questionsForYou.length > 0 && (
        <Section label="Questions I'd ask you">
          <NumberedList items={blueprint.questionsForYou} />
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[13px] tracking-wide text-accent-text uppercase">{label}</p>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
          <span aria-hidden className="text-muted">·</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
          <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}
