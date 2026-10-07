import Link from "next/link";

const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  secondary: "border border-line text-ink hover:border-ink",
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
