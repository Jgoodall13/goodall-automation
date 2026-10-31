export type UsualSuspect = {
  title: string;
  /** One sentence. */
  blurb: string;
  /** A few small tool chips (3 is typical, 4 at most). */
  tools: string[];
};

// Problems that come up over and over. A menu, not a sequence, so no numbers on the cards.
export const usualSuspects: UsualSuspect[] = [
  {
    title: "The IT help desk agent",
    blurb:
      "An agent that answers from your IT policies, runs the numbers on any CSV you hand it, and collects every detail before it opens a ticket, from Teams or your own site.",
    tools: ["Microsoft Foundry", "File search", "Code Interpreter", "Container Apps"],
  },
  {
    title: "The NetSuite Copilot",
    blurb:
      "An agent in Teams that answers NetSuite questions, grounded in your own docs, and follows each user's NetSuite role permissions.",
    tools: ["Copilot Studio", "NetSuite", "MCP Tools"],
  },
  {
    title: "Answers with receipts",
    blurb:
      "An agent grounded in your SOPs, contracts, and policies that cites its sources and says so when it doesn't know.",
    tools: ["Microsoft Foundry", "Foundry IQ", "Azure AI Search"],
  },
  {
    title: "The missing connector",
    blurb:
      "When two systems have no connector, I build a small, secure one in Azure so Power Automate, Teams, and your agents can reach your ERP.",
    tools: ["Azure Functions", "Power Automate", "REST APIs"],
  },
  {
    title: "KPI dashboards people actually open",
    blurb:
      "A fast, custom web app on your own database that puts the numbers your team checks every morning in one place, instead of five exports.",
    tools: ["Next.js", "React", "SQL"],
  },
  {
    title: "Sensitive files, off email",
    blurb:
      "Clients send spreadsheets to a key-protected endpoint instead of email, and each file is checked, parsed, and lands in a review list for your team.",
    tools: ["Power Automate", "SharePoint Lists", "API keys"],
  },
];
