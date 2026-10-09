# Project: [Goodall Automation | Goodall Labs] — consulting site

## What this is
Personal consulting site for Jacob Goodall: AI agents + automation that connect
NetSuite and Microsoft 365. Positioning line: "NetSuite + Microsoft 365, connected."
Tone: confident, a little cocky, direct. Clean, minimal.

## Stack
Next.js (App Router, TypeScript), Tailwind, deployed on Vercel.
Brand name lives in ONE config constant (name not final yet).

## Pages
### Home (/)
1. Hero — "I automate the work your team hates." + one-line subhead
2. Why me — 3 beats:
   - 10 years in the trenches (.NET, NetSuite, ecommerce)
   - Agents & automation (Copilot Studio, Azure AI Foundry, Power Automate)
   - The cloud doesn't scare me (Azure, Entra ID, Linux, DevOps)
3. Cocky bridge — "Want proof? See the work. Want ideas? Steal them." → /work
4. Intake form — "Got a problem? Perfect." Name, email, problem → submit

### Work (/work)
Project cards/write-ups, each: Problem → Build (+ why these tools) → Result (time/$ saved).
Content from a typed data file so adding projects = adding an object.
All client details anonymized.

## Form
Server Action → validate with zod → email Jacob via Resend.
Spam protection: honeypot field + rate limit (Turnstile later if needed).
Success state: "Got it. I'll get back to you with what we can build."