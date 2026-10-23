export type Project = {
  /** Used for the #anchor link on the Work page. */
  id: string;
  title: string;
  /** One or two sentences for the project index at the top of the Work page. */
  cardBlurb: string;
  /** Anonymized client, e.g. "300-person promotional products company". Never real names. */
  client: string;
  tags: string[];
  problem: string;
  build: string;
  /** Optional highlighted story: a bug caught, a call made, a fire put out. */
  callout?: { title: string; body: string };
  whyTools: string;
  results: { value: string; label: string }[];
  /** Optional small print under the results. */
  footnote?: string;
};

export const projects: Project[] = [
  {
    id: "internal-agent",
    title: "The internal agent that stopped guessing",
    cardBlurb:
      "A company-wide AI agent in Teams that works across NetSuite, Wrike, and Stripe as the person asking. Built in code, so the rules live in the system instead of the prompt.",
    client: "Mid-market company running NetSuite + Microsoft 365",
    tags: ["Microsoft Foundry", "LangGraph", "Python", "MCP", "Foundry IQ", "Teams"],

    problem:
      "The first NetSuite agent was built in a low-code tool, and it mostly worked. But it explored metadata before every answer, wrote queries by trial and error, and was slow. Sometimes it was confidently wrong. There was no way to see exactly what it ran, and no way to enforce a rule beyond asking nicely in the instructions. The company wanted one internal agent that could work across its business systems and be trusted to write, not just read.",

    build:
      "A Python agent built with LangGraph and deployed as a hosted agent in Microsoft Foundry, published to Teams. A Foundry toolbox puts NetSuite, Wrike, and Stripe behind a single MCP endpoint, and every tool call runs as the signed-in user: Foundry stores and refreshes each person's OAuth token, so there are no credentials in the code, and NetSuite's own role permissions are the guardrail. The agent is grounded with Foundry IQ and a set of verified query patterns, each one tested before it went in. Every tool call, query, and timing is traced, so tuning comes from measurements, not guesses. Creates and updates are blocked in code until the user explicitly confirms a summary of what will be written.",

    callout: {
      title: "Confidently wrong is worse than slow",
      body: "Asked for today's script execution logs, the agent spent 93 seconds wandering through metadata, then told the user their NetSuite role didn't have access. That wasn't true. Tracing every call turned up the two queries that actually work, plus a date quirk that made 'today' silently match nothing. The same hunt found a query pattern that returned wrong totals with no error. That pattern is banned now. The log question takes 27 seconds and gets the right answer on the first try.",
    },

    whyTools:
      "Copilot Studio is the right answer for most question-and-answer agents, and it's where this one started. It hit a ceiling: the rules needed to be enforced in code, every query needed to be visible, the agent needed tools from several systems, and writes had to be safe. A Foundry hosted agent gives full control in code while still living in the company's own Azure and publishing to Teams like any other agent. LangGraph makes each step explicit, which is what lets a confirmation guard sit in front of every write. The toolbox keeps tokens per user and lets a new system join without touching the agent's code. A persistent state layer was considered for multi-step writes and deliberately skipped, because it would have changed memory for every conversation. A small guard did the job with less risk.",

    results: [
      { value: "93s → 27s", label: "for script log lookups, and from a confidently wrong answer to the right one" },
      { value: "55s → 15s", label: "to find a customer's latest order" },
      { value: "0", label: "credentials in the code. Every call runs as the person asking" },
      { value: "0", label: "writes without an explicit yes. Creates and updates are blocked in code until confirmed" },
    ],

    footnote:
      "Times measured from traced runs of the same questions, before and after tuning.",
  },
  {
    id: "vendor-inbox",
    title: "The vendor inbox that runs itself",
    cardBlurb:
      "Hundreds of vendor emails a week, each one hand-keyed into NetSuite. Now they're read, matched, and written back automatically, and nothing gets guessed.",
    client: "Mid-market company running NetSuite + Microsoft 365",
    tags: ["Power Automate", "Copilot Studio", ".NET", "SQL Server", "NetSuite RESTlet"],

    problem:
      "Every purchase order generates vendor replies: acknowledgements, ship date changes, tracking numbers, holds, backorders. All of it landed in one shared inbox, and a person had to read each email, figure out which PO it meant, open NetSuite, update the right fields, and file it. Most of it needed zero judgment. Worse, customers didn't get their tracking email until someone got to the inbox. An email at 4:45 on a Friday meant Monday.",

    build:
      "Power Automate watches the inbox and hands each email to a Copilot Studio agent that classifies it into one of 12 categories and pulls out the PO, tracking numbers, and ship date. One HTTP call hands off to a .NET service I built: an idempotent ingest API, a SQL Server queue that doubles as a full audit trail, and a worker that batches updates to a NetSuite RESTlet every five minutes. The RESTlet runs 14 safety checks before it writes anything. When it writes a tracking number, NetSuite's existing automation emails the customer. I owned the service and the NetSuite side; the business-side automation lead owned the flow and classifier.",

    callout: {
      title: "The scariest bug is the one with no error",
      body: "PO numbers that differ only by a trailing letter are completely different orders, and thousands of them collide. The original design stripped suffixes to improve match rates, which would have quietly written to the wrong live order with no error and no trace. I killed it. Exact match or a human looks at it. Failing is cheap. Guessing writes to a live order.",
    },

    whyTools:
      "Power Automate can't reach an on-prem SQL Server without standing up a gateway, and it can't sign NetSuite's OAuth 1.0a requests. So the half that talks to systems lives in .NET. The email and classification half stayed in Power Automate and Copilot Studio on purpose, so the business can change routing rules without waiting on a deploy from me. Windows Service over IIS, because app pool recycling silently kills a background worker. Targeted NetSuite field updates over load-and-save, at a fraction of the governance cost.",

    results: [
      { value: "300+/wk", label: "vendor emails nobody has to read anymore" },
      { value: "94.9%", label: "of emails handled end to end with no human involved" },
      { value: "0", label: "errors, lost records, or manual recoveries since go-live" },
      { value: "14", label: "safety checks before every single write" },
    ],

    footnote:
      "No made-up hours-saved number. Every stat here came from a query, not an estimate.",
  },
  {
    id: "open-orders-sync",
    title: "The spreadsheet chain, killed",
    cardBlurb:
      "Billing and sales coordinated open orders by emailing CSVs back and forth. Now 25 teams work from live lists that sync both ways with NetSuite.",
    client: "Mid-market company running NetSuite + Microsoft 365",
    tags: ["NetSuite RESTlet", ".NET", "Power Automate", "SharePoint Lists"],

    problem:
      "Billing couldn't invoice an order until sales confirmed it was ready, and the only bridge between them was spreadsheets. Every day, billers ran a NetSuite search, tweaked the filters per team, exported CSVs, and emailed them to sales. Sales typed status into their copies and emailed them back. Meanwhile accounting was chasing payments, and when a buyer asked 'so when is it coming?', the answer lived in someone else's inbox. Nobody had one current list, and orders sat unbilled while people chased each other.",

    build:
      "Power Automate can't sign NetSuite's OAuth 1.0a requests, so a .NET middleware sits in between. Every day it pulls only the open orders that changed in the last 24 hours, and Power Automate routes each one into the right team's SharePoint list: about 25 teams, each with a billing view and a sales view that control who can edit what. Accounting logs payment status, sales fills in tracking, and everyone sees the same row. Edits flow back too: ship date and customer PO changes write to the NetSuite record, and every comment emails the right biller or rep. A separate sweep removes orders once they're billed, so the lists never rot.",

    callout: {
      title: "The conversation lives on the record",
      body: "Comments don't stay in SharePoint. Every one is written back to the sales order in NetSuite as a note, with author and timestamp. Six months later, anyone opening the order sees exactly why it sat unbilled and who said what. No digging through email.",
    },

    whyTools:
      "The people side belongs in Microsoft 365. Sales and billing already lived there, and SharePoint lists gave me views, field-level edit control, and notifications without a new app or a new login. The NetSuite side belongs in .NET, because that's where OAuth 1.0a signing actually works. Power Automate is great at people and terrible at NetSuite auth, so I keep them separated by design. Pulling only what changed in the last 24 hours keeps the daily sync light, no matter how many orders are open.",

    results: [
      { value: "0", label: "spreadsheets emailed. The CSV chain is completely dead" },
      { value: "25", label: "team lists, each with its own billing and sales views" },
      { value: "2-way", label: "edits and comments sync back to NetSuite automatically" },
      { value: "1+ yr", label: "in production, and it's still how billing and sales work" },
    ],
  },
];
