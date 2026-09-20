/**
 * Background music.
 *
 * The track the couple supplied, copied into `public` so the browser can reach
 * it. With no file at the path the control hides itself, so the page is never
 * left with a button that does nothing.
 */
export const BGM_SRC = "/assets/audio/mp3.mp3";

/** Kept low on purpose: this sits under the page, it does not lead it. */
export const BGM_VOLUME = 0.32;

/** Seconds spent easing the volume up or down, so it never snaps on. */
export const BGM_FADE = 1.2;
