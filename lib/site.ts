// One place for the brand. Rebrand (e.g. to "Goodall Labs") by changing `name` here.
export const SITE = {
  name: "Goodall Automation",
  tagline: "Automate it all.",
  /** Home page eyebrow. */
  pitch: "Single agents · Multi-agent systems · Workflow automation",
  /** Browser tab and search result title, after the name. No trailing period. */
  title: "AI agents, architected and built",
  /** Search and link-preview description. Keep it under ~160 characters. */
  description:
    "AI agent architecture and implementation for growing businesses. Single agents, multi-agent systems, and workflow automation on the systems you already run.",
  owner: "Jacob Goodall",
};

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on deploys; fall back to local dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
