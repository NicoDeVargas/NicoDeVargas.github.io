import type { Chapter, Project } from "@/content/projects";
import { asset, plateInfo, srcSet, fallbackSrc } from "@/lib/paths";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Detail({ chapter, project, index, featured }: { chapter: Chapter; project: Project; index: string; featured?: boolean }) {
  if (project.media) {
    const m = project.media;
    return (
      <div className="card__art" data-plate-reveal>
        {m.type === "video" ? (
          <video src={asset(m.src)} poster={m.poster ? asset(m.poster) : undefined} muted loop playsInline autoPlay aria-label={m.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- export estático
          <img src={asset(m.src)} alt={m.alt} loading="lazy" decoding="async" />
        )}
        <span className="card__index">{index}</span>
      </div>
    );
  }
  const d = project.detail ?? { x: 0.5, y: 0.5, zoom: 2 };
  const info = plateInfo(chapter.plate);
  const zoom = Math.max(1.6, d.zoom);
  const margin = featured ? 0.5 / zoom + 0.02 : 0.5 / zoom + 0.06;
  const x = clamp(d.x, margin, 1 - margin);
  const y = clamp(d.y, 0.12, 0.88);
  const base = featured ? 560 : 640;
  return (
    <div
      className="card__art"
      data-plate-reveal
      style={{ "--z": zoom, "--x": x, "--y": y } as React.CSSProperties}
      aria-hidden="true"
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(chapter.plate, "avif")} sizes={`(max-width: 760px) ${Math.round(zoom * 100)}vw, ${Math.round(zoom * base)}px`} />
        <source type="image/webp" srcSet={srcSet(chapter.plate, "webp")} sizes={`(max-width: 760px) ${Math.round(zoom * 100)}vw, ${Math.round(zoom * base)}px`} />
        { }
        <img src={fallbackSrc(chapter.plate, 1440)} alt="" width={info.width} height={info.height} loading="lazy" decoding="async" />
      </picture>
      <span className="card__index">{index}</span>
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

export function ProjectCard({ chapter, project, position }: { chapter: Chapter; project: Project; position: number }) {
  const index = `${chapter.numeral}.${position}`;
  const featured = project.featured;
  return (
    <article className={`card${featured ? " card--featured" : ""}`} data-reveal aria-labelledby={`p-${project.slug}`}>
      <Detail chapter={chapter} project={project} index={index} featured={featured} />
      <div className="card__body">
        <p className="card__kicker">
          {featured ? <span className="card__badge">Destaque</span> : null}
          {project.kicker}
        </p>
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
