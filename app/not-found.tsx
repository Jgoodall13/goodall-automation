import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-32 sm:px-8">
      <p className="font-mono text-sm text-accent-text">404</p>
      <h1 className="text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl">
        This page didn&apos;t make the cut.
      </h1>
      <p className="text-lg text-muted">Whatever you were looking for isn&apos;t here.</p>
      <ButtonLink href="/">Back home</ButtonLink>
    </section>
  );
}
