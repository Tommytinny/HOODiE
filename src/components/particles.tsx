import { useMemo } from "react";


/* ---------------- Particles (floating jungle spores) ---------------- */
export default function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: `${(i * 53) % 100}%`,
        delay: `${(i * 0.7) % 8}s`,
        duration: `${8 + ((i * 3) % 10)}s`,
        size: 4 + ((i * 7) % 6),
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: `-10px`,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}