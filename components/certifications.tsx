import Image from "next/image";
import { CERTIFICATION_ROWS, type Certification } from "@/lib/certifications";

// Home page, under the three Why me beats. Each row is centered and every badge is one column
// wide (4 across, 2 on phones), so a shorter row sits centered under the columns above it.
export function Certifications() {
  const rows = CERTIFICATION_ROWS.filter((row) => row.length > 0);
  if (rows.length === 0) return null;

  return (
    <div className="mt-16 flex flex-col gap-10">
      <h3 className="font-mono text-[13px] tracking-wide text-accent-text uppercase">
        Certifications
      </h3>
      {rows.map((row, i) => (
        <ul key={i} className="flex flex-wrap justify-center gap-x-6 gap-y-10">
          {row.map((cert) => (
            <CertificationBadge key={cert.code} cert={cert} />
          ))}
        </ul>
      ))}
    </div>
  );
}

function CertificationBadge({ cert }: { cert: Certification }) {
  return (
    <li className="flex w-[calc((100%_-_1.5rem)/2)] flex-col items-center gap-1.5 text-center sm:w-[calc((100%_-_4.5rem)/4)]">
      {cert.badge ? (
        <Image src={cert.badge} alt="" width={96} height={96} className="size-24 object-contain" />
      ) : (
        <PlaceholderBadge />
      )}
      <span className="mt-2 font-mono text-sm text-accent-text">{cert.code}</span>
      <span className="max-w-56 text-[15px] leading-snug font-medium text-balance">{cert.name}</span>
      <span className="font-mono text-xs text-muted">{cert.year}</span>
    </li>
  );
}

// Neutral stand-in until the real badge image is added.
function PlaceholderBadge() {
  return (
    <svg aria-hidden viewBox="0 0 96 96" className="size-24">
      <path
        d="M48 6 84 27v42L48 90 12 69V27Z"
        className="fill-surface stroke-line"
        strokeWidth="2"
      />
      <path d="M48 26 66 36.5v21L48 68 30 57.5v-21Z" className="fill-line" />
    </svg>
  );
}
