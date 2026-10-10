"use client";

import { createContext, useContext, useState } from "react";
import type { Blueprint } from "@/lib/terry/schema";

// The one link between Terry and the contact form: a blueprint the visitor chose to attach.
// Without the provider, or with nothing attached, the form behaves exactly as it always has.

type TerryAttachment = {
  blueprint: Blueprint | null;
  attach: (blueprint: Blueprint) => void;
  detach: () => void;
};

const noAttachment: TerryAttachment = { blueprint: null, attach: () => {}, detach: () => {} };

const TerryAttachmentContext = createContext<TerryAttachment>(noAttachment);

export function TerryAttachmentProvider({ children }: { children: React.ReactNode }) {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  return (
    <TerryAttachmentContext.Provider
      value={{ blueprint, attach: setBlueprint, detach: () => setBlueprint(null) }}
    >
      {children}
    </TerryAttachmentContext.Provider>
  );
}

export function useTerryAttachment() {
  return useContext(TerryAttachmentContext);
}
