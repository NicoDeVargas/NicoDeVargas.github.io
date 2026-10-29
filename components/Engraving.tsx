"use client";

import { useEffect, useRef } from "react";
import { Plate } from "@/components/Plate";
import type { PlateName } from "@/content/projects";
import { createEngraving, supportsWebGL, type Engraving as GL, type EngravingState } from "@/lib/engraving-gl";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

type Props = {
  plate: PlateName;
  alt: string;
  focus: [number, number];
  mode: "hero" | "chapter";
  sizes?: string;
  priority?: boolean;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

/**
 * Gravura em tela cheia. Com WebGL: revelação por shader amarrada ao scroll
 * (capítulo) ou ao carregamento (capa) e depois zoom lento. Sem WebGL: máscara
 * CSS que desce com o mesmo progresso. Com reduced motion: imagem estática.
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
    const useGL = supportsWebGL();
    let engraving: GL | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let near = false;
    let initializing = false;
    let killed = false;

    const apply = () => {
      if (engraving) engraving.set(state);
      else if (el.dataset.state === "css") {
        el.style.setProperty("--reveal", state.reveal.toFixed(4));
        el.style.setProperty("--zoom", state.zoom.toFixed(4));
      }
    };

    const ready = async () => {
      img.loading = "eager";
      try {
        await img.decode();
      } catch {
        if (!img.complete || !img.naturalWidth)
          await new Promise((r) => img.addEventListener("load", r, { once: true }));
      }
    };

    const start = async () => {
      if (engraving || initializing) return;
      initializing = true;
      await ready();
      initializing = false;
      if (killed || !near || engraving) return;
      if (useGL) {
        canvas = document.createElement("canvas");
        canvas.className = "engraving__canvas";
        canvas.setAttribute("aria-hidden", "true");
        el.appendChild(canvas);
        engraving = createEngraving(canvas, img, state);
        if (engraving) {
          el.dataset.state = "gl";
          return;
        }
        canvas.remove();
        canvas = null;
      }
      el.dataset.state = "css";
      apply();
    };

    const stop = () => {
      engraving?.dispose();
      engraving = null;
      canvas?.remove();
      canvas = null;
    };

    // Cria o contexto WebGL só perto da tela e libera longe dela.
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) void start().then(() => mode === "hero" && intro());
        else stop();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(el);

    const ro = new ResizeObserver(() => engraving?.resize());
    ro.observe(el);

    const triggers: ScrollTrigger[] = [];
    let introTween: gsap.core.Tween | null = null;
    let introDone = false;

    const intro = () => {
      if (introDone || introTween) return;
      introTween = gsap.to(state, {
        reveal: 1,
        duration: 2.8,
        delay: 0.1,
        ease: "power2.inOut",
        onUpdate: apply,
        onComplete: () => {
          introDone = true;
        },
      });
    };

    if (mode === "chapter") {
      const section = el.closest<HTMLElement>("[data-chapter]") ?? el;
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          end: "top -45%",
          onUpdate: (s) => {
            state.reveal = s.progress;
            apply();
          },
          onRefresh: (s) => {
            state.reveal = s.progress;
            apply();
          },
        }),
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (s) => {
            state.zoom = 1 + 0.16 * easeOut(s.progress);
            state.focusY = fy + (0.5 - fy) * 0.25 * s.progress;
            apply();
          },
        }),
      );
    } else {
      const section = el.closest<HTMLElement>("[data-hero]") ?? el;
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (s) => {
            state.zoom = 1 + 0.12 * s.progress;
            apply();
          },
        }),
      );
    }

    return () => {
      killed = true;
      io.disconnect();
      ro.disconnect();
      introTween?.kill();
      triggers.forEach((t) => t.kill());
      stop();
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
