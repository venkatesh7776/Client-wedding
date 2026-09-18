/*
 * Ornament for the venue cards: the medallion that heads a card when no
 * illustration is supplied, the finial that sits on the arch, the medallions
 * pinned to each side, and the jali band across the foot.
 */
const star = (r1: number, r2: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

/** Eight-point khatam, interlaced — stands in for a photograph. */
export function Medallion({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <rect x="22" y="22" width="56" height="56" strokeWidth="1" opacity="0.45" />
        <rect x="22" y="22" width="56" height="56" strokeWidth="1" opacity="0.45" transform="rotate(45 50 50)" />
        <polygon points={star(40, 21)} strokeWidth="1.3" />
        <polygon points={star(27, 14)} strokeWidth="1" opacity="0.7" />
      </g>
      <polygon points={star(9, 4.6)} fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** The rosette resting on the apex of the arch. */
export function Finial({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M20 4c3.6 4.6 7.4 8.4 12 12-4.6 3.6-8.4 7.4-12 12-3.6-4.6-7.4-8.4-12-12 4.6-3.6 8.4-7.4 12-12Z" />
        <path d="M20 11.5c2.2 2.8 4.5 5.1 7.3 7.3-2.8 2.2-5.1 4.5-7.3 7.3-2.2-2.8-4.5-5.1-7.3-7.3 2.8-2.2 5.1-4.5 7.3-7.3Z" opacity="0.7" />
      </g>
      <circle cx="20" cy="18.8" r="2" fill="currentColor" />
    </svg>
  );
}

/** A slim ornament pinned to the left and right edge of the card. */
export function SideMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 54" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M13 3c4 6 7 9 10 12-3 3-6 6-10 12-4-6-7-9-10-12 3-3 6-6 10-12Z" />
        <path d="M13 29c3 4.5 5.5 7 8 9.5-2.5 2.5-5 5-8 9.5-3-4.5-5.5-7-8-9.5 2.5-2.5 5-5 8-9.5Z" opacity="0.65" />
      </g>
      <circle cx="13" cy="15" r="1.9" fill="currentColor" />
    </svg>
  );
}
