import gsap from "gsap";

import { reducedMotion } from "./reveal";

/**
 * One spark's place and behaviour.
 *
 * Like the lanterns, nothing here is keyed to a section: the whole document is
 * the timeline. A spark crosses a section boundary without noticing it.
 */
export type Spark = {
  /** where it sits across the page, 0 → 1 of the viewport width */
  x: number;
  /** where it starts and ends down the page, in fractions of viewport height */
  from: number;
  to: number;
  /** how far it drifts sideways over the page, in px */
  wander: number;
  /** how many times it wanders across, and where in that wave it starts */
  waves: number;
  phase: number;
  /** px across at its brightest */
  size: number;
  /** its brightest opacity */
  peak: number;
  /** seconds for one breath, and where in that breath it begins */
  period: number;
  delay: number;
};

/*
 * A dozen, spread across the width and staggered down the page so a screen
 * holds two or three rather than a handful — half as many as there were, and
 * each one as bright as the brightest was. Sparse, not faint: a few points
 * that can actually be seen beats a field of ones that cannot. They are deliberately uneven —
 * no grid, no mirrored pairs — because anything regular reads as a pattern
 * instead of as light.
 *
 * `to` is always less than `from`: as the page is scrolled down, the sparks
 * travel up the screen, the way anything at rest does when you move past it.
 * Some travel further than others, which is the whole trick — the distant ones
 * barely move and the near ones sail by.
 */
export const SPARKS: Spark[] = [
  { x: 0.06, from: 0.82, to: 0.05, wander: 22, waves: 2.0, phase: 0.0,  size: 8.1, peak: 0.85, period: 3.4, delay: 0.0 },
  { x: 0.19, from: 0.64, to: 0.02, wander: 30, waves: 2.6, phase: 0.2,  size: 11.0, peak: 0.95, period: 2.9, delay: 0.4 },
  { x: 0.32, from: 0.5,  to: -0.1, wander: 25, waves: 2.2, phase: 0.35, size: 9.0, peak: 0.81,  period: 3.8, delay: 0.7 },
  { x: 0.44, from: 0.74, to: 0.08, wander: 28, waves: 2.9, phase: 0.65, size: 10.5, peak: 0.90,  period: 3.1, delay: 0.2 },
  { x: 0.56, from: 0.9,  to: 0.16, wander: 21, waves: 2.4, phase: 0.05, size: 8.5, peak: 0.77, period: 3.6, delay: 1.3 },
  { x: 0.68, from: 0.58, to: -0.04, wander: 26, waves: 2.7, phase: 0.28, size: 9.5, peak: 0.89, period: 3.0, delay: 2.2 },
  { x: 0.81, from: 0.7,  to: 0.06, wander: 24, waves: 2.3, phase: 0.15, size: 9.0, peak: 0.82, period: 3.9, delay: 1.8 },
  { x: 0.93, from: 0.46, to: -0.12, wander: 29, waves: 2.8, phase: 0.4,  size: 11.5, peak: 0.92, period: 2.7, delay: 0.3 },
  { x: 0.09, from: 0.38, to: -0.16, wander: 20, waves: 2.1, phase: 0.5,  size: 7.6, peak: 0.69,  period: 4.1, delay: 2.4 },
  { x: 0.35, from: 0.8,  to: 0.1,  wander: 23, waves: 2.5, phase: 0.7,  size: 8.5, peak: 0.76, period: 3.5, delay: 1.9 },
  { x: 0.59, from: 0.54, to: -0.06, wander: 27, waves: 3.0, phase: 0.8,  size: 10.0, peak: 0.85, period: 3.2, delay: 2.7 },
  { x: 0.84, from: 0.42, to: -0.14, wander: 25, waves: 2.0, phase: 0.58, size: 7.6, peak: 0.73, period: 4.3, delay: 0.1 },
];

const TAU = Math.PI * 2;

/**
 * Sets the sparks drifting.
 *
 * Two motions, each owning its own element so they cannot fight: the outer box
 * is carried by the scroll, and the point inside it breathes on its own clock.
 * Only the first is tied to the scroll, so the shimmer carries on while the
 * page is still — the same division the lanterns use.
 */
export function driftSparkles(layer: HTMLElement | null) {
  const sparks = layer ? Array.from(layer.querySelectorAll<HTMLElement>("[data-spark]")) : [];
  if (!sparks.length) return;

  const move = sparks.map((el) => ({
    x: gsap.quickSetter(el, "x", "px") as (v: number) => void,
    y: gsap.quickSetter(el, "y", "px") as (v: number) => void,
  }));

  /** where every spark sits at a given point through the page, 0 → 1 */
  const place = (p: number) => {
    const h = window.innerHeight;
    sparks.forEach((_, i) => {
      const s = SPARKS[i % SPARKS.length];
      move[i].x(Math.sin((p * s.waves + s.phase) * TAU) * s.wander);
      move[i].y((s.from + (s.to - s.from) * p) * h);
    });
  };

  place(0);
  if (reducedMotion()) return;

  /*
   * The driver is the page's own scroll position — no trigger, no section,
   * nothing for a spark to restart at. The reading is eased on every frame
   * rather than snapped to the scroll, so the travel keeps settling for a
   * moment after the page has stopped.
   */
  let eased = 0;
  const glide = () => {
    const room = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const target = Math.min(1, Math.max(0, window.scrollY / room));
    eased += (target - eased) * 0.055;
    place(eased);
  };
  gsap.ticker.add(glide);

  /* And the shine: each one brightens and dims on its own clock, so the layer
     never pulses together. `yoyo` rather than a loop, because a spark that
     snaps back to dark reads as a flicker — and it dims only to half, never
     to nothing, or half of them are missing at any given moment. */
  const shines = sparks.map((el, i) => {
    const s = SPARKS[i % SPARKS.length];
    const point = el.firstElementChild ?? el;
    return gsap.fromTo(
      point,
      { opacity: s.peak * 0.5, scale: 0.78 },
      {
        opacity: s.peak,
        scale: 1,
        duration: s.period / 2,
        delay: s.delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
    );
  });

  return () => {
    gsap.ticker.remove(glide);
    shines.forEach((t) => t.kill());
  };
}
