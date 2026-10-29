"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/paths";
import { site } from "@/content/site";

const links = [
  { label: "Projetos", href: "#projetos" },
  { label: "Commits", href: "#commits" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Some ao descer e volta ao subir; no rodapé fica escondido para não cobrir os contatos
    let last = window.scrollY;
    const footer = document.getElementById("contato");
    const on = () => {
      const y = window.scrollY;
      const inFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.5 : false;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(inFooter || (y > last && y > 160));
        last = y;
      }
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header onFocusCapture={() => setHidden(false)} className={`nav${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
      <a className="nav__logo" href="#topo" aria-label={`${site.name}, voltar ao topo`}>
        <span className="nav__mark" aria-hidden="true">
          N
        </span>
        <span className="nav__name">{site.name}</span>
      </a>
      <nav aria-label="Principal">
        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href} className="nav__item">
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li className="nav__item nav__item--solid">
            <a href={asset(site.contact.resume)} target="_blank" rel="noopener">
              Currículo
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
