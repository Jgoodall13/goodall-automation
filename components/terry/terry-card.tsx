"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_PROBLEM_LENGTH } from "@/lib/terry/config";
import type { Blueprint } from "@/lib/terry/schema";
import { useTerryAttachment } from "./attachment";
import { BlueprintView } from "./blueprint-view";
import { Turnstile } from "./turnstile";

// Terry is optional and never writes into the contact form. The only link is the attachment
// context: "Add to my request" hands the form a blueprint it can send along.

type Status = "closed" | "open" | "loading" | "done" | "limited";

const LOADING_LINES = [
  "Reading your mess…",
  "Checking what could go wrong…",
  "Drawing boxes and arrows…",
];

const ERROR_MESSAGE = "Terry tripped over a cable. The form still works great.";
const NOT_VERIFIED_MESSAGE = "Terry couldn't confirm you're human. Give it another try.";
const LIMITED_MESSAGE =
  "Terry's already drawn you one blueprint today. Send it over, or just use the form.";

// Inlined at build time. Without it (local dev with no Turnstile set up) the widget is skipped.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function TerryCard() {
  const [status, setStatus] = useState<Status>("closed");
  const [problem, setProblem] = useState("");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  // Changing this remounts Turnstile for a fresh token; each one works for a single request.
  const [widgetKey, setWidgetKey] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const attachment = useTerryAttachment();
  const attached = blueprint !== null && attachment.blueprint === blueprint;

  function addToRequest() {
    if (!blueprint) return;
    attachment.attach(blueprint);
    // Once the badge under the form's problem box renders, center it if it's off screen
    // (or under the sticky header). On desktop the form is sticky, so usually no scroll.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      const badge = document.getElementById("terry-badge");
      if (!badge) return;
      const { top, bottom } = badge.getBoundingClientRect();
      if (top < 80 || bottom > window.innerHeight) {
        badge.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
  }

  useEffect(() => {
    if (status === "open") textareaRef.current?.focus();
    if (status === "done" || status === "limited") resultRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setInterval(() => setLineIndex((i) => (i + 1) % LOADING_LINES.length), 2200);
    return () => clearInterval(timer);
  }, [status]);

  async function askTerry(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = problem.trim();
    if (!trimmed) return;

    setError(null);
    setLineIndex(0);
    setStatus("loading");
    try {
      const res = await fetch("/api/terry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: trimmed, turnstileToken: token }),
      });
      if (res.status === 429) {
        setStatus("limited");
        return;
      }
      const data = await res.json();
      if (res.status === 403) {
        setError(NOT_VERIFIED_MESSAGE);
        setStatus("open");
        return;
      }
      if (!res.ok || !data.ok) throw new Error(data.error ?? "terry_failed");
      setBlueprint(data.blueprint);
      setRemaining(data.remaining ?? 0);
      setStatus("done");
    } catch {
      setError(ERROR_MESSAGE);
      setStatus("open");
    } finally {
      setToken(null);
      setWidgetKey((k) => k + 1);
    }
  }

  function askAgain() {
    setProblem("");
    setError(null);
    setStatus("open");
  }

  return (
    <div className="flex flex-col gap-3">
      <section
        aria-labelledby="terry-title"
        className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-7"
      >
        <div className="flex gap-4">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-term font-mono text-lg font-bold text-accent"
          >
            T
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 id="terry-title" className="text-lg leading-snug font-semibold tracking-tight">
              Not sure where to start? Ask Terry.
            </h3>
            <p className="text-[15px] leading-relaxed text-muted">
              My blueprint agent, built on the patterns and guardrails from real NetSuite +
              Microsoft 365 builds. Describe the mess, get a plan. Optional. The form works fine
              without him.
            </p>
          </div>
        </div>

        {status === "closed" && (
          <button
            type="button"
            onClick={() => setStatus("open")}
            aria-expanded={false}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-line px-5 text-[15px] font-semibold transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ask Terry <span aria-hidden>→</span>
          </button>
        )}

        {(status === "open" || status === "loading") && (
          <form onSubmit={askTerry} className="flex flex-col gap-3">
            <label htmlFor="terry-problem" className="text-[15px] font-medium">
              Describe the mess
            </label>
            <textarea
              ref={textareaRef}
              id="terry-problem"
              rows={5}
              maxLength={MAX_PROBLEM_LENGTH}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={status === "loading"}
              placeholder="e.g. Our 3PL emails tracking numbers and someone types them into NetSuite every afternoon."
              aria-describedby="terry-note terry-count"
              className="w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:outline-none disabled:opacity-60"
            />
            <div className="flex items-start justify-between gap-4 text-sm text-muted">
              <p id="terry-note">
                Your description is sent to an AI model to build the blueprint. Don&apos;t include
                passwords or customer data.
              </p>
              <span id="terry-count" className="shrink-0 font-mono text-xs tabular-nums">
                {problem.length}/{MAX_PROBLEM_LENGTH}
              </span>
            </div>

            {TURNSTILE_SITE_KEY && (
              <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
            )}

            {error && (
              <p role="alert" className="text-[15px] text-accent-text">
                {error}
              </p>
            )}

            {status === "loading" ? (
              <p
                role="status"
                className="flex h-12 items-center gap-3 font-mono text-sm text-muted"
              >
                <span className="size-2 rounded-full bg-accent motion-safe:animate-pulse" />
                {LOADING_LINES[lineIndex]}
              </p>
            ) : (
              <button
                type="submit"
                disabled={!problem.trim() || (!!TURNSTILE_SITE_KEY && !token)}
                className="inline-flex h-12 items-center justify-center self-start rounded-full bg-accent px-6 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Get my blueprint
              </button>
            )}
          </form>
        )}

        {status === "done" && blueprint && (
          <div
            ref={resultRef}
            tabIndex={-1}
            aria-label="Terry's blueprint"
            className="flex flex-col gap-6 border-t border-line pt-6 focus:outline-none"
          >
            <BlueprintView blueprint={blueprint} />
            <div className="flex flex-col items-start gap-2">
              {attached ? (
                <p className="flex h-12 items-center text-[15px] font-semibold">
                  <span aria-hidden className="mr-2 text-accent-text">✓</span>
                  Attached to your request
                </p>
              ) : (
                <button
                  type="button"
                  onClick={addToRequest}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Add to my request
                </button>
              )}
              <p className="text-sm text-muted">No commitment. It just gives me a head start.</p>
            </div>
            <div className="flex flex-col items-start gap-1 border-t border-line pt-4 font-mono text-xs text-muted">
              <p>Built from Jacob&apos;s playbook. A sketch, not a quote.</p>
              {remaining > 0 ? (
                <button
                  type="button"
                  onClick={askAgain}
                  className="mt-2 rounded font-sans text-sm font-medium text-ink underline underline-offset-4 transition hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Ask Terry something else
                </button>
              ) : (
                <p>Terry&apos;s done for today.</p>
              )}
            </div>
          </div>
        )}

        {status === "limited" && (
          <div
            ref={resultRef}
            tabIndex={-1}
            role="status"
            className="text-[15px] text-muted focus:outline-none"
          >
            {LIMITED_MESSAGE}
          </div>
        )}
      </section>

      {status === "closed" && (
        <p className="px-1 font-mono text-xs text-muted">
          Prefer a human? Skip Terry. He won&apos;t take it personally.
        </p>
      )}
    </div>
  );
}
