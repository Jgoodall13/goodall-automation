import Link from "next/link";
import { SITE } from "@/lib/site";

// `compact` tightens the logo on small phones (the header) so it doesn't crowd the nav.
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap ${compact ? "max-[400px]:gap-2 max-[400px]:text-[15px]" : ""}`}
    >
      <span
        aria-hidden
        className={`grid size-7 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-accent-fg transition group-hover:rotate-6 ${compact ? "max-[400px]:size-6 max-[400px]:text-xs" : ""}`}
      >
        G
      </span>
      <span className={compact ? "max-[360px]:sr-only" : undefined}>{SITE.name}</span>
    </Link>
  );
}
