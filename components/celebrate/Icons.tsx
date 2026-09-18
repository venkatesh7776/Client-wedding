/*
 * Small line icons for the detail rows, drawn in currentColor so they take the
 * section's gold. Kept deliberately plain — they label, they don't decorate.
 */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...base}>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2.4" />
      <path d="M3.2 9.6h17.6M8.4 3v4M15.6 3v4" />
    </svg>
  );
}

export function ClockIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...base}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 6.8V12l3.4 2.2" />
    </svg>
  );
}

export function PinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...base}>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10.4" r="2.6" />
    </svg>
  );
}

export function RingsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...base}>
      <circle cx="9.4" cy="14.6" r="5.4" />
      <circle cx="15.2" cy="10.6" r="5.4" />
    </svg>
  );
}

/** Small diamond flourish used either side of the numeral. */
export function Diamond({ size = 7 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
      <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
    </svg>
  );
}

/** The four-petal rosette that separates blocks inside a card. */
export function Rosette({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 1.6c1.6 4 4.8 7.2 8.8 8.8v3.2c-4 1.6-7.2 4.8-8.8 8.8h-.0c-1.6-4-4.8-7.2-8.8-8.8v-3.2C7.2 8.8 10.4 5.6 12 1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
