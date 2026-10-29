// Soma as contribuições de um ano em duas contas do GitHub e grava
// content/contributions.json (versionado; é o que o site lê no build).
//
// Uso:
//   GITHUB_TOKEN_PESSOAL=... GITHUB_TOKEN_EMPRESA=... node scripts/fetch-contributions.mjs [ano]
//
// Cada token é um fine-grained ou classic token da PRÓPRIA conta (escopo de leitura
// basta: read:user; para contar repositórios privados, o token precisa enxergá-los).
// A consulta usa `viewer`, então cada token conta as contribuições do seu dono,
// inclusive privadas. Nenhum nome de repositório é consultado nem gravado.
import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "content", "contributions.json");
const year = Number(process.argv[2] ?? new Date().getFullYear());

const accounts = [
  { env: "GITHUB_TOKEN_PESSOAL", label: "pessoal" },
  { env: "GITHUB_TOKEN_EMPRESA", label: "empresa" },
];

const QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    login
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

async function fetchAccount(token) {
  const now = new Date();
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "portfolio-build" },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        from: new Date(Date.UTC(year, 0, 1)).toISOString(),
        to: (end < now ? end : now).toISOString(),
      },
    }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));
  return json.data.viewer.contributionsCollection;
}

const missing = accounts.filter((a) => !process.env[a.env]);
if (missing.length) {
  console.error(`Faltam variáveis: ${missing.map((a) => a.env).join(", ")}`);
  process.exit(1);
}

const days = new Map();
let commits = 0;
let contributions = 0;
for (const a of accounts) {
  const c = await fetchAccount(process.env[a.env]);
  commits += c.totalCommitContributions;
  contributions += c.contributionCalendar.totalContributions;
  for (const w of c.contributionCalendar.weeks)
    for (const d of w.contributionDays)
      if (d.date.startsWith(String(year))) days.set(d.date, (days.get(d.date) ?? 0) + d.contributionCount);
  console.log(`${a.label}: ${c.totalCommitContributions} commits, ${c.contributionCalendar.totalContributions} contribuições`);
}

const data = {
  exemplo: false,
  ano: year,
  contas: accounts.length,
  geradoEm: new Date().toISOString(),
  totalCommits: commits,
  totalContribuicoes: contributions,
  dias: [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([data, total]) => ({ data, total })),
};
await writeFile(out, JSON.stringify(data, null, 1) + "\n");
console.log(`Gravado ${path.relative(root, out)}: ${commits} commits, ${contributions} contribuições.`);
