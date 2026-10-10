"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { SITE } from "@/lib/site";
import { formatBlueprintText } from "@/lib/terry/format";
import { type Blueprint, BlueprintSchema } from "@/lib/terry/schema";

const contactSchema = z.object({
  name: z.string().min(1, "I'll need a name.").max(100, "Keep it under 100 characters."),
  email: z.email("That email doesn't look right.").max(200, "Keep it under 200 characters."),
  problem: z
    .string()
    .min(10, "Give me a little more to go on.")
    .max(5000, "Keep it under 5,000 characters."),
});

// With a Terry blueprint attached, the problem box becomes optional.
const contactWithBlueprintSchema = contactSchema.extend({
  problem: z.string().max(5000, "Keep it under 5,000 characters."),
});

/** The attached Terry blueprint, if present and valid. Anything else is silently ignored. */
function parseTerryBlueprint(raw: FormDataEntryValue | null): Blueprint | null {
  if (typeof raw !== "string" || !raw || raw.length > 20_000) return null;
  try {
    const result = BlueprintSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

type Field = keyof z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Record<Field, string>;
};

const brokenMessage =
  "Something broke on my end. Ironic, I know. Give it another shot in a minute.";

// Best-effort, per-instance rate limit. Serverless instances come and go, so this stops
// one bot hammering the form, not a determined one. If spam gets through, add a Vercel
// WAF rate-limit rule or Turnstile.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (recentByIp.size > 5000) recentByIp.clear();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);
  return hits.length > RATE_MAX;
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: hidden from people, irresistible to bots. Pretend it worked.
  if (formData.get("website")) return { status: "success" };

  const values: Record<Field, string> = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    problem: String(formData.get("problem") ?? "").trim(),
  };

  const blueprint = parseTerryBlueprint(formData.get("terryBlueprint"));
  const parsed = (blueprint ? contactWithBlueprintSchema : contactSchema).safeParse(values);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    const errors: Partial<Record<Field, string>> = {};
    for (const field of Object.keys(fieldErrors) as Field[]) {
      errors[field] = fieldErrors[field]?.[0];
    }
    return { status: "error", errors, values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      values,
      message: "That's a lot of problems. Give it a few minutes and try again.",
    };
  }

  const subject = `New problem from ${values.name.replace(/[\r\n]+/g, " ")}${blueprint ? " (+ Terry's blueprint)" : ""}`;
  // Without a blueprint this is exactly the original email.
  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    "",
    values.problem || "(No message. Terry's blueprint is attached.)",
    ...(blueprint ? ["", "------------------------------", "", formatBlueprintText(blueprint)] : []),
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[contact] Resend not configured. Would have sent:\n\nSubject: ${subject}\n\n${text}`);
      return { status: "success" };
    }
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return { status: "error", values, message: brokenMessage };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? `${SITE.name} <onboarding@resend.dev>`,
        to: [to],
        reply_to: values.email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend rejected the email:", res.status, await res.text());
      return { status: "error", values, message: brokenMessage };
    }
  } catch (err) {
    console.error("[contact] Could not reach Resend:", err);
    return { status: "error", values, message: brokenMessage };
  }

  return { status: "success" };
}
