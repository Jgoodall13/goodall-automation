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
    title: "Your 3PL, plugged in",
    blurb:
      "Orders go out, tracking comes back, fulfillments create themselves, and customers get their shipping email.",
    tools: ["NetSuite", "3PL API"],
  },
  {
    title: "The Power Automate bridge",
    blurb: "Power Automate can't talk to NetSuite out of the box. It can now.",
    tools: ["Power Automate", "NetSuite", "Azure"],
  },
  {
    title: "Spreadsheet → live list",
    blurb: "Kill the CSV email chain. One shared list, synced both ways with NetSuite.",
    tools: ["SharePoint Lists", "NetSuite"],
  },
  {
    title: "The inbox that sorts itself",
    blurb:
      "A shared mailbox read, classified, and written back to NetSuite, with a human for anything uncertain.",
    tools: ["Outlook", "Copilot Studio", "NetSuite"],
  },
  {
    title: "Approvals in Teams",
    blurb:
      "Approve or reject from the chat you already have open; the decision lands in NetSuite.",
    tools: ["Teams", "Power Automate", "NetSuite"],
  },
];
