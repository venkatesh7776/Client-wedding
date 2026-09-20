/**
 * Section 4 — Venues & Directions.
 *
 * Everything a guest needs to find the day. Edit the venues here and nowhere
 * else: the section renders whatever this file says, including the "to be
 * announced" state.
 */
export type Venue = {
  /** Small gold label above the name, e.g. "Nikkah Venue". */
  label: string;
  /**
   * The card artwork: frame, illustration and a blank panel across the lower
   * half, where the text is laid out. 1644x1812.
   */
  art: string;
  /** The venue's name, or null while it is still to be confirmed. */
  name: string | null;
  /** Address lines, or an empty array while unknown. */
  address: string[];
  /** Google Maps link. Null disables the button and shows the pending state. */
  mapUrl: string | null;
  /** Date and time of the occasion, shown under the venue name. */
  when: string | null;
  /** The main ceremony is given more visual weight. */
  primary?: boolean;
};

export const VENUES: Venue[] = [
  {
    label: "Nikkah Venue",
    art: "/assets/images/1Nikkah.png",
    name: "Nexstay Hotel Calicut Gate",
    address: ["Near Bus Stand, Ramanattukara,", "Kozhikode, Kerala 673633"],
    mapUrl: "https://maps.app.goo.gl/sbCLK8j51eXAPcmb9",
    when: "November 8, 2026 · Nikkah at 12:30 PM",
    primary: true,
  },
  {
    label: "Reception Venue",
    art: "/assets/images/2reception.png",
    name: "VMJ Convention Center",
    address: ["Vattakattupady,", "683542"],
    mapUrl: "https://maps.google.com/?q=10.100177,76.491241",
    when: "November 10, 2026 · 12:00 PM – 6:00 PM",
  },
];

/**
 * When the Nikkah begins — November 8, 2026 at 12:30 PM in Kozhikode.
 * The offset is India Standard Time, so the countdown is correct for a guest
 * in any timezone rather than only for someone sitting in Kerala.
 */
export const NIKKAH_AT = "2026-11-08T12:30:00+05:30";

export const COUNTDOWN_COPY = {
  title: "Nikkah starts in",
  units: ["Days", "Hours", "Minutes", "Seconds"] as const,
  passed: "The Nikkah has begun",
};

export const VENUE_COPY = {
  title: "Venues & Directions",
  lede: "Find Your Way to Us",
  addressLabel: "Address",
  cta: "Get Directions",
  pendingName: "To be announced",
  pendingAddress: "The venue will be shared here soon",
  pendingCta: "Location coming soon",
} as const;
