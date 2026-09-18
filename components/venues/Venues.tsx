"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { VENUES, VENUE_COPY } from "@/lib/venues";

import { Ornament } from "../meet/Ornament";
import { VENUE_ARCH } from "./arch";
import { Countdown } from "./Countdown";
import { VenueCard } from "./VenueCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * `toggleActions: "play none none none"` rather than `once: true`: a trigger
 * that kills itself during ScrollTrigger's first refresh mutates the list it
 * is being iterated over, which throws if the page is reloaded already
 * scrolled into the section. These play once and simply stay alive.
 */
const PLAY_ONCE = "play none none none";

const EASE = "power2.out";

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
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const head = q("[data-venues-head] > *:not([data-ornament])");
      const rules = q("[data-ornament-rule]");
      const stars = q("[data-ornament-star]");

      gsap.set(q("[data-venues-bg]"), { opacity: 0 });
      gsap.set(head, { opacity: 0, y: 26 });
      gsap.set(rules, { opacity: 0, scaleX: 0 });
      gsap.set(stars, { opacity: 0 });
      gsap.set(q("[data-venue]"), { opacity: 0, y: 34 });
      gsap.set(q("[data-venue-divider]"), { opacity: 0, scaleX: 0.4 });
      gsap.set(q("[data-venue-cta]"), { opacity: 0, y: 12 });
      gsap.set(q("[data-countdown]"), { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: PLAY_ONCE },
      });

      tl.to(q("[data-venues-bg]"), { opacity: 1, duration: 1.4, ease: "power1.out" }, 0)
        .to(head, { opacity: 1, y: 0, duration: 1.0, ease: EASE, stagger: 0.14 }, 0.15)
        .to(rules, { opacity: 1, scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.45)
        .to(stars, { opacity: 1, duration: 0.65, ease: EASE }, 0.65)
        // both cards and everything on them arrive together, not in sequence
        .to(q("[data-venue]"), { opacity: 1, y: 0, duration: 1.05, ease: EASE }, 0.45)
        .to(q("[data-venue-divider]"), {
          opacity: 1, scaleX: 1, duration: 0.9, ease: "power2.inOut",
        }, 0.45)
        .to(q("[data-venue-cta]"), { opacity: 1, y: 0, duration: 0.9, ease: EASE }, 0.45)
        .to(q("[data-countdown]"), { opacity: 1, y: 0, duration: 1.0, ease: EASE }, 0.8);
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
        <img className="venues__bgImg" src={ASSETS.venueBackground} alt="" />
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

      <Countdown />
    </section>
  );
}
