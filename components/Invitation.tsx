"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Hero } from "./Hero";
import { Loader } from "./Loader";
import { CUE, EASE, startLampDrift } from "@/lib/timeline";
import { useStageScale } from "@/lib/useStageScale";

gsap.registerPlugin(useGSAP);

/**
 * One master timeline carries the whole unveiling:
 *
 *   Loader Ring 360deg -> palace opens -> Pillar 1 + Pillar 2 close in ->
 *   Lamp 1 + Lamp 2 descend -> names settle -> Couple rises -> lamps drift on
 *
 * Only transforms, opacity and clip-path are animated, so the browser can keep
 * the whole thing on the compositor.
 */
export function Invitation() {
  const root = useRef<HTMLDivElement>(null);

  useStageScale(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const lamps = q("[data-lamp]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Land on the finished composition; no motion at all.
        gsap.set(q("[data-loader]"), { autoAlpha: 0, display: "none" });
        gsap.set(q("[data-hero-bg]"), { opacity: 1 });
        gsap.set(q("[data-hero-clip]"), { clipPath: "none" });
        gsap.set([q("[data-pillar]"), lamps, q("[data-reveal]"), q("[data-couple]")], {
          opacity: 1,
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.settle } });

      /* ---- Loader: one controlled clockwise turn, no easing games ---- */
      tl.fromTo(
        q("[data-ring]"),
        { rotation: 0 },
        {
          rotation: 360,
          duration: CUE.ringDuration,
          ease: "none",
          transformOrigin: "50% 50%",
        },
        CUE.ringStart,
      );

      /* ---- Loader dissolves outward rather than cutting away ---- */
      tl.to(
        q("[data-loader]"),
        {
          opacity: 0,
          scale: 1.06,
          duration: CUE.loaderOutDuration,
          ease: "power2.inOut",
        },
        CUE.loaderOut,
      ).set(
        q("[data-loader]"),
        { visibility: "hidden", pointerEvents: "none" },
        CUE.loaderOut + CUE.loaderOutDuration,
      );

      /* ---- Hero 25%: the palace opens out of the ring's own footprint ---- */
      tl.to(
        q("[data-hero-bg]"),
        { opacity: 1, duration: 0.9, ease: "power1.out" },
        CUE.heroIn,
      )
        .fromTo(
          q("[data-hero-clip]"),
          { clipPath: "circle(15% at 50% 50%)" },
          {
            clipPath: "circle(105% at 50% 50%)",
            duration: CUE.heroClipDuration,
            ease: EASE.reveal,
          },
          CUE.heroClip,
        )
        .fromTo(
          q("[data-hero-image]"),
          { scale: 1.14 },
          { scale: 1, duration: CUE.heroPushDuration, ease: EASE.reveal },
          CUE.heroClip,
        )
        .set(
          q("[data-hero-clip]"),
          { clipPath: "none", willChange: "auto" },
          CUE.heroClip + CUE.heroClipDuration,
        );

      /* ---- Hero 50%: the arch closes in from both sides ---- */
      tl.fromTo(
        q("[data-pillar='left']"),
        { xPercent: -130, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: CUE.pillarsDuration,
          ease: EASE.architecture,
        },
        CUE.pillars,
      ).fromTo(
        q("[data-pillar='right']"),
        { xPercent: 130, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: CUE.pillarsDuration,
          ease: EASE.architecture,
        },
        CUE.pillars,
      );

      /* ---- Hero 100%: lamps, then names, then the couple ---- */
      tl.fromTo(
        lamps,
        { yPercent: -55, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: CUE.lampsDuration,
          ease: EASE.settle,
          stagger: CUE.lampsStagger,
        },
        CUE.lamps,
      );

      tl.fromTo(
        q("[data-reveal]"),
        { y: -26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: CUE.textDuration,
          ease: EASE.settle,
          stagger: CUE.textStagger,
        },
        CUE.text,
      );

      tl.fromTo(
        q("[data-couple]"),
        { yPercent: 22, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: CUE.coupleDuration,
          ease: EASE.settle,
        },
        CUE.couple,
      );

      /* ---- and the lamps never quite settle ---- */
      tl.call(
        () => {
          if (lamps.length === 2) startLampDrift(lamps[0], lamps[1]);
        },
        undefined,
        CUE.float,
      );
    },
    { scope: root },
  );

  return (
    <div className="page" ref={root}>
      <Hero />
      <Loader />
    </div>
  );
}
