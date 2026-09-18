"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Hero } from "./Hero";
import { Loader } from "./Loader";
import { VERSE_VIEWBOX } from "./VerseArt";
import { preloadImages } from "@/lib/preload";
import { CUE, EASE, startLampDrift } from "@/lib/timeline";
import { useStageScale } from "@/lib/useStageScale";

gsap.registerPlugin(useGSAP);

/**
 * One master timeline carries the whole unveiling:
 *
 *   Verse settles, fills with gold -> palace fades up -> Pillar 1 + Pillar 2 close in ->
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

      const docEl = document.documentElement;
      const release = () => docEl.classList.remove("is-holding");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        release();
        gsap.set(q("[data-verse-fill]"), { attr: { width: VERSE_VIEWBOX.width } });
        // Land on the finished composition; no motion at all.
        gsap.set(q("[data-loader]"), { autoAlpha: 0, display: "none" });
        gsap.set(q("[data-hero-bg]"), { opacity: 1 });
        gsap.set([q("[data-pillar]"), lamps, q("[data-reveal]"), q("[data-couple]")], {
          opacity: 1,
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        });
        return;
      }

      // hold the page at the top until the hero has finished arriving
      docEl.classList.add("is-holding");
      window.scrollTo(0, 0);

      const tl = gsap.timeline({ defaults: { ease: EASE.settle }, onComplete: release });

      /* The loader is also cover for loading: every picture on the page is
         fetched while the verse fills, and the hand-off to the hero waits for
         them. Whichever finishes last — the verse or the images — decides. */
      let imagesReady = false;
      let waiting = false;
      const openWhenReady = () => {
        if (imagesReady && waiting) tl.resume();
      };

      preloadImages().then(() => {
        imagesReady = true;
        openWhenReady();
      });

      tl.addPause(CUE.loaderOut - 0.05, () => {
        waiting = true;
        openWhenReady();
      });

      /* ---- The verse and its translation arrive first ---- */
      tl.fromTo(
        q("[data-loader-line]"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: CUE.textInDuration,
          ease: EASE.settle,
          stagger: CUE.textInStagger,
        },
        CUE.textIn,
      );

      /* ---- Then the gold fills them, left to right: the loading itself ---- */
      tl.fromTo(
        q("[data-verse-fill]"),
        { attr: { width: 0 } },
        {
          attr: { width: VERSE_VIEWBOX.width },
          duration: CUE.verseFillDuration,
          ease: "none",
        },
        CUE.verseFill,
      );

      /* ---- The backdrop dissolves outward rather than cutting away ---- */
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

      /* ---- Hero 25%: the palace fades up behind the departing loader and
             eases out of a slow push-in. No shape wipes across the frame. ---- */
      tl.to(
        q("[data-hero-bg]"),
        { opacity: 1, duration: CUE.heroInDuration, ease: "power1.inOut" },
        CUE.heroIn,
      ).fromTo(
        q("[data-hero-image]"),
        { scale: 1.14 },
        { scale: 1, duration: CUE.heroPushDuration, ease: EASE.reveal },
        CUE.heroIn,
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

      tl.call(release, undefined, CUE.float);

      /* ---- once everything has settled, hint that the page continues ---- */
      tl.call(
        () => {
          // Only if the visitor is still at the top and hasn't touched the page.
          if (window.scrollY > 4) return;

          const nudge = gsap.timeline();
          const stop = () => {
            nudge.kill();
            events.forEach((e) => window.removeEventListener(e, stop));
          };
          const events = ["wheel", "touchstart", "keydown", "pointerdown"];
          events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }));

          const pos = { y: 0 };
          const toWindow = () => window.scrollTo(0, pos.y);
          nudge
            .to(pos, {
              y: CUE.scrollHintDistance,
              duration: 0.9,
              ease: "power2.inOut",
              onUpdate: toWindow,
            })
            .to(pos, {
              y: 0,
              duration: 0.8,
              ease: "power2.inOut",
              onUpdate: toWindow,
              delay: 0.35,
            })
            .call(stop);
        },
        undefined,
        CUE.scrollHint,
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

  useEffect(() => () => document.documentElement.classList.remove("is-holding"), []);

  return (
    <div className="page" ref={root}>
      <Hero />
      <Loader />
    </div>
  );
}
