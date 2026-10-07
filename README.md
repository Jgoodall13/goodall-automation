# Goodall Automation

**Automate it all.**

I'm Jacob Goodall, and I build AI agents and automations for businesses that run on Microsoft. If your company lives in Microsoft 365, NetSuite, and spreadsheets held together with hope, I build the agents and flows that make it run itself.

This repo is the Goodall Automation website.

## What I build

- **AI agents.** Copilot Studio and Azure AI Foundry agents that read the email, answer the question, and build the order, so your team doesn't have to.
- **Automation.** Power Automate flows and .NET services that move data between Microsoft 365, NetSuite, your storefront, and everything in between.
- **Cloud that holds up.** Azure, Entra ID, Linux, and DevOps pipelines. Everything I build gets deployed, secured, and kept running, not handed off as a demo.

## Why me

- **10 years in the trenches.** A decade inside .NET, NetSuite, and ecommerce. I've lived in the systems I automate.
- **Built to last.** The goal isn't a slick demo that works once. It's a system your team stops thinking about.
- **IT-approved.** Identity, security, and deployment are part of the job, so your IT team signs off instead of pushing back.

## See the work

The site's Work page has write-ups of real projects: what was broken, what I built, why I picked those tools, and how much time it saved. Feel free to steal the ideas. When you want them built right, you know where to find me.

## Got a problem?

Perfect. Send it through the form on the site with your name, your email, and what's eating your team's week. I'll get back to you with what we can build.

---

## Running the site locally

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4, and hosted on Vercel. Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Until email is set up, contact form submissions print to the terminal.

To send real email, copy `.env.example` to `.env.local` and add a [Resend](https://resend.com) API key plus the address submissions should go to. Add the same values in Vercel's environment variables for production.

The brand name lives in `lib/site.ts`, and Work page projects live in `lib/projects.ts`.
