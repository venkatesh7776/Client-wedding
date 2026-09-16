import gsap from "gsap";

/**
 * Cue sheet for the entrance. Every value is an absolute position on the
 * master timeline, in seconds, so the whole sequence can be re-timed here
 * without touching the tweens.
 */
export const CUE = {
  /** Loader Ring sweeps a full clockwise turn. */
  ringStart: 0,
  ringDuration: 2.8,

  /** Loader starts dissolving just before the ring lands, so there is no cut. */
  loaderOut: 2.6,
  loaderOutDuration: 1.0,

  /** Palace opens out of the ring's footprint. */
  heroIn: 2.6,
  heroClip: 2.8,
  heroClipDuration: 1.9,
  heroPushDuration: 3.6,

  /** The architecture closes in around the scene. */
  pillars: 3.6,
  pillarsDuration: 2.0,

  /* From here the moves overlap rather than queue, so the scene never stops
     and restarts — each element is still settling as the next begins. */

  /** Lamp 1, then Lamp 2, descend. */
  lamps: 5.0,
  lampsDuration: 1.5,
  lampsStagger: 0.22,

  /** Names settle down from above. */
  text: 5.3,
  textDuration: 1.2,
  textStagger: 0.14,

  /** The couple rises into the courtyard. */
  couple: 5.5,
  coupleDuration: 1.5,

  /** Lamps take on a life of their own. */
  float: 7.1,
} as const;

/**
 * Easing is what actually governs whether a move reads as fast. An `out` curve
 * leaves at full speed and spends its tail decelerating, so it looks abrupt
 * however long it runs — the heavier the element, the more it needs to ease in
 * as well as out.
 */
export const EASE = {
  /** Pillars: stone, so it gathers speed and sheds it. Never starts at full tilt. */
  architecture: "power2.inOut",
  /** The palace opening out of the ring. */
  reveal: "power2.inOut",
  /** Anything descending or rising into its final place. */
  settle: "power2.out",
} as const;

/**
 * Each lamp gets two independent motions:
 *
 *   sway — x and rotation together, because a hanging lamp that swings right
 *          also tilts right. Slow: a full pass takes six or seven seconds.
 *   bob  — a shallower rise and fall on a shorter, unrelated period.
 *
 * Both start with a half-length lead-in so the lamp eases out of rest instead
 * of snapping to one end of its arc. The two periods never line up, and the
 * second lamp is offset again, so nothing ever ticks in unison.
 */
function swing(
  lamp: Element,
  o: { x: number; rotation: number; y: number; sway: number; bob: number; delay: number },
) {
  gsap
    .timeline({ delay: o.delay })
    .to(lamp, {
      x: -o.x,
      rotation: -o.rotation,
      duration: o.sway / 2,
      ease: "sine.inOut",
      transformOrigin: "50% 0%",
    })
    .to(lamp, {
      x: o.x,
      rotation: o.rotation,
      duration: o.sway,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

  gsap
    .timeline({ delay: o.delay })
    .to(lamp, { y: -o.y, duration: o.bob / 2, ease: "sine.inOut" })
    .to(lamp, { y: o.y, duration: o.bob, ease: "sine.inOut", repeat: -1, yoyo: true });
}

export function startLampDrift(lampOne: Element, lampTwo: Element) {
  swing(lampOne, { x: 6, rotation: 1.4, y: 4, sway: 6.1, bob: 3.5, delay: 0 });
  swing(lampTwo, { x: -5, rotation: -1.6, y: 3, sway: 6.9, bob: 4.0, delay: 0.6 });
}
