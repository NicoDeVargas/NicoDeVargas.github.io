import { Carousel } from "@/components/Carousel";
import { Engraving } from "@/components/Engraving";
import { ProjectCard } from "@/components/ProjectCard";
import type { Chapter as ChapterType } from "@/content/projects";

const plateAlt: Record<string, string> = {
  hippogriff: "Gravura de Gustave Doré: cavaleiro num hipogrifo sobre um vale de penhascos.",
  paradise: "Gravura de Gustave Doré: uma figura alada mergulha entre nuvens e raios de luz sobre um globo.",
  idylls: "Gravura de Gustave Doré: cavaleiros com lanças atravessam uma floresta escura.",
  orlando9: "Gravura de Gustave Doré: um cavaleiro num hipogrifo pousa numa clareira entre árvores.",
};

/** Capítulo: gravura de fundo + cartela + carrossel de projetos da área. */
export function Chapter({ chapter }: { chapter: ChapterType }) {
  const count = chapter.projects.length;
  return (
    <section className="chapter" data-chapter id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter__stage">
        <Engraving
          plate={chapter.plate}
          mode="chapter"
          focus={chapter.focus}
          alt={plateAlt[chapter.plate]}
          sizes="(max-aspect-ratio: 3/4) 120vh, 100vw"
        />
        <p className="chapter__credit">
          <span>Gravura</span> Gustave Doré, <em>{chapter.plateTitle}</em>
        </p>
      </div>
      <div className="chapter__body">
        <header className="cartouche" data-reveal>
          <span className="cartouche__numeral" aria-hidden="true">
            {chapter.numeral}
          </span>
          <p className="eyebrow">
            Capítulo {chapter.numeral} · {count} {count === 1 ? "projeto" : "projetos"}
          </p>
          <h2 id={`${chapter.id}-title`} className="cartouche__title">
            {chapter.title}
          </h2>
          <p className="cartouche__subtitle">{chapter.subtitle}</p>
          <p className="cartouche__intro">{chapter.intro}</p>
        </header>
        <Carousel label={`Projetos de ${chapter.title}`}>
          {chapter.projects.map((p, i) => (
            <ProjectCard key={p.slug} chapter={chapter} project={p} position={i + 1} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
