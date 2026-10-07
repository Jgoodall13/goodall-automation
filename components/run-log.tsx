// Illustrative hero visual: an example agent run, not real client data.
const steps = [
  { time: "09:14:02", text: "PO email received", detail: "customer_po_4471.pdf" },
  { time: "09:14:05", text: "Agent extracted 14 line items" },
  { time: "09:14:06", text: "Customer + SKUs matched in NetSuite" },
  { time: "09:14:07", text: "Sales order created", detail: "SO-10482" },
  { time: "09:14:08", text: "Rep pinged in Teams" },
];

export function RunLog() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-term-line bg-term font-mono text-[13px] text-term-text shadow-2xl shadow-black/20 sm:text-sm">
      <div className="flex items-center justify-between gap-4 border-b border-term-line px-5 py-3.5">
        <span className="min-w-0">
          order-intake-agent <span className="whitespace-nowrap text-term-muted">· example run</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 rounded-full border border-ok/30 px-2.5 py-0.5 text-xs text-ok">
          <span className="size-1.5 rounded-full bg-ok motion-safe:animate-pulse" />
          succeeded
        </span>
      </div>
      <ol className="flex flex-col gap-3 px-5 py-5">
        {steps.map((step, i) => (
          <li
            key={step.time}
            className="flex gap-4 motion-safe:animate-log-in"
            style={{ animationDelay: `${300 + i * 350}ms` }}
          >
            <span className="text-term-muted">{step.time}</span>
            <span className="text-ok">✓</span>
            <span>
              {step.text}
              {step.detail && <span className="text-term-muted"> {step.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
      <figcaption
        className="border-t border-term-line px-5 py-4 text-term-muted motion-safe:animate-log-in"
        style={{ animationDelay: `${300 + steps.length * 350}ms` }}
      >
        Done in <span className="text-term-text">6s</span>. Nobody touched a keyboard.
      </figcaption>
    </figure>
  );
}
