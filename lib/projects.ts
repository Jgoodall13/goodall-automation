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
  {
    id: "photo-task",
    title: "The photo shoot that runs itself",
    cardBlurb:
      "New products bounced between warehouse, art, and sales by email, printouts, and hallway trips. Now NetSuite and Wrike hand them off automatically, start to finish.",
    client: "Mid-market company running NetSuite + Wrike",
    tags: ["NetSuite SuiteScript", "Wrike API", "OAuth 2.0"],

    problem:
      "Every new product had to be photographed for the ecommerce sites and NetSuite before it could sell. The warehouse dropped it in the photo room and told art. Art printed the work order, hand-built a Wrike task with every detail retyped, figured out which sales rep and website it belonged to, and tagged them. After approval, art walked back to tell the warehouse, who returned the product to its bin and closed the work order. Three teams, five handoffs, all by word of mouth. Emails got missed, details got retyped wrong, products landed in the wrong bins, and work orders sat open because nobody closed the loop.",

    build:
      "A scheduled SuiteScript watches for new work orders and builds the Wrike task through the API, with every product detail filled in and the right sales rep tagged automatically from the work order. The Wrike link writes back to the work order, and the warehouse is notified that it's ready to shoot. A second scheduled script checks Wrike every 15 minutes, and when art marks the photos approved, it flips an approval flag in NetSuite and tells the warehouse to return the product. The link stays on the work order, so nobody ever has to ask where it goes. When the warehouse closes the work order, the Wrike task closes itself.",

    callout: {
      title: "Nobody had to change tools",
      body: "The warehouse lives in NetSuite. Art lives in Wrike. Instead of forcing anyone onto a new system, the automation carries the work between them. Each team kept working exactly where they already were, and the handoffs just started happening on their own. That's why people actually use it.",
    },

    whyTools:
      "The work order already held everything: product details, departments, the responsible rep. So the logic lives in NetSuite, right next to the data. This time NetSuite makes the calls, authenticating to Wrike's API with OAuth 2.0 straight from SuiteScript, so there's no auth wall and no middleware. On other projects, where outside tools had to call into NetSuite, I built a .NET layer. Here it would've been dead weight. Sometimes the right answer is the smallest one.",

    results: [
      { value: "3 yrs", label: "in production, and the warehouse and art teams still love it" },
      { value: "0", label: "Wrike tasks typed by hand. Every detail comes from the work order" },
      { value: "5", label: "handoffs between teams, all automatic" },
      { value: "0", label: "trips down the hall to say 'it's done'" },
    ],
  },
];
