import gsap from "gsap";

/**
 * One reveal language for the whole page.
 *
 * Section 2 sets it and every other section follows: a block waits until it
 * has actually reached the visitor, then its parts settle one after another
 * rather than all at once, and none of it is quick. The alternative — one
 * timeline hung off the top of a tall section — finishes long before the
 * visitor scrolls far enough to see it, which reads as no animation at all.
 */
export const EASE = "power2.out";
export const EASE_LINE = "power2.inOut";

const PLAY_ONCE = "play none none none";

export const REVEAL = {
  /** how far a line travels as it settles */
  rise: 26,
  /** how long one line takes */
  line: 1.05,
  /** the beat between one line and the next */
  stagger: 0.16,
  /** how long a card, frame or panel takes to arrive */
  frame: 1.15,
  /** a backdrop washing in behind everything */
  wash: 1.6,
} as const;

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A timeline that plays once, when its own block reaches the viewport. Pass
 * the block itself as the trigger — not the section — so each part of a long
 * section gets its own moment on the way down.
 */
export function onEnter(trigger?: Element, start = "top 82%") {
  return gsap.timeline(
    trigger ? { scrollTrigger: { trigger, start, toggleActions: PLAY_ONCE } } : {},
  );
}
