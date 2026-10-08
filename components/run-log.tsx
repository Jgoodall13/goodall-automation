// Hero visual: a fictional run of the vendor inbox flow (see lib/projects.ts).
// Vendor, PO numbers, and tracking number are invented. Keep it that way: no real
// names, mailboxes, or IDs.
type Step = { time: string; text: string; detail?: string };

const steps: Step[] = [
  { time: "09:14:02", text: "Acme Supply → tracking update", detail: "\"Shipped: PO-58213S\"" },
  { time: "09:14:41", text: "Acme Supply → backorder", detail: "\"PO 58213 delayed 2 wks\"" },
  { time: "09:17:00", text: "PO-58213S: exact match", detail: "14/14 safety checks passed" },
  { time: "09:17:01", text: "Tracking written to NetSuite", detail: "TRK-4471-0098-2213" },
  { time: "09:17:01", text: "Customer emailed their tracking" },
  { time: "09:17:02", text: "PO-58213: exact match", detail: "14/14 safety checks passed" },
  { time: "09:17:02", text: "Ship date updated in NetSuite", detail: "+2 wks" },
];

export function RunLog() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-term-line bg-term font-mono text-[13px] text-term-text shadow-2xl shadow-black/20 sm:text-sm">
      <div className="flex items-center justify-between gap-4 border-b border-term-line px-5 py-3.5">
        <span className="min-w-0">
          vendor-inbox <span className="whitespace-nowrap text-term-muted">· example run</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 rounded-full border border-ok/30 px-2.5 py-0.5 text-xs text-ok">
          <span className="size-1.5 rounded-full bg-ok motion-safe:animate-pulse" />
          succeeded
        </span>
      </div>
      <ol className="flex flex-col gap-3 px-5 py-5">
        {steps.map((step, i) => (
          <li
            key={step.text}
            className="flex gap-4 motion-safe:animate-log-in"
            style={{ animationDelay: `${300 + i * 350}ms` }}
          >
            <span className="text-term-muted">{step.time}</span>
            <span className="w-4 shrink-0 text-center text-ok">✓</span>
            <span>
              {step.text}
              {step.detail && <span className="block text-term-muted">{step.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
      <figcaption
        className="border-t border-term-line px-5 py-4 text-term-muted motion-safe:animate-log-in"
        style={{ animationDelay: `${300 + steps.length * 350}ms` }}
      >
        2 POs updated. 0 humans needed. <span className="whitespace-nowrap text-term-text">0 guesses.</span>
      </figcaption>
    </figure>
  );
}
