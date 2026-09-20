/**
 * Section 7 — Leave a Message. Copy is as supplied; do not reword.
 */
export const MESSAGE_COPY = {
  title: "Leave a Message for the Couple",
  intro:
    "If you are unable to join us in person, we would still love to hear from you. Please leave a warm note or a personal message for us below.",
  cta: "Send Your Blessings",
} as const;

/**
 * Where the button sends guests — a form, if there is one.
 *
 * With none set it opens the guest's own mail app with the subject already
 * written, so the button is never a dead control. Set either of these and it
 * is used instead; a URL wins over an address.
 */
export const MESSAGE_URL: string | null =
  "https://docs.google.com/forms/d/e/1FAIpQLSeCsqDdZ1D6EaJAMoInRK0VN7ofJ_G1DT28YlsB0vm9BDpQ6w/viewform";
export const MESSAGE_TO: string | null = null;

export const MESSAGE_MAILTO =
  `mailto:${MESSAGE_TO ?? ""}?subject=` +
  encodeURIComponent("A message for Sahla & Abdul Basith") +
  "&body=" +
  encodeURIComponent("Your message:\n\n— ");
