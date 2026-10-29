import { Birds } from "@/components/Birds";
import { Clock } from "@/components/Clock";
import { FooterMotion } from "@/components/FooterMotion";
import { Plate } from "@/components/Plate";
import { chapters } from "@/content/projects";
import { credits, site } from "@/content/site";
import { asset } from "@/lib/paths";

const ext = { target: "_blank", rel: "noopener" } as const;

function Icon({ name }: { name: "linkedin" | "github" | "mail" | "file" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (name) {
    case "linkedin":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M8 10.5V17M8 7.4v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1.1-2.8 2.6-2.8s2.4 1 2.4 2.8V17" strokeLinecap="round" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2.2Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
        </svg>
      );
    case "file":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
          <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" />
        </svg>
      );
  }
}

export function Footer() {
  const { contact } = site;
  const year = new Date().getFullYear();
  const social = [
    { icon: "linkedin" as const, label: "LinkedIn", href: contact.linkedin },
    { icon: "github" as const, label: "GitHub", href: contact.github },
    { icon: "mail" as const, label: "E-mail", href: `mailto:${contact.email}` },
    { icon: "file" as const, label: "Currículo (PDF)", href: asset(contact.resume) },
  ];

  return (
    <footer className="footer" id="contato">
      <FooterMotion />
      <div className="footer__top">
        <div className="footer__brand">
          <a className="footer__logo" href="#topo">
            <span className="nav__mark" aria-hidden="true">
              N<i>d</i>V
            </span>
            {site.name}
          </a>
          <p className="footer__line">{site.footer.cta}</p>
          <a className="footer__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <ul className="footer__social">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} title={s.label} {...(s.icon === "mail" ? {} : ext)}>
                  <Icon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__cols" aria-label="Rodapé">
          <div>
            <h3>Contato</h3>
            <ul>
              <li>
                <a href={`mailto:${contact.email}`}>E-mail</a>
              </li>
              <li>
                <a href={contact.linkedin} {...ext}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={contact.github} {...ext}>
                  GitHub
                </a>
              </li>
              <li>
                <a href={asset(contact.resume)} {...ext}>
                  Currículo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Capítulos</h3>
            <ul>
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>{c.title}</a>
                </li>
              ))}
              <li>
                <a href="#commits">Commits</a>
              </li>
            </ul>
          </div>
          <div className="footer__credits">
            <h3>Gravuras</h3>
            <p>Gustave Doré (1832–1883), domínio público, via Wikimedia Commons.</p>
            <ul>
              {credits.map((c) => (
                <li key={c.href}>
                  <a href={c.href} {...ext}>
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer__land">
        <div className="footer__img">
          <Plate
            name="tage"
            alt=""
            sizes="(max-width: 760px) 200vw, 100vw"
          />
        </div>
        <div className="footer__mist" aria-hidden="true" />
        <Birds />
        <p className="footer__copy">
          <span>© {year} {site.name}</span>
          <span className="footer__sep" aria-hidden="true" />
          <Clock />
          <span className="footer__sep" aria-hidden="true" />
          <span>Feito à mão com Next.js, WebGL e gravuras de Gustave Doré</span>
        </p>
      </div>
    </footer>
  );
}
