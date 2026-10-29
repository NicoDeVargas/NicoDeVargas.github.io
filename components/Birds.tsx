/** Pássaros em SVG voando sobre a paisagem do rodapé (CSS puro). */
// x = posição fixa usada com prefers-reduced-motion
const FLOCK = [
  { top: 14, x: 62, dur: 46, delay: -6, s: 1, flap: 0.42, dy: -40 },
  { top: 18, x: 66, dur: 46, delay: -7.2, s: 0.75, flap: 0.36, dy: -34 },
  { top: 11, x: 69, dur: 46, delay: -8.1, s: 0.6, flap: 0.33, dy: -46 },
  { top: 30, x: 24, dur: 62, delay: -30, s: 0.85, flap: 0.5, dy: -20 },
  { top: 26, x: 28, dur: 62, delay: -31.5, s: 0.55, flap: 0.38, dy: -28 },
  { top: 8, x: 84, dur: 75, delay: -52, s: 0.5, flap: 0.3, dy: 18 },
  { top: 22, x: 45, dur: 54, delay: -18, s: 0.45, flap: 0.28, dy: -12 },
];

export function Birds() {
  return (
    <div className="birds" aria-hidden="true">
      {FLOCK.map((b, i) => (
        <span
          key={i}
          className="bird"
          style={
            {
              "--top": `${b.top}%`,
              "--x": `${b.x}%`,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--s": b.s,
              "--flap": `${b.flap}s`,
              "--dy": `${b.dy}px`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 40 20" width="40" height="20">
            <path d="M1 9.5 Q9 1.5 20 10.5 Q31 1.5 39 9.5 Q30.5 5.5 20 13 Q9.5 5.5 1 9.5 Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
