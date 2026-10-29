"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
};

/**
 * Carrossel horizontal sem autoplay: rolagem nativa com scroll-snap (swipe e
 * trackpad de graça), setas, teclado (← → Home End), arrastar com o mouse e
 * indicador de posição. Devolve dois irmãos (trilho e controles) para o
 * layout do capítulo posicioná-los no grid.
 */
export function Carousel({ label, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(count <= 1);

  const goTo = useCallback((i: number) => {
    const t = track.current;
    if (!t) return;
    const list = [...t.children] as HTMLElement[];
    const target = list[Math.max(0, Math.min(list.length - 1, i))];
    if (!target) return;
    const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ left: target.offsetLeft - pad, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Posição atual a partir da rolagem
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0;
      const max = t.scrollWidth - t.clientWidth;
      const list = [...t.children] as HTMLElement[];
      let best = 0;
      let dist = Infinity;
      list.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - pad - t.scrollLeft);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      const end = t.scrollLeft >= max - 4;
      if (end && max > 0) best = list.length - 1;
      setIndex(best);
      setAtEnd(end);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    t.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(t);
    return () => {
      t.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Arrastar com o mouse (toque e trackpad já rolam nativamente)
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = t.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        t.classList.add("is-dragging");
        t.setPointerCapture(e.pointerId);
      }
      if (moved) t.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      t.classList.remove("is-dragging");
      if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
      // encaixa no cartão mais próximo, na direção do gesto
      const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0;
      const list = [...t.children] as HTMLElement[];
      const dx = e.clientX - startX;
      let i = list.findIndex((c) => c.offsetLeft - pad >= t.scrollLeft - 2);
      if (i < 0) i = list.length - 1;
      if (dx > 0 && i > 0 && list[i].offsetLeft - pad > t.scrollLeft + 2) i -= 1;
      goTo(i);
    };
    // um arrasto não deve virar clique num link do cartão
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const noDrag = (e: DragEvent) => e.preventDefault();
    t.addEventListener("pointerdown", down);
    t.addEventListener("pointermove", move);
    t.addEventListener("pointerup", up);
    t.addEventListener("pointercancel", up);
    t.addEventListener("click", click, true);
    t.addEventListener("dragstart", noDrag);
    return () => {
      t.removeEventListener("pointerdown", down);
      t.removeEventListener("pointermove", move);
      t.removeEventListener("pointerup", up);
      t.removeEventListener("pointercancel", up);
      t.removeEventListener("click", click, true);
      t.removeEventListener("dragstart", noDrag);
    };
  }, [goTo]);

  const onKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    goTo(keys[e.key]);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div
        ref={track}
        className="carousel__track"
        role="region"
        aria-roledescription="carrossel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKey}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="carousel__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="carousel__controls">
        <p className="carousel__count" aria-live="polite">
          <span className="carousel__now">{pad(index + 1)}</span>
          <span className="carousel__of"> / {pad(count)}</span>
        </p>
        <div className="carousel__dots" aria-hidden="true">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              className={`carousel__dot${i === index ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="carousel__arrows">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Projeto anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5 8 12l7 7M8.5 12H21" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(index + 1)}
            disabled={atEnd || index >= count - 1}
            aria-label="Próximo projeto"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="m9 5 7 7-7 7M15.5 12H3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
