"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/actions";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none aria-[invalid=true]:border-accent-text";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3 py-6">
        <p className="font-mono text-sm text-accent-text">✓ Received</p>
        <p className="text-2xl font-semibold tracking-tight">Got it.</p>
        <p className="text-muted">I&apos;ll get back to you with what we can build.</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <Field label="Name" name="name" error={state.errors?.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={state.values?.name}
          aria-invalid={!!state.errors?.name}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
          className={inputClass}
        />
      </Field>

      <Field label="Email" name="email" error={state.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
          defaultValue={state.values?.email}
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
          className={inputClass}
        />
      </Field>

      <Field label="What's the problem?" name="problem" error={state.errors?.problem}>
        <textarea
          id="problem"
          name="problem"
          required
          rows={5}
          maxLength={5000}
          defaultValue={state.values?.problem}
          placeholder="e.g. Two people spend every morning re-keying POs from email into NetSuite."
          aria-invalid={!!state.errors?.problem}
          aria-describedby={state.errors?.problem ? "problem-error" : undefined}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <p role="alert" className="text-[15px] text-accent-text">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70 sm:self-start"
      >
        {pending ? "Sending..." : "Send it"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[15px] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}
