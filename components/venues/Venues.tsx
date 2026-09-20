"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { VENUES, VENUE_COPY } from "@/lib/venues";

import { EASE, EASE_LINE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Ornament } from "../meet/Ornament";
import { VENUE_ARCH } from "./arch";
import { VenueCard } from "./VenueCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * `toggleActions: "play none none none"` rather than `once: true`: a trigger
 * that kills itself during ScrollTrigger's first refresh mutates the list it
 * is being iterated over, which throws if the page is reloaded already
 * scrolled into the section. These play once and simply stay alive.
 */

/**
 * Section 4 — Venues & Directions.
 *
 * The three sections above are daylight: ivory stone and blue sky. This one
 * steps into evening — navy with jasmine in the corners. Cream type, gold for
 * everything structural, and the artwork left visible around the panels.
 */
export function Venues() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const head = q("[data-venues-head] > *:not([data-ornament])");
      const rules = q("[data-ornament-rule]");
      const stars = q("[data-ornament-star]");

      gsap.set(q("[data-venues-bg]"), { opacity: 0 });
      gsap.set(head, { opacity: 0, y: 26 });
      gsap.set(rules, { opacity: 0, scaleX: 0 });
      gsap.set(stars, { opacity: 0 });
      gsap.set(q("[data-venue]"), { opacity: 0, y: REVEAL.rise + 8 });
      gsap.set(q("[data-venue-divider]"), { opacity: 0, scaleX: 0.4 });
      gsap.set(q("[data-venue-cta]"), { opacity: 0, y: 12 });

      /* the backdrop washes in first, behind everything */
      onEnter(root.current ?? undefined, "top 75%")
        .to(q("[data-venues-bg]"), { opacity: 1, duration: REVEAL.wash, ease: "power1.out" }, 0);

      onEnter(q("[data-venues-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(rules, { opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE }, 0.35)
        .to(stars, { opacity: 1, duration: 0.7, ease: EASE }, 0.6);

      /*
       * Each card waits for itself. Side by side they share a line, so they
       * still arrive together — stacked on a phone, the second one gets its
       * own moment instead of having played while it was still below.
       * A card and everything on it always arrive as one, never in sequence.
       */
      q("[data-venue]").forEach((card) => {
        onEnter(card, "top 84%")
          .to(card, { opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE }, 0)
          .to(card.querySelectorAll("[data-venue-divider]"), {
            opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE,
          }, 0.2)
          .to(card.querySelectorAll("[data-venue-cta]"), {
            opacity: 1, y: 0, duration: REVEAL.line, ease: EASE,
          }, 0.35);
      });
    },
    { scope: root },
  );

  return (
    <section className="venues" ref={root} aria-labelledby="venues-title">
      {/* the mihrab outline the panels are cut to */}
      <svg className="venues__defs" aria-hidden focusable="false">
        <defs>
          <clipPath id="venueArch" clipPathUnits="objectBoundingBox">
            <path d={VENUE_ARCH} />
          </clipPath>
        </defs>
      </svg>

      <div className="venues__bg" data-venues-bg aria-hidden>
        <img className="venues__bgImg" loading="lazy" decoding="async" src={ASSETS.venueBackground} alt="" />
        <span className="venues__scrim" />
      </div>

      <header className="venues__head" data-venues-head>
        <p className="venues__lede">{VENUE_COPY.lede}</p>
        <h2 className="venues__title" id="venues-title">
          {VENUE_COPY.title}
        </h2>
        <Ornament className="venues__ornament" />
      </header>

      <div className="venues__grid">
        {VENUES.map((v) => (
          <VenueCard key={v.label} venue={v} />
        ))}
      </div>

    </section>
  );
}
