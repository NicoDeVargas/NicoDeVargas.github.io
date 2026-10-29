import { Engraving } from "@/components/Engraving";
import { ProjectCard } from "@/components/ProjectCard";
import type { Chapter as ChapterType } from "@/content/projects";

const plateAlt: Record<string, string> = {
  hippogriff: "Gravura de Gustave Doré: cavaleiro num hipogrifo sobre um vale de penhascos.",
  paradise: "Gravura de Gustave Doré: uma figura alada mergulha entre nuvens e raios de luz sobre um globo.",
  idylls: "Gravura de Gustave Doré: cavaleiros com lanças atravessam uma floresta escura.",
  orlando9: "Gravura de Gustave Doré: um cavaleiro num hipogrifo pousa numa clareira entre árvores.",
};

export function Chapter({ chapter }: { chapter: ChapterType }) {
  const count = chapter.projects.length;
  return (
    <section className="chapter" data-chapter id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter__stage">
        <Engraving plate={chapter.plate} mode="chapter" focus={chapter.focus} alt={plateAlt[chapter.plate]} />
        <p className="chapter__credit">
          <span>Gravura</span> Gustave Doré, <em>{chapter.plateTitle}</em>
        </p>
      </div>
      <div className="chapter__flow">
        <header className="chapter__intro">
          <div className="cartouche" data-reveal>
            <span className="cartouche__numeral" aria-hidden="true">
              {chapter.numeral}
            </span>
            <p className="eyebrow">
              Capítulo {chapter.numeral} · {count} {count === 1 ? "projeto" : "projetos"}
            </p>
            <h2 id={`${chapter.id}-title`} className="cartouche__title" data-lines>
              <span className="line">
                <span>{chapter.title}</span>
              </span>
            </h2>
            <p className="cartouche__subtitle">{chapter.subtitle}</p>
            <p className="cartouche__intro">{chapter.intro}</p>
          </div>
        </header>
        <div className="chapter__projects">
          {chapter.projects.map((p, i) => (
            <ProjectCard key={p.slug} chapter={chapter} project={p} position={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
