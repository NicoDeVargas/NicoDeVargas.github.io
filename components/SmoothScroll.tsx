"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/** Rolagem suave (Lenis) sincronizada com o ScrollTrigger. Desligada com reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: 0 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Fontes e imagens mudam alturas depois do primeiro layout.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
