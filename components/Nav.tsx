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
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <a className="nav__logo" href="#topo" aria-label={`${site.name}, voltar ao topo`}>
        <span className="nav__mark" aria-hidden="true">
          N<i>d</i>V
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
