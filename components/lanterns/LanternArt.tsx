import { useId } from "react";

/*
 * A brass fanous, drawn rather than photographed so it can be tinted, scaled
 * and lit without a download. Everything hangs off four numbers, so the two
 * silhouettes below are the same lantern in different proportions — a family,
 * not two unrelated drawings.
 */
type Shape = {
  /** half-width of the body where the dome meets it */
  shoulder: number;
  /** half-width at the foot, so the body can flare or taper */
  foot: number;
  /** how far the dome rises above the shoulder */
  dome: number;
  /** how long the body runs before the base */
  belly: number;
};

const SHAPES: Record<string, Shape> = {
  /** the fuller one: a deep onion dome over a short body */
  full: { shoulder: 25, foot: 27, dome: 50, belly: 76 },
  /** the slim one: a shallower crown over a longer body */
  slim: { shoulder: 20, foot: 21, dome: 40, belly: 98 },
};

const CX = 52; // the axis everything is drawn about
const CHAIN = 44; // where the chain ends and the ring begins

export function LanternArt({ shape = "full" }: { shape?: keyof typeof SHAPES }) {
  const s = SHAPES[shape];
  const raw = useId();
  const id = (name: string) => `${name}-${raw.replace(/:/g, "")}`;

  /* the lantern is built downward from the suspension ring */
  const crown = CHAIN + 20; // top of the dome
  const shoulder = crown + s.dome; // dome meets body
  const band = shoulder + 9; // shoulder band
  const foot = band + s.belly; // body meets base
  const base = foot + 10; // lower band
  const heel = base + 26; // base taper ends
  const height = heel + 30; // and the finial hangs below that

  const L = CX - s.shoulder;
  const R = CX + s.shoulder;
  const fl = CX - s.foot;
  const fr = CX + s.foot;

  const domePath =
    `M${CX} ${crown}` +
    `C${CX + s.shoulder * 0.42} ${crown + s.dome * 0.2} ${R - 1} ${crown + s.dome * 0.56} ${R} ${shoulder}` +
    `L${L} ${shoulder}` +
    `C${L + 1} ${crown + s.dome * 0.56} ${CX - s.shoulder * 0.42} ${crown + s.dome * 0.2} ${CX} ${crown}Z`;

  const bodyPath = `M${L} ${band} L${R} ${band} L${fr} ${foot} L${fl} ${foot}Z`;
  const glassPath = `M${L + 4} ${band + 5} L${R - 4} ${band + 5} L${fr - 4} ${foot - 5} L${fl + 4} ${foot - 5}Z`;
  const basePath = `M${fl - 2} ${base} L${fr + 2} ${base} L${CX + s.foot * 0.5} ${heel} L${CX - s.foot * 0.5} ${heel}Z`;

  /* the mihrab cut into the glass, the same pointed arch as the section frames */
  const archTop = band + 16;
  const archFoot = foot - 10;
  const arch =
    `M${CX - s.foot * 0.52} ${archFoot}` +
    `V${archTop + 14}` +
    `C${CX - s.foot * 0.52} ${archTop} ${CX - s.foot * 0.2} ${archTop - 8} ${CX} ${archTop - 12}` +
    `C${CX + s.foot * 0.2} ${archTop - 8} ${CX + s.foot * 0.52} ${archTop} ${CX + s.foot * 0.52} ${archTop + 14}` +
    `V${archFoot}`;

  return (
    <svg
      className="lantern__svg"
      viewBox={`0 0 104 ${height}`}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* antique brass, lit from the left as everything else on the page is */}
        <linearGradient id={id("brass")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c5c2a" />
          <stop offset="0.22" stopColor="#c9a25c" />
          <stop offset="0.46" stopColor="#e7ca8d" />
          <stop offset="0.72" stopColor="#b2883f" />
          <stop offset="1" stopColor="#6d4f23" />
        </linearGradient>

        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffdba6" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#ffbe6b" stopOpacity="0.72" />
          <stop offset="1" stopColor="#e09338" stopOpacity="0.5" />
        </linearGradient>

        <radialGradient id={id("flame")}>
          <stop offset="0" stopColor="#fff0cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffca7d" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffab4a" stopOpacity="0" />
        </radialGradient>

        {/* the same eight-point khatam that runs through the rest of the page */}
        <pattern id={id("cut")} width="9" height="9" patternUnits="userSpaceOnUse">
          <path
            d="M4.5 0.6 5.7 3.3 8.4 4.5 5.7 5.7 4.5 8.4 3.3 5.7 0.6 4.5 3.3 3.3Z"
            fill="#4a3415"
            fillOpacity="0.5"
          />
        </pattern>
      </defs>

      {/* the chain, fading out at the top so it reads as going on rather than cut */}
      <g stroke={`url(#${id("brass")})`} strokeLinecap="round">
        <line x1={CX} y1="2" x2={CX} y2={CHAIN} strokeWidth="1.5" strokeOpacity="0.5" />
        {[8, 17, 26, 35].map((y, i) => (
          <ellipse
            key={y}
            cx={CX}
            cy={y}
            rx={i % 2 ? 1.6 : 3.2}
            ry={i % 2 ? 3.4 : 2}
            strokeWidth="1.4"
            strokeOpacity={0.35 + i * 0.12}
          />
        ))}
        <circle cx={CX} cy={CHAIN + 8} r="6.4" strokeWidth="2.2" />
        <line x1={CX} y1={CHAIN + 14} x2={CX} y2={crown} strokeWidth="2" />
      </g>

      {/* crown */}
      <path d={domePath} fill={`url(#${id("brass")})`} />
      <path d={domePath} fill={`url(#${id("cut")})`} />
      <path d={domePath} stroke="#6d4f23" strokeWidth="0.9" strokeOpacity="0.8" />

      {/* the light inside, which is what the glass is for */}
      <ellipse
        className="lantern__glow"
        data-lantern-glow
        cx={CX}
        cy={(band + foot) / 2}
        rx={s.foot + 12}
        ry={s.belly * 0.62}
        fill={`url(#${id("flame")})`}
      />

      {/* body: glass first, then the metal that frames it */}
      <path d={glassPath} fill={`url(#${id("glass")})`} />
      <path d={arch} stroke="#9c7534" strokeWidth="1.1" strokeOpacity="0.75" />
      <path d={bodyPath} stroke={`url(#${id("brass")})`} strokeWidth="2.4" />
      <line
        x1={CX - s.shoulder * 0.34}
        y1={band}
        x2={CX - s.foot * 0.34}
        y2={foot}
        stroke={`url(#${id("brass")})`}
        strokeWidth="1.6"
      />
      <line
        x1={CX + s.shoulder * 0.34}
        y1={band}
        x2={CX + s.foot * 0.34}
        y2={foot}
        stroke={`url(#${id("brass")})`}
        strokeWidth="1.6"
      />

      {/* the two pierced bands that hold the body */}
      {[
        { y: shoulder, h: 9, w: s.shoulder + 3 },
        { y: foot, h: 10, w: s.foot + 4 },
      ].map(({ y, h, w }) => (
        <g key={y}>
          <rect x={CX - w} y={y} width={w * 2} height={h} rx="1.5" fill={`url(#${id("brass")})`} />
          <rect x={CX - w} y={y} width={w * 2} height={h} rx="1.5" fill={`url(#${id("cut")})`} />
        </g>
      ))}

      {/* base and finial */}
      <path d={basePath} fill={`url(#${id("brass")})`} />
      <path d={basePath} fill={`url(#${id("cut")})`} />
      <g fill={`url(#${id("brass")})`}>
        <rect x={CX - 3} y={heel} width="6" height="5" rx="1" />
        <circle cx={CX} cy={heel + 10} r="4.4" />
        <path
          d={`M${CX} ${heel + 15}C${CX - 3.6} ${heel + 19} ${CX - 3.6} ${heel + 25} ${CX} ${heel + 29}C${CX + 3.6} ${heel + 25} ${CX + 3.6} ${heel + 19} ${CX} ${heel + 15}Z`}
        />
      </g>
    </svg>
  );
}
