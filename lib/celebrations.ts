/**
 * Section 3 — The Wedding Celebrations. Copy is as supplied; do not reword.
 */
export type Detail = { label: string; value: string };

export type Celebration = {
  /** Displayed as the numeral on the card, e.g. "01". */
  index: string;
  title: string;
  details: Detail[];
  /**
   * The card artwork: an ornate frame with the photograph already set into it
   * and a blank panel below, where the text is laid out. 956x1106.
   */
  art: string;
};

export const CELEBRATIONS: Celebration[] = [
  {
    index: "01",
    title: "Mehandi Night",
    details: [
      { label: "Date", value: "November 7, 2026" },
      { label: "Time", value: "7:00 PM – 10:00 PM" },
      { label: "Location", value: "Bride’s Residence" },
    ],
    art: "/assets/images/Mehandi.png",
  },
  {
    index: "02",
    title: "Nikkah Ceremony",
    details: [
      { label: "Date", value: "November 8, 2026" },
      { label: "Time", value: "11:00 AM – 4:00 PM" },
      { label: "Nikkah", value: "12:30 PM" },
      { label: "Location", value: "Nexstay Hotel Calicut Gate" },
    ],
    art: "/assets/images/Nikah.png",
  },
  {
    index: "03",
    title: "Reception",
    details: [
      { label: "Date", value: "November 10, 2026" },
      { label: "Time", value: "12:00 PM – 6:00 PM" },
      { label: "Location", value: "Venue details to be added" },
    ],
    art: "/assets/images/Reception.png",
  },
];

export const CELEBRATION_COPY = {
  title: "The Wedding Celebrations",
  lede: "Three beautiful moments, one beautiful beginning.",
  closingTitle: "Three celebrations, one beautiful beginning.",
  closingLine: "We look forward to celebrating these precious moments with you.",
} as const;
