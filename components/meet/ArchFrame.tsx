import { useId, type ReactNode } from "react";

/*
 * The carved arch, now a frame for words rather than a portrait.
 *
 * Everything is drawn on a 360-wide grid; BODY sets how far the straight sides
 * run before the plinth, so the opening can be made as tall as the text inside
 * it needs. The outline is inset three times — stone face, carved band, then
 * the scalloped opening — so every edge stays parallel as it scales.
 */
const BODY = 380;
const TOP_MARGIN = 58; // room above the apex for the finial
const FOOT = 38; // plinth and its shadow

export const ARCH_VIEWBOX = {
  x: -14,
  y: -TOP_MARGIN,
  width: 388,
  height: BODY + TOP_MARGIN + FOOT,
};

const OUTER = `M0 ${BODY}V196C0 104 66 50 146 22C162 16 173 9 180 0C187 9 198 16 214 22C294 50 360 104 360 196V${BODY}Z`;
const BAND = `M14 ${BODY}V199C14 114 76 64 150 38C164 33 174 26 180 18C186 26 196 33 210 38C284 64 346 114 346 199V${BODY}Z`;

/*
 * The opening is scalloped like the palace arches in the hero: cusp points sit
 * on a pointed curve and each lobe bows outward into the stone between them.
 */
type Pt = [number, number];
const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};

function scallopedOpening(lobesPerSide: number): string {
  const segs: [Pt, Pt, Pt, Pt][] = [
    [[40, 214], [40, 132], [94, 86], [158, 64]],
    [[158, 64], [168, 60], [175, 54], [180, 48]],
  ];
  const samples: Pt[] = [];
  segs.forEach((seg, i) => {
    for (let k = i === 0 ? 0 : 1; k <= 60; k++) samples.push(cubic(...seg, k / 60));
  });
  const lengths = [0];
  for (let i = 1; i < samples.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]));
  }
  const total = lengths[lengths.length - 1];
  const cusps: Pt[] = Array.from({ length: lobesPerSide + 1 }, (_, n) => {
    const target = (total * n) / lobesPerSide;
    return samples[Math.max(0, lengths.findIndex((l) => l >= target))];
  });

  const f = (v: number) => Math.round(v * 10) / 10;
  const lobe = (to: Pt, from: Pt) => {
    const r = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.62;
    return `A${f(r)} ${f(r)} 0 0 1 ${f(to[0])} ${f(to[1])}`;
  };

  let d = `M40 ${BODY}V${cusps[0][1]}`;
  for (let n = 1; n < cusps.length; n++) d += lobe(cusps[n], cusps[n - 1]);
  const right = cusps.map(([x, y]) => [360 - x, y] as Pt).reverse();
  for (let n = 1; n < right.length; n++) d += lobe(right[n], right[n - 1]);
  return `${d}V${BODY}Z`;
}

const OPENING = scallopedOpening(4);

export function ArchFrame({ children }: { children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${id}`;
  const { x, y, width, height } = ARCH_VIEWBOX;

  return (
    <div className="arch" data-arch>
      <svg className="arch__svg" viewBox={`${x} ${y} ${width} ${height}`} aria-hidden>
        <defs>
          <linearGradient id={ref("stone")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6ebd0" />
            <stop offset="0.55" stopColor="var(--color-stone)" />
            <stop offset="1" stopColor="#dcc59a" />
          </linearGradient>

          {/* Carved band: a quiet khatam lattice cut into the stone. */}
          <pattern id={ref("carve")} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#e2cda2" />
            <path
              d="M10 1L12.6 7.4L19 10L12.6 12.6L10 19L7.4 12.6L1 10L7.4 7.4Z"
              fill="#efe0bd"
              stroke="var(--color-stone-shadow)"
              strokeOpacity="0.7"
              strokeWidth="0.9"
            />
          </pattern>

          {/* the page the words are set on */}
          <linearGradient id={ref("paper")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf9f0" />
            <stop offset="1" stopColor="var(--color-ivory)" />
          </linearGradient>

          <filter id={ref("lift")} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="var(--color-stone-shadow)" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* Stone arch, lifted off the wall */}
        <g filter={`url(#${ref("lift")})`}>
          <rect x="-4" y={BODY - 2} width="368" height="14" fill="#e2cda2" />
          <rect x="-12" y={BODY + 10} width="384" height="16" rx="1.5" fill="var(--color-stone)" />
          <rect x="-12" y={BODY + 10} width="384" height="2" fill="var(--color-stone-shadow)" fillOpacity="0.45" />
          <path d={OUTER} fill={`url(#${ref("stone")})`} />
        </g>

        <path d={BAND} fill={`url(#${ref("carve")})`} />
        <path d={BAND} fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />

        {/* the opening, and the reveal cut into its edge */}
        <path d={OPENING} fill={`url(#${ref("paper")})`} data-opening />
        <path d={OPENING} fill="none" stroke="var(--color-stone-shadow)" strokeOpacity="0.5" strokeWidth="5" />
        <path d={OPENING} fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />

        {/* Finial: stem, orb and crescent, as on the hero's palace domes */}
        <line x1="180" y1="-22" x2="180" y2="0" stroke="var(--color-gold)" strokeWidth="1.8" />
        <circle cx="180" cy="-13" r="4" fill="var(--color-gold)" />
        <path
          d="M168 -43A12 12 0 0 0 192 -43A14.4 14.4 0 0 1 168 -43Z"
          fill="var(--color-gold)"
          transform="rotate(180 180 -37)"
        />
      </svg>

      {/* the words sit inside the opening, below the scalloped crown */}
      <div className="arch__inner">{children}</div>
    </div>
  );
}
