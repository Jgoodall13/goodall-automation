import Link from "next/link";
import { SITE } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap">
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-accent-fg transition group-hover:rotate-6"
      >
        G
      </span>
      {SITE.name}
    </Link>
  );
}
