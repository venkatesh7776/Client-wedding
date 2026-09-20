/**
 * Background music.
 *
 * The track is supplied by the couple. With no file at the path the control
 * hides itself, so the page is never left with a button that does nothing.
 *
 * (assets/audio/make_bgm.py still holds the synthesised piece this replaced,
 * if a licence-free bed is ever wanted instead.)
 *
 * Browsers will not let a page play sound unheard, so it always starts silent
 * and waits for the visitor to ask for it.
 */
export const BGM_SRC = "/assets/audio/Sahiba%20%28Music%20Video%29%20Jasleen%20Royal%20Vijay%20Deverakonda%20Radhikka%20Madan%20Stebin%20Priya%20Aditya%20Sudhanshu.mp3";

/** Kept low on purpose: this sits under the page, it does not lead it. */
export const BGM_VOLUME = 0.32;

/** Seconds spent easing the volume up or down, so it never snaps on. */
export const BGM_FADE = 1.2;
