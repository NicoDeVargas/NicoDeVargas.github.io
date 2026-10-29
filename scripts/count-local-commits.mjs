// Conta os commits de um ano a partir do histórico git das pastas locais e grava
// content/contributions.json (o mesmo formato do fetch-contributions.mjs).
//
// Por que existe: parte dos repositórios da empresa é privada ou não é atribuída à
// conta no GitHub, então o calendário do GitHub não mostra esses commits. O histórico
// local é a fonte mais fiel.
//
// Uso:
//   AUTORES="eu@exemplo.com,outro@exemplo.com" node scripts/count-local-commits.mjs <pasta> [pasta...] [--ano 2026]
//
// Procura repositórios git até 3 níveis abaixo de cada pasta, inclui todas as branches
// e conta cada commit uma vez só (pelo hash), mesmo que apareça em clones ou worktrees.
// Nenhum nome de repositório ou mensagem de commit é gravado.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "content", "contributions.json");

const args = process.argv.slice(2);
const anoIdx = args.indexOf("--ano");
const year = anoIdx >= 0 ? Number(args.splice(anoIdx, 2)[1]) : new Date().getFullYear();
const authors = new Set((process.env.AUTORES ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
if (!args.length || !authors.size) {
  console.error('Uso: AUTORES="a@b.com,..." node scripts/count-local-commits.mjs <pasta> [pasta...] [--ano 2026]');
  process.exit(1);
}

function findRepos(dir, depth, found) {
  if (existsSync(path.join(dir, ".git"))) found.add(dir);
  if (depth === 0) return;
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const e of entries) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    const p = path.join(dir, e);
    try {
      if (statSync(p).isDirectory()) findRepos(p, depth - 1, found);
    } catch {}
  }
}

const repos = new Set();
for (const a of args) findRepos(path.resolve(a), 3, repos);

const seen = new Map(); // hash -> data
for (const repo of repos) {
  let log = "";
  try {
    log = execFileSync(
      "git",
      ["-C", repo, "log", "--all", `--since=${year}-01-01`, `--until=${year}-12-31T23:59:59`, "--format=%H %ae %ad", "--date=short"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 },
    );
  } catch {
    continue;
  }
  for (const line of log.split("\n")) {
    const [hash, email, date] = line.split(" ");
    if (hash && authors.has(email?.toLowerCase()) && date?.startsWith(String(year))) seen.set(hash, date);
  }
}

const days = new Map();
for (const date of seen.values()) days.set(date, (days.get(date) ?? 0) + 1);

const data = {
  exemplo: false,
  fonte: "histórico git local",
  ano: year,
  contas: null,
  geradoEm: new Date().toISOString(),
  totalCommits: seen.size,
  totalContribuicoes: seen.size,
  dias: [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([data, total]) => ({ data, total })),
};
await writeFile(out, JSON.stringify(data, null, 1) + "\n");
console.log(`${repos.size} repositórios, ${seen.size} commits em ${year}. Gravado ${path.relative(root, out)}.`);
