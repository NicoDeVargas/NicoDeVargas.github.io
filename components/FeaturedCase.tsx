import { featured as f } from "@/content/featured";

/** Estudo de caso do projeto em destaque, entre os números da capa e os capítulos. */
export function FeaturedCase() {
  return (
    <section className="case" id={f.id} aria-labelledby="case-title">
      <div className="case__intro" data-reveal>
        <p className="eyebrow">{f.eyebrow}</p>
        <p className="case__intronote">{f.eyebrowNote}</p>
      </div>

      <div className="case__grid">
        <header className="case__head" data-reveal>
          <p className="case__kicker">{f.kicker}</p>
          <h2 id="case-title" className="case__title">
            {f.title}
          </h2>
          <p className="case__highlight">
            <span className="case__num">{f.highlight}</span>
            <span className="case__numlabel">{f.highlightLabel}</span>
            <span className="case__numnote">{f.highlightNote}</span>
          </p>
          <p className="case__lede">{f.lede}</p>
          <ul className="card__stack case__stack" aria-label="Tecnologias">
            {f.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <a className="btn case__link" href={f.link.href} target="_blank" rel="noopener">
            {f.link.label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </header>

        <div className="case__body">
          <div className="case__block" data-reveal>
            <h3>O problema</h3>
            <p>{f.problem}</p>
          </div>
          <div className="case__block" data-reveal>
            <h3>O que construí</h3>
            <p>{f.built.intro}</p>
            <ul className="case__list">
              {f.built.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          <div className="case__block" data-reveal>
            <h3>Decisões medidas</h3>
            {f.decisions.map((d) => (
              <p key={d.title}>
                <strong>{d.title}.</strong> {d.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <dl className="case__scale" data-reveal>
        {f.scale.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
