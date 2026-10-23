# Project: [Goodall Automation | Goodall Labs] — consulting site

## What this is
Personal consulting site for Jacob Goodall: AI agents & workflow automation.
Two layers: workflow automation (repeatable, high-value fixes) and custom enterprise agents
(coded, guardrailed, per-user permissions, production-grade). NetSuite and Microsoft 365 are
proof of where the work has been done, not the headline.
Tone: confident, not cocky. Calm, direct, dry wit. Clean, minimal.

## Stack
Next.js (App Router, TypeScript), Tailwind, deployed on Vercel.
Brand name lives in ONE config constant (name not final yet).

## Pages
### Home (/)
1. Hero — eyebrow "AI agents & workflow automation", "I automate the work your team hates." + subhead
2. Why me — 3 beats about judgment, not tools:
   - The right architecture, every time
   - Agents that survive production
   - Deep in the systems (NetSuite, Microsoft 365, Azure as proof)
   Closing line: "I hunt the failures that don't throw errors."
3. Bridge — "Want proof? See the work. Want ideas? Take them. When you're ready to build it
   properly, I'm here." → /work
4. Intake form — "Got a problem? Perfect." Name, email, problem → submit

### Work (/work)
Project cards/write-ups, each: Problem → Build (+ why these tools) → Result (time/$ saved).
Content from a typed data file so adding projects = adding an object.
All client details anonymized.

## Form
Server Action → validate with zod → email Jacob via Resend.
Spam protection: honeypot field + rate limit (Turnstile later if needed).
Success state: "Got it. I'll get back to you with what we can build."