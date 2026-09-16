/**
 * Section 2 — Meet the Bride & Groom. Copy is as supplied; do not reword.
 *
 * Portraits: drop the real photographs into /public/assets/images and set
 * `portrait` to their path (e.g. "/assets/images/bride.jpg"). Until then the
 * arch shows a styled placeholder. Portrait-orientation photos crop best.
 */
export type Person = {
  role: string;
  name: string;
  relation: string;
  parents: [string, string];
  portrait: string | null;
};

export type Sibling = { name: string; spouse?: string };

export const BRIDE: Person = {
  role: "The Bride",
  name: "Sahla Abdulla",
  relation: "Daughter of",
  parents: ["Neerotum Chalil Abdulla", "Sabira Cherukunnummal"],
  portrait: "/assets/images/Bride.png",
};

export const GROOM: Person = {
  role: "The Groom",
  name: "Abdul Basith T.A",
  relation: "Son of",
  parents: ["Abdul Jabbar T.M", "Rasla Beevi"],
  portrait: "/assets/images/GROOM.png",
};

export const FAMILIES: { title: string; members: Sibling[] }[] = [
  {
    title: "Sahla’s Family",
    members: [
      { name: "Anees Ahmed Abdulla", spouse: "Saifa Rasheed" },
      { name: "Masoomah Abdulla", spouse: "Adil Ifthikharuddin" },
    ],
  },
  {
    title: "Abdul Basith’s Family",
    members: [
      { name: "Rizwa Fathima", spouse: "Safder Abdul Kareem" },
      { name: "Fayiz T.A" },
    ],
  },
];

export const SECTION = {
  title: "Meet the Bride & Groom",
  lede: "Two families, one beautiful beginning.",
  familiesTitle: "Their Families",
} as const;

