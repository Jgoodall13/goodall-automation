import Link from "next/link";
import { ButtonLink } from "./button-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/work"
            className="rounded-full px-3 py-2 text-[15px] font-medium text-muted transition hover:text-ink sm:px-4"
          >
            Work
          </Link>
          <ButtonLink href="/#contact" className="h-10 px-4 sm:px-5">
            <span className="sm:hidden">Contact</span>
            <span className="hidden sm:inline">Tell me your problem</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
