// One place for the brand. Rebrand (e.g. to "Goodall Labs") by changing `name` here.
export const SITE = {
  name: "Goodall Automation",
  tagline: "Automate it all.",
  pitch: "Agents and automation for Microsoft-stack businesses",
  description:
    "Jacob Goodall builds AI agents and automations for businesses that run on Microsoft 365, NetSuite, and Azure. Tell me your problem and I'll tell you how to automate it.",
  owner: "Jacob Goodall",
};

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on deploys; fall back to local dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
