"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Parallax suave da paisagem do rodapé e liga os pássaros só quando visível. */
export function FooterMotion() {
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".footer");
    const land = footer?.querySelector<HTMLElement>(".footer__land");
    if (!footer || !land) return;

    const io = new IntersectionObserver(([e]) => footer.classList.toggle("is-visible", e.isIntersecting), {
      rootMargin: "0px 0px 10% 0px",
    });
    io.observe(land);
    if (prefersReducedMotion()) return () => io.disconnect();

    const ctx = gsap.context(() => {
      const st = { trigger: land, start: "top bottom", end: "bottom bottom", scrub: true };
      gsap.fromTo(".footer__img", { yPercent: 16, scale: 1.08 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: st });
      gsap.fromTo(".footer__mist", { yPercent: -10 }, { yPercent: 6, ease: "none", scrollTrigger: st });
      gsap.fromTo(".birds", { yPercent: 40 }, { yPercent: 0, ease: "none", scrollTrigger: st });
    }, footer);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);
  return null;
}
