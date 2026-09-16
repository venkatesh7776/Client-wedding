import { useId } from "react";

import { Crescent, Star } from "./Ornament";

/*
 * One Islamic pointed arch, drawn once on a 360x390 grid (plus finial above
 * and plinth below). The same outline is inset three times — stone face,
 * carved band, portrait window — so every edge stays parallel as it scales.
 */
const OUTER =
  "M0 390V196C0 104 66 50 146 22C162 16 173 9 180 0C187 9 198 16 214 22C294 50 360 104 360 196V390Z";
const BAND =
  "M14 390V199C14 114 76 64 150 38C164 33 174 26 180 18C186 26 196 33 210 38C284 64 346 114 346 199V390Z";

/*
 * The portrait opening is scalloped like the hero's palace arches: cusp points
 * sit on a pointed curve and each lobe bows outward into the stone between them.
 */
type Pt = [number, number];
const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};

function scallopedWindow(lobesPerSide: number): string {
  // Left half of the opening, springline to apex.
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
    const [x0, y0] = samples[i - 1];
    const [x1, y1] = samples[i];
    lengths.push(lengths[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = lengths[lengths.length - 1];
  const cusps: Pt[] = Array.from({ length: lobesPerSide + 1 }, (_, n) => {
    const target = (total * n) / lobesPerSide;
    const i = lengths.findIndex((l) => l >= target);
    return samples[Math.max(0, i)];
  });

  const f = (v: number) => Math.round(v * 10) / 10;
  const lobe = (to: Pt, from: Pt) => {
    const r = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.62;
    return `A${f(r)} ${f(r)} 0 0 1 ${f(to[0])} ${f(to[1])}`;
  };

  let d = `M40 390V${cusps[0][1]}`;
  for (let n = 1; n < cusps.length; n++) d += lobe(cusps[n], cusps[n - 1]);
  const right = cusps.map(([x, y]) => [360 - x, y] as Pt).reverse();
  for (let n = 1; n < right.length; n++) d += lobe(right[n], right[n - 1]);
  return `${d}V390Z`;
}

const WINDOW = scallopedWindow(4);

type Props = {
  /** Path to the real photograph, or null for the placeholder. */
  src: string | null;
  /** Accessible description, e.g. "Portrait of Sahla Abdulla". */
  alt: string;
  /** Shown inside the placeholder, e.g. "Bride". */
  label: string;
  /** Which side of the composition this arch belongs to. */
  side: "bride" | "groom";
};

export function ArchPortrait({ src, alt, label, side }: Props) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${id}`;

  return (
    <div className={`arch arch--${side}`} data-arch>
      <svg
        className="arch__svg"
        viewBox="-14 -58 388 486"
        role="img"
        aria-label={src ? alt : `${alt} — photograph to come`}
      >
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

          <linearGradient id={ref("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-sky-top)" />
            <stop offset="0.62" stopColor="var(--color-ivory)" />
            <stop offset="1" stopColor="var(--color-stone-light)" />
          </linearGradient>

          {/* Light falls in from above, so the top of the window sits in shade. */}
          <linearGradient id={ref("shade")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.16" />
            <stop offset="0.35" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>

          <pattern id={ref("lattice")} width="44" height="44" patternUnits="userSpaceOnUse">
            <path
              d="M22 4L27.5 16.5L40 22L27.5 27.5L22 40L16.5 27.5L4 22L16.5 16.5Z"
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>

          <clipPath id={ref("window")}>
            <path d={WINDOW} />
          </clipPath>

          <filter id={ref("lift")} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="var(--color-stone-shadow)" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Stone arch, lifted off the wall */}
        <g filter={`url(#${ref("lift")})`}>
          <rect x="-4" y="388" width="368" height="14" fill="#e2cda2" />
          <rect x="-12" y="400" width="384" height="16" rx="1.5" fill="var(--color-stone)" />
          <rect x="-12" y="400" width="384" height="2" fill="var(--color-stone-shadow)" fillOpacity="0.45" />
          <path d={OUTER} fill={`url(#${ref("stone")})`} />
        </g>

        <path d={BAND} fill={`url(#${ref("carve")})`} />
        <path d={BAND} fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />

        {/* Portrait window */}
        <g clipPath={`url(#${ref("window")})`}>
          <g data-arch-window>
            {/* Soft sky behind the figure — the portraits are transparent cutouts. */}
            <rect x="30" y="40" width="300" height="350" fill={`url(#${ref("sky")})`} />
            <rect x="30" y="40" width="300" height="350" fill={`url(#${ref("lattice")})`} />
            {src ? (
              // Standing on the sill, head clear of the scalloped crown.
              <image href={src} x="38" y="80" width="284" height="310" preserveAspectRatio="xMidYMax meet" />
            ) : (
              <g>
                <g transform="translate(163 206)" color="var(--color-gold)" opacity="0.7">
                  <Star size={34} />
                </g>
                <text x="180" y="272" textAnchor="middle" className="arch__placeholder">
                  {label} · photograph
                </text>
              </g>
            )}
          </g>
          <rect x="30" y="40" width="300" height="350" fill={`url(#${ref("shade")})`} />
        </g>
        <path d={WINDOW} fill="none" stroke="var(--color-stone-shadow)" strokeOpacity="0.55" strokeWidth="5" />
        <path d={WINDOW} fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />

        {/* Finial: stem, orb and crescent, as on the hero's palace domes */}
        <line x1="180" y1="-24" x2="180" y2="0" stroke="var(--color-gold)" strokeWidth="1.8" />
        <circle cx="180" cy="-13" r="4" fill="var(--color-gold)" />
        <g transform="translate(165 -43)" color="var(--color-gold)">
          <Crescent size={30} />
        </g>
      </svg>
    </div>
  );
}
