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
      "Hundreds of vendor emails a day, each one hand-keyed into NetSuite. Now they're read, matched, and written back in about three minutes, and nothing gets guessed.",
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
];
