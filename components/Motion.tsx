"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Animações de entrada guiadas por atributos:
 * - [data-reveal]        sobe e aparece ao entrar na tela
 * - [data-lines]         cada .line > span sobe de dentro de uma máscara
 * - [data-count]         número conta até o valor (formato pt-BR)
 * - [data-plate-reveal]  recorte de gravura se abre de baixo para cima
 * - [data-heat]          células do mapa de commits entram por coluna
 */
export function Motion() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    document.documentElement.classList.add(reduce ? "motion-off" : "motion-on", "hydrated");
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        // Na capa, entra ao carregar; no resto, ao chegar na tela.
        const onLoad = !!el.closest("[data-hero]");
        gsap.from(el, {
          y: onLoad ? 28 : 56,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        const spans = el.querySelectorAll(".line > span");
        const immediate = el.dataset.lines === "load";
        gsap.from(spans, {
          yPercent: 110,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
          delay: immediate ? 0.35 : 0,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-plate-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
        const img = el.querySelector("img");
        if (img) gsap.from(img, { scale: 1.25, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });

      const fmt = new Intl.NumberFormat("pt-BR");
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        el.textContent = fmt.format(0);
        gsap.to(obj, {
          v: target,
          duration: target > 100 ? 2.4 : 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = fmt.format(Math.round(obj.v));
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-heat]").forEach((grid) => {
        const cells = grid.querySelectorAll("i");
        gsap.from(cells, {
          autoAlpha: 0,
          scale: 0.2,
          duration: 0.5,
          ease: "power2.out",
          stagger: { each: 0.0022, from: "start" },
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
  return null;
}
