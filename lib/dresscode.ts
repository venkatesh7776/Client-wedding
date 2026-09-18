/**
 * Section 5 — Dress Code. Copy is as supplied; do not reword.
 */
export const DRESS_COPY = {
  title: "Dress Code",
  lede: "Come as you are.",
  body: [
    "There is no dress code for our celebration.",
    "Your presence and prayers are the greatest gift.",
  ],
} as const;

/** The closing line, set as three panels rather than one run of text. */
export const DRESS_NOTES = [
  { icon: "garment", label: "Dress comfortably" },
  { icon: "lantern", label: "Celebrate joyfully" },
  { icon: "arch", label: "Be with us" },
] as const;

export type DressNote = (typeof DRESS_NOTES)[number];
