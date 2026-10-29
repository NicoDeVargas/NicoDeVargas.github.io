import type { Chapter, Project } from "@/content/projects";
import { asset } from "@/lib/paths";

/** Mídia opcional (vídeo ou print). Sem mídia, o cartão é só texto. */
function Media({ project }: { project: Project }) {
  const m = project.media;
  if (!m) return null;
  return (
    <div className="card__media">
      {m.type === "video" ? (
        <video src={asset(m.src)} poster={m.poster ? asset(m.poster) : undefined} muted loop playsInline autoPlay aria-label={m.alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- export estático
        <img src={asset(m.src)} alt={m.alt} loading="lazy" decoding="async" />
      )}
    </div>
  );
}

function Highlight({ project }: { project: Project }) {
  if (!project.highlight) {
    return (
      <p className="card__initial" aria-hidden="true">
        {project.title.charAt(0)}
      </p>
    );
  }
  return (
    <p className="card__highlight">
      <span className={`card__num${project.highlight.length > 9 ? " card__num--long" : ""}`}>{project.highlight}</span>
      {project.highlightLabel ? <span className="card__numlabel">{project.highlightLabel}</span> : null}
    </p>
  );
}

type Props = { chapter: Chapter; project: Project; position: number };

export function ProjectCard({ chapter, project, position }: Props) {
  const featured = project.featured;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <article className={`card${featured ? " card--featured" : ""}`} aria-labelledby={`p-${project.slug}`}>
      <Media project={project} />
      <div className="card__body">
        <div className="card__top">
          <p className="card__kicker">
            {featured ? <span className="card__badge">Destaque</span> : null}
            {project.kicker}
          </p>
          <span className="card__counter" aria-hidden="true">
            {pad(position)}/{pad(chapter.projects.length)}
          </span>
        </div>
        {featured ? null : <Highlight project={project} />}
        <h3 id={`p-${project.slug}`} className="card__title">
          {project.title}
        </h3>
        <p className="card__desc">{project.description}</p>
        {project.facts?.length ? (
          <ul className="card__facts">
            {project.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : null}
        <div className="card__foot">
          {project.stack?.length ? (
            <ul className="card__stack" aria-label="Tecnologias">
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}
          {project.links?.length ? (
            <div className="card__links">
              {project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener">
                  {l.label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
