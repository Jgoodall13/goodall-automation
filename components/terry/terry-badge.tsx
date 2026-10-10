"use client";

import { useState } from "react";
import type { Blueprint } from "@/lib/terry/schema";
import { BlueprintView } from "./blueprint-view";

// Shown under the contact form's problem box while a Terry blueprint is attached.
export function TerryBadge({ blueprint, onRemove }: { blueprint: Blueprint; onRemove: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div id="terry-badge" className="flex flex-col gap-3 rounded-xl border border-line bg-paper px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <p role="status" className="font-medium">
          <span aria-hidden className="text-accent-text">✓</span> Terry&apos;s blueprint attached
        </p>
        <span aria-hidden className="text-muted">·</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="terry-badge-preview"
          className="rounded font-medium text-muted underline underline-offset-4 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {open ? "Hide" : "View"}
        </button>
        <span aria-hidden className="text-muted">·</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove Terry's blueprint"
          className="rounded font-medium text-muted underline underline-offset-4 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Remove <span aria-hidden>×</span>
        </button>
      </div>
      {open && (
        <div
          id="terry-badge-preview"
          className="max-h-96 overflow-y-auto border-t border-line pt-4 pb-1"
        >
          <BlueprintView blueprint={blueprint} />
        </div>
      )}
    </div>
  );
}
