import contributions from "@/content/contributions.json";

type Day = { data: string; total: number };

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS_FULL = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const fmt = new Intl.NumberFormat("pt-BR");
const iso = (d: Date) => d.toISOString().slice(0, 10);
const longDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return `${d} de ${MONTHS_FULL[m - 1]} de ${y}`;
};

function buildModel(days: Day[], year: number) {
  const byDate = new Map(days.map((d) => [d.data, d.total]));
  const last = days.length ? days[days.length - 1].data : `${year}-12-31`;

  // Semanas de domingo a sábado, como no GitHub.
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const start = new Date(jan1.getTime() - jan1.getUTCDay() * 864e5);
  const dec31 = new Date(Date.UTC(year, 11, 31));
  const end = new Date(dec31.getTime() + (6 - dec31.getUTCDay()) * 864e5);

  const nonzero = days.map((d) => d.total).filter((v) => v > 0).sort((a, b) => a - b);
  const q = (p: number) => nonzero[Math.min(nonzero.length - 1, Math.floor(p * nonzero.length))] ?? 1;
  const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75);
  const level = (v: number) => (v <= 0 ? 0 : v <= t1 ? 1 : v <= t2 ? 2 : v <= t3 ? 3 : 4);

  const cells: { date: string; v: number; level: number; out: boolean; future: boolean }[] = [];
  const monthCols: { label: string; col: number }[] = [];
  let col = 0;
  for (let d = start; d <= end; d = new Date(d.getTime() + 864e5)) {
    const date = iso(d);
    const inYear = d.getUTCFullYear() === year;
    const v = byDate.get(date) ?? 0;
    if (d.getUTCDate() === 1 && inYear) monthCols.push({ label: MONTHS[d.getUTCMonth()], col });
    cells.push({ date, v, level: level(v), out: !inYear, future: inYear && date > last });
    if (d.getUTCDay() === 6) col++;
  }

  // Resumo
  const total = days.reduce((s, d) => s + d.total, 0);
  const active = days.filter((d) => d.total > 0).length;
  const best = days.reduce((b, d) => (d.total > b.total ? d : b), { data: "", total: 0 });
  let streak = 0, run = 0;
  for (const d of days) {
    run = d.total > 0 ? run + 1 : 0;
    streak = Math.max(streak, run);
  }
  const perMonth = new Array(12).fill(0);
  for (const d of days) perMonth[Number(d.data.slice(5, 7)) - 1] += d.total;
  const topMonth = perMonth.indexOf(Math.max(...perMonth));

  return { cells, monthCols, weeks: col, total, active, best, streak, topMonth };
}

export function CommitMap() {
  const year = contributions.ano;
  const m = buildModel(contributions.dias as Day[], year);
  const summary = `${fmt.format(m.total)} contribuições em ${year}, em ${m.active} dias diferentes. Maior sequência: ${m.streak} dias seguidos.`;

  return (
    <section className="commits" id="commits" aria-labelledby="commits-title">
      <div className="commits__head">
        <div>
          <p className="eyebrow">Ritmo · {year}</p>
          <h2 id="commits-title" className="section-title" data-lines>
            <span className="line">
              <span>Um ano de commits</span>
            </span>
          </h2>
        </div>
        <p className="commits__lede" data-reveal>
          Cada quadrado é um dia, somando a conta pessoal e a da empresa. Repositórios privados entram só como
          número.
        </p>
      </div>

      <div className="commits__map" data-reveal data-perch="0.97">
        <div className="heat__months" aria-hidden="true" style={{ "--weeks": m.weeks } as React.CSSProperties}>
          {m.monthCols.map((mc) => (
            <span key={mc.label} style={{ gridColumnStart: mc.col + 1 }}>
              {mc.label}
            </span>
          ))}
        </div>
        <div className="heat__wrap">
          <div className="heat__days" aria-hidden="true">
            <span />
            <span>seg</span>
            <span />
            <span>qua</span>
            <span />
            <span>sex</span>
            <span />
          </div>
          <div
            className="heat"
            role="img"
            aria-label={summary}
            data-heat
            style={{ "--weeks": m.weeks } as React.CSSProperties}
          >
            {m.cells.map((c) => (
              <i
                key={c.date}
                className={c.out ? "o" : c.future ? "f" : `l${c.level}`}
                title={c.out || c.future ? undefined : `${c.v} ${c.v === 1 ? "contribuição" : "contribuições"} em ${longDate(c.date)}`}
              />
            ))}
          </div>
        </div>
        <div className="heat__legend" aria-hidden="true">
          <span>menos</span>
          <i className="l0" />
          <i className="l1" />
          <i className="l2" />
          <i className="l3" />
          <i className="l4" />
          <span>mais</span>
        </div>
      </div>

      <dl className="commits__facts">
        <div data-reveal>
          <dt>contribuições no ano</dt>
          <dd>
            <span data-count={m.total}>{fmt.format(m.total)}</span>
          </dd>
        </div>
        <div data-reveal data-delay="0.08">
          <dt>dias com commit</dt>
          <dd>
            <span data-count={m.active}>{m.active}</span>
          </dd>
        </div>
        <div data-reveal data-delay="0.16">
          <dt>maior sequência</dt>
          <dd>
            <span data-count={m.streak}>{m.streak}</span> <small>dias</small>
          </dd>
        </div>
        <div data-reveal data-delay="0.24">
          <dt>mês mais intenso</dt>
          <dd className="is-word">{MONTHS_FULL[m.topMonth]}</dd>
        </div>
      </dl>
      {contributions.exemplo ? (
        <p className="commits__note">
          Dados de exemplo. Rode <code>npm run contributions</code> com os tokens para mostrar os números reais.
        </p>
      ) : null}
    </section>
  );
}
