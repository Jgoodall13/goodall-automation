export type Project = {
  slug: string;
  title: string;
  /** Anonymized client, e.g. "300-person promotional products company". Never real names. */
  client: string;
  summary: string;
  problem: string;
  build: string;
  whyTheseTools: string;
  results: { value: string; label: string }[];
  stack: string[];
};

// PLACEHOLDERS: these show the shape of a write-up. Replace them with real,
// anonymized projects before launch. Anything marked "XX" is a number to fill in.
export const projects: Project[] = [
  {
    slug: "order-intake-agent",
    title: "The order intake agent",
    client: "Mid-size distributor running NetSuite",
    summary:
      "Customer POs arrive by email in every format imaginable. Now an agent reads them and builds the sales order.",
    problem:
      "Customer purchase orders showed up as PDFs, spreadsheets, and the occasional photo of a fax. Two people spent every morning re-keying them into NetSuite, line by line, and typos meant wrong shipments.",
    build:
      "A Power Automate flow watches the orders inbox and hands each attachment to a Copilot Studio agent that pulls out the customer, ship-to, and line items. The flow checks everything against NetSuite, creates the sales order, and pings the rep in Teams. Anything the agent isn't sure about goes to a human review queue instead of guessing.",
    whyTheseTools:
      "The company already paid for Microsoft 365, so Copilot Studio and Power Automate meant no new vendor and no new security review. Reps already lived in Teams, so the exceptions went where they'd actually see them. NetSuite integration went through a small API layer so the agent never touches the ERP directly.",
    results: [
      { value: "XX hrs", label: "of manual entry saved per week" },
      { value: "XX%", label: "fewer order entry errors" },
    ],
    stack: ["Copilot Studio", "Power Automate", "NetSuite", "Teams"],
  },
  {
    slug: "knowledge-agent",
    title: "The \"just ask it\" knowledge agent",
    client: "300-person B2B company",
    summary:
      "Answers buried in SharePoint and PDFs, surfaced in Teams by an agent that respects who's allowed to see what.",
    problem:
      "Sales and support asked the same questions all day. The answers existed somewhere in SharePoint, old PDFs, and a few people's heads, and those people were tired of being the search engine.",
    build:
      "An Azure AI Foundry agent with retrieval over the company's SharePoint libraries, published into Teams. Every answer cites its source document, and anything sensitive stays locked to the people who already had access.",
    whyTheseTools:
      "Foundry over Copilot Studio here because we needed control over retrieval and the model, not just a chat front end. Entra ID handled identity, so permissions came from the systems IT already managed instead of a new access list to babysit.",
    results: [
      { value: "XX", label: "questions answered per week" },
      { value: "XX hrs", label: "of interruptions saved per week" },
    ],
    stack: ["Azure AI Foundry", "SharePoint", "Entra ID", "Teams"],
  },
  {
    slug: "ecommerce-netsuite-sync",
    title: "The sync that stopped overselling",
    client: "Ecommerce brand on NetSuite",
    summary:
      "Storefront and ERP disagreed about inventory. Now they don't, and failures fix themselves or yell loudly.",
    problem:
      "Orders and inventory moved between the storefront and NetSuite on a fragile scheduled export. When it broke, nobody knew until customers bought products that weren't in stock.",
    build:
      "A .NET service on Azure that syncs orders, inventory, and fulfillment in near real time through a queue, with retries, dead-lettering, and alerts. It's deployed through a DevOps pipeline, so changes ship tested and repeatable.",
    whyTheseTools:
      "Low-code was the wrong tool here. The volume, the retries, and the error handling called for real code. .NET because it's what I know cold. Azure queues because a failed sync should wait and retry, not disappear. A pipeline because \"deploy\" shouldn't mean \"Jacob remotes in on a Friday.\"",
    results: [
      { value: "XX", label: "oversold orders per month (was XX)" },
      { value: "XX min", label: "from order to ERP (was XX hrs)" },
    ],
    stack: [".NET", "Azure", "NetSuite", "Azure DevOps"],
  },
];
