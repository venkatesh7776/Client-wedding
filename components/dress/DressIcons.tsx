/*
 * Line icons for the three notes, drawn in the same architectural language as
 * the rest of the site: ink stroke, no fill, nothing fussy.
 */
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A kurta on a hanger — dress comfortably. */
export function GarmentIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <g {...line}>
        <path d="M32 10a3.4 3.4 0 1 0-3 3.4c0 2.2 3 2.6 3 4.6" />
        <path d="M32 18.6 16.5 26c-1.6.8-2.4 2.2-2.4 3.9v3.4l6.6 2.1" />
        <path d="M32 18.6 47.5 26c1.6.8 2.4 2.2 2.4 3.9v3.4l-6.6 2.1" />
        <path d="M20.7 35.4V54h22.6V35.4" />
        <path d="M32 19.6v8.6" />
        <path d="M27.6 21.6 32 28.2l4.4-6.6" opacity="0.6" />
        <path d="M32 33v18" opacity="0.45" />
      </g>
    </svg>
  );
}

/** A hanging lantern — celebrate joyfully. */
export function LanternIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <g {...line}>
        <path d="M32 6v5" />
        <path d="M24.5 15.5h15" />
        <path d="M27 11h10l2.5 4.5h-15z" />
        <path d="M26 15.5c-3 3.6-4.6 7.6-4.6 12.2S23 37 26 41.2h12c3-4.2 4.6-8.4 4.6-13.5s-1.6-8.6-4.6-12.2" />
        <path d="M24.4 41.2h15.2l-2 4.6h-11.2z" />
        <path d="M32 45.8v4.4" />
        <circle cx="32" cy="53.4" r="2.6" />
        <path d="M28.6 22.4c-1.4 1.8-2.2 3.6-2.2 5.8" opacity="0.55" />
      </g>
    </svg>
  );
}

/** An open arch with a star above it — be with us. */
export function ArchIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <g {...line}>
        <path d="M14 54V30.5C14 20.8 22 13 32 13s18 7.8 18 17.5V54" />
        <path d="M23 54V32.6C23 27.3 27 23 32 23s9 4.3 9 9.6V54" />
        <path d="M10 54h44" />
        <path d="M32 8.5v3.2" opacity="0.7" />
        <path d="M32 2.8l1.9 4.2L38 8.9l-4.1 1.9L32 15l-1.9-4.2L26 8.9l4.1-1.9z" />
      </g>
    </svg>
  );
}
