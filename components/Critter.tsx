"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Easter egg: um passarinho gravado em violeta, pousado em bordas da página
 * (elementos com [data-perch="fração-x"]). Acompanha o cursor com o olhar,
 * bate as asas e voa para outro poleiro visível quando o mouse chega perto.
 * No celular, foge do toque e se assusta com rolagem rápida.
 * Não recebe cliques (pointer-events: none) e some com reduced motion.
 */

const W = 60;
const H = 52;
const FEET_Y = 49; // onde os pés tocam a borda, no viewBox
const SCARE = 90; // px

type Perch = { el: HTMLElement; frac: number };

function perches(): Perch[] {
  return [...document.querySelectorAll<HTMLElement>("[data-perch]")]
    .filter((el) => el.offsetParent !== null && el.getClientRects().length > 0)
    .map((el) => ({ el, frac: Number(el.dataset.perch) || 0.5 }));
}

function spot(p: Perch) {
  const r = p.el.getBoundingClientRect();
  return {
    x: r.left + window.scrollX + r.width * p.frac - W / 2,
    y: r.top + window.scrollY - FEET_Y + 1,
  };
}

function visible(p: Perch) {
  const r = p.el.getBoundingClientRect();
  return r.top > 90 && r.top < window.innerHeight - 20 && r.width > 0;
}

export function Critter() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const body = el.querySelector<SVGGElement>(".critter__body")!;
    const head = el.querySelector<SVGGElement>(".critter__head")!;
    const pupil = el.querySelector<SVGCircleElement>(".critter__pupil")!;
    const lid = el.querySelector<SVGPathElement>(".critter__lid")!;

    let current: Perch | null = null;
    let flying = false;
    let facing = 1;
    const pos = { x: -200, y: -200 };

    const place = () => {
      gsap.set(el, { x: pos.x, y: pos.y });
    };
    const face = (dir: number) => {
      if (dir === facing) return;
      facing = dir;
      gsap.to(body, { scaleX: dir, duration: 0.18, transformOrigin: "50% 50%", ease: "power2.out" });
    };

    const settle = () => {
      const all = perches();
      if (!current || !all.some((p) => p.el === current!.el)) current = all.find(visible) ?? all[0] ?? null;
      if (!current) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      Object.assign(pos, spot(current));
      place();
    };

    const flyTo = (target: Perch) => {
      if (flying) return;
      flying = true;
      const from = { ...pos };
      const to = spot(target);
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const lift = Math.min(220, 60 + dist * 0.35);
      const ctrl = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
      face(to.x >= from.x ? 1 : -1);
      el.classList.add("is-flying");
      const t = { p: 0 };
      gsap.to(t, {
        p: 1,
        duration: Math.min(1.6, 0.55 + dist / 900),
        ease: "power1.inOut",
        onUpdate: () => {
          const u = t.p;
          pos.x = (1 - u) * (1 - u) * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x;
          pos.y = (1 - u) * (1 - u) * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
          place();
        },
        onComplete: () => {
          current = target;
          flying = false;
          el.classList.remove("is-flying");
          gsap.fromTo(body, { y: -3 }, { y: 0, duration: 0.35, ease: "bounce.out" });
        },
      });
    };

    const escape = (fromX: number, fromY: number) => {
      const options = perches().filter((p) => p.el !== current?.el && visible(p));
      if (!options.length) {
        hop();
        return;
      }
      // o poleiro visível mais longe do cursor
      const far = options
        .map((p) => {
          const s = spot(p);
          return { p, d: Math.hypot(s.x + W / 2 - fromX, s.y - fromY) };
        })
        .sort((a, b) => b.d - a.d)[0].p;
      flyTo(far);
    };

    const hop = () => {
      if (flying) return;
      el.classList.add("is-flying");
      gsap.fromTo(
        body,
        { y: 0 },
        {
          y: -14,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
          onComplete: () => el.classList.remove("is-flying"),
        },
      );
    };

    const look = (cx: number, cy: number) => {
      if (flying) return;
      const r = el.getBoundingClientRect();
      const ex = r.left + W * 0.72;
      const ey = r.top + H * 0.3;
      const dx = cx - ex;
      const dy = cy - ey;
      face(dx >= 0 ? 1 : -1);
      const a = Math.atan2(dy, Math.abs(dx));
      gsap.to(pupil, { attr: { cx: 44.2 + Math.cos(a) * 1.1, cy: 15 + Math.sin(a) * 1.1 }, duration: 0.25 });
      gsap.to(head, { rotation: gsap.utils.clamp(-16, 16, (a * 180) / Math.PI / 3), svgOrigin: "40 22", duration: 0.4 });
      return Math.hypot(cx - (r.left + W / 2), cy - (r.top + H / 2));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const d = look(e.clientX, e.clientY);
      if (d !== undefined && d < SCARE) escape(e.clientX + window.scrollX, e.clientY + window.scrollY);
    };
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + W / 2), e.clientY - (r.top + H / 2));
      if (d < SCARE * 1.2) escape(e.clientX + window.scrollX, e.clientY + window.scrollY);
      else if (e.pointerType !== "mouse") look(e.clientX, e.clientY);
    };

    // Rolagem rápida assusta; rolagem parada com o pássaro fora da tela faz
    // ele voar para um poleiro visível (só se já tiver sido visto antes).
    let lastY = window.scrollY;
    let lastT = performance.now();
    let idle = 0;
    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      if (v > 3.5) {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) hop();
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (flying || !current) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          const options = perches().filter(visible);
          if (options.length) {
            // reaparece voando de fora da tela
            const target = options[Math.floor(Math.random() * options.length)];
            const s = spot(target);
            pos.x = s.x < window.innerWidth / 2 ? -W : window.innerWidth + W;
            pos.y = window.scrollY + window.innerHeight * 0.15;
            place();
            flyTo(target);
          }
        }
      }, 900);
    };

    // Vida própria: piscar e bicar de vez em quando.
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 3.2 });
    blink.to(lid, { attr: { "fill-opacity": 1 }, duration: 0.06 }).to(lid, { attr: { "fill-opacity": 0 }, duration: 0.08 }, "+=0.08");
    const peck = window.setInterval(() => {
      if (flying || Math.random() < 0.5) return;
      gsap.fromTo(head, { rotation: 0 }, { rotation: 28, svgOrigin: "40 22", duration: 0.12, yoyo: true, repeat: 3, ease: "power1.inOut" });
    }, 5200);

    const ro = new ResizeObserver(() => !flying && settle());
    ro.observe(document.body);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const start = window.setTimeout(() => {
      settle();
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
    }, 3200);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(idle);
      window.clearInterval(peck);
      blink.kill();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={root} className="critter" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <pattern id="critter-hatch" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
            <line x1="0" y1="0" x2="0" y2="2.6" stroke="#3b2bb8" strokeWidth="0.9" />
          </pattern>
          <pattern id="critter-hatch-fine" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1="0" y1="0" x2="0" y2="2" stroke="#3b2bb8" strokeWidth="0.45" />
          </pattern>
        </defs>
        <g className="critter__body">
          {/* asa de trás */}
          <g className="critter__wing critter__wing--back">
            <path d="M22 25 C26 14 36 12 40 20 C36 26 29 29 22 25 Z" fill="url(#critter-hatch)" stroke="#3b2bb8" strokeWidth="1" />
          </g>
          {/* cauda */}
          <path d="M16 31 L3 37 L4.5 40.5 L8 39 L7.5 42 L18 35 Z" fill="url(#critter-hatch)" stroke="#3b2bb8" strokeWidth="1.1" strokeLinejoin="round" />
          {/* pernas */}
          <path d="M27 40 L26 48 M26 48 L23 49.5 M26 48 L28.5 49.5 M32 40 L33 48 M33 48 L30.5 49.5 M33 48 L35.5 49.5" stroke="#3b2bb8" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          {/* corpo */}
          <path d="M15 31 C15 21 25 16 34 18 C42 19.5 46.5 25 45.5 31 C44.5 38.5 37 42.5 28.5 41.6 C20.5 40.8 15 37 15 31 Z" fill="#fbf8ec" stroke="#3b2bb8" strokeWidth="1.3" />
          <path d="M15 31 C15 21 25 16 34 18 C40 19 44 22 45 26 C38 24 26 25 15 31 Z" fill="url(#critter-hatch)" />
          <path d="M20 37 C26 40.5 35 40.5 41 36" stroke="#3b2bb8" strokeWidth="0.7" fill="none" />
          <path d="M23 39.5 C28 41 33 41 37 39.5" stroke="#3b2bb8" strokeWidth="0.5" fill="none" />
          <path d="M18 34 C24 39 36 39.5 43 33 L43 31 C36 36 25 36 18 31 Z" fill="url(#critter-hatch-fine)" />
          {/* asa da frente */}
          <g className="critter__wing critter__wing--front">
            <path d="M19 27 C24 20 35 20 39 26 C36 33 27 35 19 31 Z" fill="#fbf8ec" stroke="#3b2bb8" strokeWidth="1.1" />
            <path d="M19 27 C24 20 35 20 39 26 C33 25 25 26 19 29 Z" fill="url(#critter-hatch)" />
            <path d="M22 31 L29 29 M25 32.6 L32 30 M29 33.2 L35 30.4" stroke="#3b2bb8" strokeWidth="0.7" />
          </g>
          {/* cabeça */}
          <g className="critter__head">
            <circle cx="41" cy="16.5" r="8" fill="#fbf8ec" stroke="#3b2bb8" strokeWidth="1.3" />
            <path d="M33.2 15 C34 9.5 39 7.6 43.5 8.8 C47 9.8 48.6 12.5 48.8 14.5 C44 12 38 12.5 33.2 15 Z" fill="url(#critter-hatch)" />
            <path d="M48.3 15 L56.5 17.6 L48.3 20 Z" fill="#3b2bb8" />
            <circle cx="44.2" cy="15" r="2.5" fill="#fbf8ec" stroke="#3b2bb8" strokeWidth="0.9" />
            <circle className="critter__pupil" cx="44.6" cy="15" r="1.35" fill="#3b2bb8" />
            <path className="critter__lid" d="M41.6 15 a2.6 2.6 0 0 1 5.2 0 a2.6 2.6 0 0 1 -5.2 0 Z" fill="#8f84e0" fillOpacity="0" />
          </g>
        </g>
      </svg>
    </div>
  );
}
