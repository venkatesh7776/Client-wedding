/**
 * Every asset here was exported from the Figma file `Wedding` / Page 4 (node 73:189).
 * File names are the ones already present in the project — do not rename or regenerate them.
 */
export const ASSETS = {
  /** Palace / hero background — 1704x923 WebP, sits under the sky gradient */
  heroBackground: "/assets/images/hero-background.webp",
  /** Couple — 1374x1145 WebP, cropped into the 371x347 Figma box */
  couple: "/assets/images/Couple.webp",
  /** Lamp 1 + Lamp 2 share one source — 887x1774 WebP */
  lamp: "/assets/images/lamp.webp",
  /** Pillar 1 + Pillar 2 share one source — 1024x555 WebP (Pillar 2 is mirrored) */
  pillar: "/assets/images/Pillar.webp",
  /** Portrait pillar for phones — 877x1792 WebP, from Figma "Mobile responsive" (node 84:4) */
  pillarMobile: "/assets/images/pillar-mobile.webp",
  /** Venues & Directions backdrop — 2880x2428, i.e. exactly 2x the 1440x1214 stage */
  venueBackground: "/assets/images/VENUE%20BG%20copy.png",
  /**
   * Countdown backdrop — 2880x1680 night skyline, the sibling of the venues
   * artwork. WebP: the PNG it came from is 3.8MB and this is 107KB, which
   * matters for a picture nobody waits on but everybody downloads.
   */
  countdownBackground: "/assets/images/countdown-bg.webp",
  /** Loader backdrop — 1665x944 WebP (spaces escaped for the URL) */
  loaderBackground: "/assets/images/new%20loader%20bg.webp",
  /** Closing section backdrop — 2880x1554 palace terrace at sunrise (space escaped) */
  footerBackground: "/assets/images/Footer%20.png",
  /** Leave a Message backdrop — 2880x1560 navy skyline */
  messageBackground: "/assets/images/VENU%20section7.png",
  /** Watercolour mosque for the invitation — 3356x1874, transparent */
  rsvpScene: "/assets/images/RSVP.png",
  /** Celebration illustrations — inked, transparent, 360px wide */
  celebrationMehandi: "/assets/images/celebration-mehandi.png",
  celebrationNikkah: "/assets/images/celebration-nikkah.png",
  celebrationReception: "/assets/images/celebration-reception.png",
  /** Rule to the left of the ampersand — 155px */
  dividerLeft: "/assets/icons/divider-left.svg",
  /** Rule to the right of the ampersand — 171px */
  dividerRight: "/assets/icons/divider-right.svg",
} as const;
