# Project: [Goodall Automation | Goodall Labs] — consulting site

## What this is
Personal consulting site for Jacob Goodall: AI agents, architected and built.
Automation is the result; AI agents are the method: single agents, multi-agent systems, and the
orchestration between them, with workflow automation as the right answer when an agent isn't needed.
NetSuite and Microsoft 365 are proof of where the work has been done, not the headline.
The site isn't going to production until the certifications are done (see docs/Reposition_V2.md).
Tone: confident, not cocky. Calm, direct, dry wit. Clean, minimal.

## Stack
Next.js (App Router, TypeScript), Tailwind, deployed on Vercel.
Brand name lives in ONE config constant (name not final yet).

## Pages
### Home (/)
1. Hero — eyebrow "Single agents · Multi-agent systems · Workflow automation",
   "I architect and build AI agents that run your processes." + subhead
2. Why me — 3 beats about judgment, not tools:
   - The right architecture, every time
   - Agents that survive production
   - Deep in the systems (NetSuite, Microsoft 365, Azure as proof)
   Then Certifications: badge, code, name, year; one row per track, data in lib/certifications.ts.
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