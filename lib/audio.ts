/**
 * Background music.
 *
 * The track here is synthesised rather than sourced: a 32-second loop in D
 * major pentatonic — a warm drone under a sparse bell figure — written by
 * assets/audio/make_bgm.py. Nothing is sampled or borrowed, so there is no
 * licensing question hanging over it. Replace the file to use your own; with
 * no file there at all the control hides itself.
 *
 * Browsers will not let a page play sound unheard, so it always starts silent
 * and waits for the visitor to ask for it.
 */
export const BGM_SRC = "/assets/audio/bgm.m4a";

/** Kept low on purpose: this sits under the page, it does not lead it. */
export const BGM_VOLUME = 0.32;

/** Seconds spent easing the volume up or down, so it never snaps on. */
export const BGM_FADE = 1.2;
