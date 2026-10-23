// One place for the brand. Rebrand (e.g. to "Goodall Labs") by changing `name` here.
export const SITE = {
  name: "Goodall Automation",
  tagline: "Automate it all.",
  /** Home page eyebrow. */
  pitch: "AI agents & workflow automation",
  /** Browser tab and search result title, after the name. No trailing period. */
  title: "AI agents & workflow automation",
  /** Search and link-preview description. Keep it under ~160 characters. */
  description:
    "AI agents and workflow automation for growing businesses. From quick automations to production-grade agents, built on the systems you already run.",
  owner: "Jacob Goodall",
};

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on deploys; fall back to local dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
