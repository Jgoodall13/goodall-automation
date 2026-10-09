// One place for the brand. Rebrand (e.g. to "Goodall Labs") by changing `name` here.
export const SITE = {
  name: "Goodall Automation",
  tagline: "Automate it all.",
  /** Home page eyebrow. */
  pitch: "NetSuite + Microsoft 365, connected.",
  /** Browser tab and search result title, after the name. No trailing period. */
  title: "NetSuite + Microsoft 365, connected",
  /** Search and link-preview description. Keep it under ~160 characters. */
  description:
    "I connect NetSuite and Microsoft 365 with AI agents and automations that do the work your team hates. 10 years in .NET and NetSuite. Tell me your problem.",
  owner: "Jacob Goodall",
};

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on deploys; fall back to local dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
