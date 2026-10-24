export type UsualSuspect = {
  title: string;
  /** One sentence. */
  blurb: string;
  /** 1-3 small tool chips. */
  tools: string[];
};

// Problems that come up over and over. A menu, not a sequence, so no numbers on the cards.
export const usualSuspects: UsualSuspect[] = [
  {
    title: "The NetSuite Copilot",
    blurb:
      "An agent in Teams that answers NetSuite questions, grounded in your own docs, and follows each user's NetSuite role permissions.",
    tools: ["Copilot Studio", "NetSuite", "MCP"],
  },
  {
    title: "Answers with receipts",
    blurb:
      "An agent grounded in your SOPs, contracts, and policies that cites its sources and says so when it doesn't know.",
    tools: ["Foundry IQ", "Azure AI Search", "Copilot Studio"],
  },
  {
    title: "Your 3PL, plugged in",
    blurb:
      "Orders go out, tracking comes back, fulfillments create themselves, and customers get their shipping email.",
    tools: ["NetSuite", "SuiteScript", "3PL API"],
  },
  {
    title: "The missing connector",
    blurb:
      "When two systems have no connector, I build a small, secure one in Azure so Power Automate, Teams, and your agents can reach your ERP.",
    tools: ["Azure Functions", "Power Automate", "REST APIs"],
  },
  {
    title: "Sensitive files, off email",
    blurb:
      "Clients send spreadsheets to a key-protected endpoint instead of email, and each file is checked, parsed, and lands in a review list for your team.",
    tools: ["Power Automate", "SharePoint Lists", "API keys"],
  },
  {
    title: "KPI dashboards people actually open",
    blurb:
      "A fast, custom web app on your own database that puts the numbers your team checks every morning in one place, instead of five exports.",
    tools: ["Next.js", "React", "SQL"],
  },
];
