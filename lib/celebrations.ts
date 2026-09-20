import { VENUES } from "./venues";

/**
 * Section 3 — The Wedding Celebrations. Copy is as supplied; do not reword.
 */
export type Celebration = {
  /** Displayed before the title, e.g. "01". */
  index: string;
  title: string;
  date: string;
  time: string;
  /** An extra line above the venue, when there is one. */
  note?: string;
  venue: string;
  /** Which icon heads the card. */
  icon: string;
};

/** The reception venue is kept in one place — Section 4 owns it. */
const RECEPTION = VENUES.find((v) => v.label === "Reception Venue");

export const CELEBRATIONS: Celebration[] = [
  {
    index: "01",
    title: "Mehandi Night",
    date: "November 7, 2026",
    time: "7:00 PM – 10:00 PM",
    venue: "Bride’s Residence",
    icon: "/assets/images/celebration-mehandi.png",
  },
  {
    index: "02",
    title: "Nikkah Ceremony",
    date: "November 8, 2026",
    time: "11:00 AM – 4:00 PM",
    note: "Nikkah at 12:30 PM",
    venue: "Nexstay Hotel Calicut Gate",
    icon: "/assets/images/celebration-nikkah.png",
  },
  {
    index: "03",
    title: "Reception",
    date: "November 10, 2026",
    time: "12:00 PM – 6:00 PM",
    venue: RECEPTION?.name ?? "Venue details to be added",
    icon: "/assets/images/celebration-reception.png",
  },
];

export const CELEBRATION_COPY = {
  title: "The Wedding Celebrations",
  lede: "Three beautiful moments, one beautiful beginning.",
  closingTitle: "Three celebrations, one beautiful beginning.",
  closingLine: "We look forward to celebrating these precious moments with you.",
} as const;
