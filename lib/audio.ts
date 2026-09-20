/**
 * Background music — Brooklyn Duo, "A Thousand Years" (wedding version).
 *
 * Copied into `public` so the browser can reach it; the original lives in
 * assets/audio. With no file at the path the control hides itself, so the page
 * is never left with a button that does nothing.
 */
export const BGM_SRC = "/assets/audio/a-thousand-years.mp3";

/** Kept low on purpose: this sits under the page, it does not lead it. */
export const BGM_VOLUME = 0.32;

/**
 * Seconds spent easing the volume up or down, so it never snaps on. Short
 * enough that the track is audible as soon as it starts: a long ramp reads as
 * the music being late rather than as a fade.
 */
export const BGM_FADE = 0.7;
