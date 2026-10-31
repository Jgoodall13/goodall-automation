// Test Terry from the terminal against a running dev server.
//
//   node scripts/test-terry.mjs                     # all sample problems
//   node scripts/test-terry.mjs "your problem here" # one custom problem
//   node scripts/test-terry.mjs --json              # raw JSON instead of the pretty view
//
// Set TERRY_URL to test somewhere other than http://localhost:3000.
// Each run calls the Claude API, so it costs a few cents.
// Works against `npm run dev` only: the x-terry-dev-script header skips Turnstile and the
// daily limit in development. Production ignores it.

const URL = `${process.env.TERRY_URL ?? "http://localhost:3000"}/api/terry`;

const SAMPLES = [
  "Our 3PL emails tracking numbers and someone types them into NetSuite every afternoon. Customers call asking where their order is because the tracking email goes out a day late.",
  "Sales reps request credit memos by emailing accounting a spreadsheet. Accounting re-keys each one into NetSuite and emails the rep back when it's done. Half the requests are missing the invoice number, so there's a lot of back and forth.",
  "We run SAP and want a Java service that syncs customers into Salesforce.",
  "Sales reps request credit memos by emailing accounting a spreadsheet. Accounting re-keys each one into NetSuite and emails the rep back. Half are missing the invoice number.",
  "Our 3PL wants to pull our open orders and send tracking back to us. They said they can call an API.",
  "We want an assistant in Teams that answers questions about our NetSuite data.",
  "We want an agent that looks up orders, checks payment status in Stripe, and creates sales orders after someone approves.",
  "We run Salesforce and Outlook and want follow-up emails drafted from deal notes.",
  "We need a Java service on AWS that syncs SAP to Salesforce.",
  // Architecture checks: expect Workflow automation, Single agent, then Single or Multi-agent.
  "Every night we export a CSV from NetSuite and email it to the same 3 people.",
  "Sales reps keep asking ops for order status in Teams.",
  "Vendor emails come in about POs; we need them classified, matched to the right PO, and updated in NetSuite with a human approving risky changes.",
  // Platform checks: expect Foundry with no extra hosting, then Foundry plus Container Apps for the website.
  "We want an IT help desk agent in Teams that answers employee questions from our IT policy documents.",
  "We want an IT help desk agent that answers questions from our IT policy documents, in Teams and also embedded on our intranet website.",
];

const args = process.argv.slice(2);
const json = args.includes("--json");
const custom = args.filter((a) => a !== "--json");
const problems = custom.length ? [custom.join(" ")] : SAMPLES;

for (const [i, problem] of problems.entries()) {
  console.log(`\n${"=".repeat(72)}\n#${i + 1} ${problem}\n${"=".repeat(72)}`);
  const started = Date.now();
  let res;
  try {
    res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-terry-dev-script": "1" },
      body: JSON.stringify({ problem }),
    });
  } catch {
    console.log(`Could not reach ${URL}. Is \`npm run dev\` running?`);
    process.exit(1);
  }
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const data = await res.json();

  if (json || !data.ok) {
    console.log(`HTTP ${res.status} in ${seconds}s`);
    console.log(JSON.stringify(data, null, 2));
    continue;
  }

  const b = data.blueprint;
  console.log(`${b.headline}  [${b.inScope ? b.architecture : "out of scope"}]  (${seconds}s)\n`);
  if (b.architectureWhy) console.log(`Why this shape: ${b.architectureWhy}\n`);
  console.log(b.summary);
  if (b.steps.length) {
    console.log("\nSteps");
    b.steps.forEach((s, n) => console.log(`  ${n + 1}. ${s.title}  <${s.tool}>\n     ${s.why}`));
  }
  if (b.humanCheckpoints.length) {
    console.log("\nHuman checkpoints");
    b.humanCheckpoints.forEach((c) => console.log(`  - ${c}`));
  }
  if (b.questionsForYou.length) {
    console.log("\nQuestions I'd ask you");
    b.questionsForYou.forEach((q) => console.log(`  ? ${q}`));
  }
}
