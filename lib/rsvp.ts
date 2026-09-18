/**
 * Section 6 — the invitation and RSVP. Copy is as supplied; do not reword.
 */
export const RSVP_COPY = {
  eyebrow: "Invitation to",
  names: "Sahla & Abdul Basith",
  body: [
    "We joyfully invite you to join us as we celebrate",
    "our Nikkah and the beginning of our beautiful journey together.",
  ],
  occasion: "Nikkah Ceremony",
  date: "November 8, 2026",
  venue: "Nexstay Hotel Calicut Gate",
  cta: "Submit RSVP",
} as const;

/**
 * Where the RSVP button sends guests. Set this to the real destination — a
 * Google Form, a WhatsApp link (https://wa.me/<number>?text=...), or a mailto
 * address — and the button opens it in a new tab.
 *
 * Until it is set the button still works, opening the guest's mail app with
 * the subject already written, so it is never a dead control. Replace it here
 * and nowhere else.
 */
export const RSVP_URL: string | null = null;

/** Fallback so the button is always live. */
export const RSVP_FALLBACK =
  "mailto:?subject=" + encodeURIComponent("RSVP — Sahla & Abdul Basith") +
  "&body=" + encodeURIComponent(
    "Name:\nNumber of guests:\nAttending the Nikkah on November 8, 2026:\n",
  );
