// Test Terry from the terminal against a running dev server.
//
//   node scripts/test-terry.mjs                     # the 3 sample problems
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
  console.log(`${b.headline}  [${b.inScope ? b.complexity : "out of scope"}]  (${seconds}s)\n`);
  console.log(b.summary);
  if (b.steps.length) {
    console.log("\nSteps");
    b.steps.forEach((s, n) => console.log(`  ${n + 1}. ${s.title}  <${s.tool}>\n     ${s.why}`));
  }
  if (b.humanCheckpoints.length) {
    console.log("\nHuman checkpoints");
    b.humanCheckpoints.forEach((c) => console.log(`  - ${c}`));
  }
  if (b.yikes.length) {
    console.log("\nYikes");
    b.yikes.forEach((y) => console.log(`  ! ${y}`));
  }
  if (b.questionsForYou.length) {
    console.log("\nQuestions I'd ask you");
    b.questionsForYou.forEach((q) => console.log(`  ? ${q}`));
  }
}
