"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CELEBRATIONS, CELEBRATION_COPY } from "@/lib/celebrations";

import { Crescent, Ornament, Star } from "../meet/Ornament";
import { EventCard } from "./EventCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * `toggleActions: "play none none none"` rather than `once: true`: a trigger
 * that kills itself during ScrollTrigger's first refresh mutates the list it
 * is being iterated over, which throws if the page is reloaded already
 * scrolled into the section. These play once and simply stay alive.
 */
const PLAY_ONCE = "play none none none";

const EASE = "power2.out";
const EASE_LINE = "power2.inOut";

export function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // no split — the covers simply are not shown
        gsap.set(q("[data-cover]"), { display: "none" });
        return;
      }

      const head = q("[data-celebrate-head] > *:not([data-ornament])");
      const rules = q("[data-ornament-rule]");
      const stars = q("[data-ornament-star]");
      const cards = q("[data-event-card]");
      const nodes = q("[data-event-node]");
      const closing = q("[data-closing] > *");

      gsap.set([head, cards, closing], { opacity: 0, y: 26 });
      gsap.set(rules, { opacity: 0, scaleX: 0 });
      gsap.set(stars, { opacity: 0 });
      gsap.set(nodes, { opacity: 0, scale: 0.4 });
      gsap.set(q("[data-spine]"), { scaleY: 0, transformOrigin: "50% 0%" });

      const enter = (trigger: Element | undefined, start = "top 80%") =>
        gsap.timeline(
          trigger
            ? { scrollTrigger: { trigger, start, toggleActions: PLAY_ONCE } }
            : {},
        );

      /* Heading */
      enter(q("[data-celebrate-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: 1.0, ease: EASE, stagger: 0.14 }, 0)
        .to(q("[data-celebrate-head] [data-ornament-rule]"), {
          opacity: 1, scaleX: 1, duration: 0.95, ease: EASE_LINE,
        }, 0.35)
        .to(q("[data-celebrate-head] [data-ornament-star]"), { opacity: 1, duration: 0.65 }, 0.6);

      /* The spine draws itself as the timeline scrolls past. */
      if (q("[data-timeline]")[0]) gsap.to(q("[data-spine]"), {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: q("[data-timeline]")[0],
          start: "top 72%",
          end: "bottom 78%",
          scrub: 0.6,
        },
      });

      /* Each celebration: its star lights, the panel settles in, then the
         cover parts down the middle to reveal it. */
      CELEBRATIONS.forEach((c) => {
        const at = (sel: string) => q(`[data-event="${c.index}"] ${sel}`);
        const card = at("[data-event-card]");
        const node = at("[data-event-node]");
        const cover = at("[data-cover]");
        const top = at("[data-cover-top]");
        const bottom = at("[data-cover-bottom]");
        const seam = at("[data-cover] .event__coverSeam");

        // the cover parts the moment the card enters — the split is the reveal
        enter(q(`[data-event="${c.index}"]`)[0], "top 82%")
          .to(node, { opacity: 1, scale: 1, duration: 0.7, ease: EASE }, 0)
          .to(card, { opacity: 1, y: 0, duration: 0.85, ease: EASE }, 0)
          .to(seam, { opacity: 0, duration: 0.4, ease: "none" }, 0)
          .to(top, { yPercent: -101, duration: 1.05, ease: EASE_LINE }, 0)
          .to(bottom, { yPercent: 101, duration: 1.05, ease: EASE_LINE }, 0)
          .set(cover, { display: "none" });
      });

      /* Closing */
      enter(q("[data-closing]")[0], "top 85%")
        .to(closing, { opacity: 1, y: 0, duration: 0.95, ease: EASE, stagger: 0.16 }, 0);
    },
    { scope: root },
  );

  return (
    <section className="celebrate" ref={root} aria-labelledby="celebrate-title">
      {/* The arch that frames every niche, defined once. */}
      <svg className="celebrate__defs" aria-hidden focusable="false">
        <defs>
          {/* the tablet's own outline */}
          <clipPath id="archCard" clipPathUnits="objectBoundingBox">
            <path d="M0,1 V0.20 C0,0.12 0.07,0.068 0.20,0.046 C0.33,0.024 0.44,0.018 0.5,0 C0.56,0.018 0.67,0.024 0.80,0.046 C0.93,0.068 1,0.12 1,0.20 V1 Z" />
          </clipPath>
          <clipPath id="archNiche" clipPathUnits="objectBoundingBox">
            <path d="M0,1 V0.42 C0,0.2 0.2,0.06 0.46,0.016 C0.48,0.012 0.49,0.006 0.5,0 C0.51,0.006 0.52,0.012 0.54,0.016 C0.8,0.06 1,0.2 1,0.42 V1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="celebrate__backdrop" aria-hidden>
        <div className="celebrate__lattice" />
      </div>

      {/* Threshold: a gold hairline with a medallion, so Section 2 ends and
          this one begins rather than the two bleeding together. */}
      <div className="celebrate__threshold" aria-hidden>
        <span className="celebrate__thresholdRule" />
        <span className="celebrate__medallion">
          <Crescent size={22} />
          <Star size={26} />
        </span>
        <span className="celebrate__thresholdRule" />
      </div>

      <header className="celebrate__head" data-celebrate-head>
        <h2 className="celebrate__title" id="celebrate-title">
          {CELEBRATION_COPY.title}
        </h2>
        <p className="celebrate__lede">{CELEBRATION_COPY.lede}</p>
        <Ornament className="celebrate__ornament" />
      </header>

      <div className="timeline" data-timeline>
        <span className="timeline__spine" aria-hidden>
          <span className="timeline__spineFill" data-spine />
        </span>

        {CELEBRATIONS.map((c, i) => (
          <EventCard key={c.index} event={c} side={i % 2 === 0 ? "left" : "right"} />
        ))}
      </div>

      <footer className="closing" data-closing>
        <span className="closing__crescent" aria-hidden>
          <Crescent size={24} />
        </span>
        <p className="closing__title">{CELEBRATION_COPY.closingTitle}</p>
        <p className="closing__line">{CELEBRATION_COPY.closingLine}</p>
        <span className="closing__star" aria-hidden>
          <Star size={14} />
        </span>
      </footer>
    </section>
  );
}
