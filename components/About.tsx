import { Plate } from "@/components/Plate";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  return (
    <section className="about" id="sobre" aria-labelledby="sobre-title">
      <figure className="about__photo" data-plate-reveal>
        <Plate name="avatar" alt={about.photoAlt} sizes="(max-width: 760px) 60vw, 320px" />
      </figure>
      <div className="about__text">
        <p className="eyebrow">{about.eyebrow}</p>
        <h2 id="sobre-title" className="section-title section-title--sm" data-reveal>
          {about.title}
        </h2>
        {about.paragraphs.map((p) => (
          <p key={p} className="about__p" data-reveal>
            {p}
          </p>
        ))}
        <dl className="about__facts" data-reveal>
          <div>
            <dt>Agora</dt>
            <dd>Desenvolvedor de IA na AI4Sellers</dd>
          </div>
          <div>
            <dt>Estudo</dt>
            <dd>Engenharia da Computação, CEFET-MG (formatura prevista para dez/2028)</dd>
          </div>
          <div>
            <dt>Base</dt>
            <dd>Belo Horizonte, MG</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
