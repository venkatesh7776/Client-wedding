import { ASSETS } from "@/lib/assets";

/** Eight-point star (khatam) — the ornament the whole section is built on. */
export function Star({ className, size = 14 }: { className?: string; size?: number }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 27;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <polygon points={points} fill="currentColor" />
      <circle cx="50" cy="50" r="9" fill="var(--color-ivory)" />
    </svg>
  );
}

/**
 * Crescent (hilal), horns up — the same finial that crowns the palace domes
 * in the hero. Drawn on a 20x20 grid.
 */
export function Crescent({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path d="M2 6A8 8 0 0 0 18 6A12 12 0 0 1 2 6Z" fill="currentColor" />
    </svg>
  );
}

/**
 * The hero's "rule — & — rule" row, with the ampersand swapped for a star.
 * Reuses the exact divider art from the hero.
 */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden data-ornament>
      <img className="ornament__rule ornament__rule--left" src={ASSETS.dividerLeft} alt="" data-ornament-rule />
      <span className="ornament__star" data-ornament-star>
        <Star />
      </span>
      <img className="ornament__rule ornament__rule--right" src={ASSETS.dividerRight} alt="" data-ornament-rule />
    </div>
  );
}
