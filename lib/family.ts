/**
 * Section 2 — Meet the Bride & Groom. Copy is as supplied; do not reword.
 *
 * Portraits: drop the real photographs into /public/assets/images and set
 * `portrait` to their path (e.g. "/assets/images/bride.jpg"). Until then the
 * arch shows a styled placeholder. Portrait-orientation photos crop best.
 */
export type Sibling = { name: string; spouse?: string };

export type Person = {
  role: string;
  name: string;
  relation: string;
  parents: [string, string];
  /**
   * How this person stands to their siblings — "Sister of", "Brother of". It
   * belongs to the person, not the section: the bride and the groom cannot
   * share one word for it.
   */
  siblingsRelation: string;
  /** Shown under the parents, quieter than everything above it. */
  siblings: Sibling[];
  portrait: string | null;
};

export const BRIDE: Person = {
  role: "The Bride",
  name: "Sahla Abdulla",
  relation: "Daughter of",
  parents: ["Neerotum Chalil Abdulla", "Sabira Cherukunnummal"],
  siblingsRelation: "Sister of",
  siblings: [
    { name: "Anees Ahmed Abdulla", spouse: "Saifa Rasheed" },
    { name: "Masoomah Abdulla", spouse: "Adil Ifthikharuddin" },
  ],
  portrait: "/assets/images/Bride.png",
};

export const GROOM: Person = {
  role: "The Groom",
  name: "Abdul Basith T.A",
  relation: "Son of",
  parents: ["Abdul Jabbar T.M", "Rasla Beevi"],
  siblingsRelation: "Brother of",
  siblings: [
    { name: "Rizwa Fathima", spouse: "Safder Abdul Kareem" },
    { name: "Fayiz T.A" },
  ],
  portrait: "/assets/images/GROOM.png",
};

export const SECTION = {
  title: "Meet the Bride & Groom",
  lede: "Two families, one beautiful beginning.",
  spouseOf: "Spouse of",
} as const;
