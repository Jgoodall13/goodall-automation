import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-1">
          <Logo />
          <p className="font-mono text-sm text-muted">{SITE.tagline}</p>
        </div>
        <nav className="flex gap-6 text-[15px] text-muted">
          <Link href="/" className="transition hover:text-ink">
            Home
          </Link>
          <Link href="/work" className="transition hover:text-ink">
            Work
          </Link>
          <Link href="/#contact" className="transition hover:text-ink">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
