"use client";

import { useEffect, useRef } from "react";
import { Plate } from "@/components/Plate";
import type { PlateName } from "@/content/projects";
import { createEngraving, supportsWebGL, type Engraving as GL, type EngravingState } from "@/lib/engraving-gl";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  plate: PlateName;
  alt: string;
  focus: [number, number];
  mode: "hero" | "chapter";
  sizes?: string;
  priority?: boolean;
};

/**
 * Gravura em tela cheia. Com WebGL, é "gravada" na tela UMA vez pelo shader:
 * na capa, ao carregar; nos capítulos, ao entrar na tela. Não fica amarrada à
 * rolagem. Ao terminar, o canvas é descartado e fica a <img> (mesmo
 * enquadramento), liberando a GPU. Sem WebGL: máscara CSS com o mesmo tempo.
 * Com reduced motion: imagem estática desde o início.
 */
export function Engraving({ plate, alt, focus, mode, sizes, priority }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) return;

    if (prefersReducedMotion()) {
      el.dataset.state = "static";
      return;
    }

    const state: EngravingState = { reveal: 0, zoom: 1, focusX: fx, focusY: fy };
    let engraving: GL | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let tween: gsap.core.Tween | null = null;
    let killed = false;

    const ready = async () => {
      img.loading = "eager";
      try {
        await img.decode();
      } catch {
        if (!img.complete || !img.naturalWidth)
          await new Promise((r) => img.addEventListener("load", r, { once: true }));
      }
    };

    const finish = () => {
      el.dataset.state = "static";
      engraving?.dispose();
      engraving = null;
      canvas?.remove();
      canvas = null;
    };

    const apply = () => {
      if (engraving) engraving.set(state);
      else el.style.setProperty("--reveal", state.reveal.toFixed(4));
    };

    const play = async () => {
      await ready();
      if (killed) return;
      if (supportsWebGL()) {
        canvas = document.createElement("canvas");
        canvas.className = "engraving__canvas";
        canvas.setAttribute("aria-hidden", "true");
        el.appendChild(canvas);
        engraving = createEngraving(canvas, img, state);
        if (!engraving) {
          canvas.remove();
          canvas = null;
        }
      }
      el.dataset.state = engraving ? "gl" : "css";
      apply();
      tween = gsap.to(state, {
        reveal: 1,
        duration: mode === "hero" ? 2 : 1.2,
        delay: mode === "hero" ? 0.1 : 0,
        ease: mode === "hero" ? "power2.inOut" : "power2.out",
        onUpdate: apply,
        onComplete: finish,
      });
    };

    let io: IntersectionObserver | null = null;
    if (mode === "hero") void play();
    else {
      // Começa quando uma boa parte da gravura está à vista.
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          void play();
        },
        { threshold: 0.35 },
      );
      io.observe(el);
    }

    const ro = new ResizeObserver(() => engraving?.resize());
    ro.observe(el);

    return () => {
      killed = true;
      io?.disconnect();
      ro.disconnect();
      tween?.kill();
      engraving?.dispose();
      canvas?.remove();
    };
  }, [fx, fy, mode]);

  return (
    <div
      ref={root}
      className="engraving"
      data-mode={mode}
      style={{ "--fx": `${fx * 100}%`, "--fy": `${fy * 100}%` } as React.CSSProperties}
    >
      <Plate
        name={plate}
        alt={alt}
        sizes={sizes ?? "(max-aspect-ratio: 4/5) 84vh, 100vw"}
        priority={priority}
        className="engraving__img"
      />
    </div>
  );
}
