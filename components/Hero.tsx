import { Engraving } from "@/components/Engraving";
import { Lines } from "@/components/Lines";
import { site } from "@/content/site";
import contributions from "@/content/contributions.json";
import { asset } from "@/lib/paths";

export function Hero() {
  const { hero } = site;
  return (
    <section className="hero" data-hero id="topo" aria-labelledby="hero-title">
      <Engraving
        plate="hippogriff"
        mode="hero"
        focus={[0.45, 0.24]}
        priority
        alt="Gravura de Gustave Doré: um cavaleiro num hipogrifo sobrevoa um vale de penhascos, com um castelo ao fundo."
      />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p className="eyebrow">
          {hero.eyebrow}
        </p>
        <h1 id="hero-title" className="hero__title" data-lines="load">
          <Lines lines={hero.title} />
        </h1>
        <p className="hero__lede" data-reveal data-delay="0.6">
          {hero.lede}
        </p>
        <div className="hero__actions" data-reveal data-delay="0.75">
          <a className="btn btn--solid" href={hero.primary.href}>
            {hero.primary.label}
            <span aria-hidden="true">↓</span>
          </a>
          <a className="btn" href={asset(hero.secondary.href)} target="_blank" rel="noopener">
            {hero.secondary.label}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <p className="hero__caption" aria-hidden="true">
        <span>Prancha I</span> Gustave Doré, <em>Orlando Furioso</em>, 1879
      </p>
    </section>
  );
}

export function Stats() {
  const values: Record<string, number> = {
    commits: contributions.totalCommits,
  };
  return (
    <section className="stats" id="numeros" aria-label="Em números">
      <div className="stats__grid">
        {site.stats.map((s, i) => {
          const value = values[s.key] ?? s.value;
          const formatted = new Intl.NumberFormat("pt-BR").format(value);
          const example = s.key === "commits" && contributions.exemplo;
          return (
            <div className="stat" key={s.key} data-reveal data-delay={String(i * 0.12)}>
              <p className="stat__value">
                <span data-count={value}>{formatted}</span>
                {s.suffix}
                {example ? <sup title="Dados de exemplo">*</sup> : null}
              </p>
              <p className="stat__label">{s.label}</p>
            </div>
          );
        })}
      </div>
      {contributions.exemplo ? (
        <p className="stats__note">* Número de exemplo até o script de commits rodar com os tokens.</p>
      ) : null}
    </section>
  );
}
