"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CELEBRATIONS, CELEBRATION_COPY } from "@/lib/celebrations";
import { EASE, EASE_LINE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Crescent, Ornament, Star } from "../meet/Ornament";
import { EventCard } from "./EventCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// a phone's address bar sliding away is not a layout change worth re-pinning for
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Section 3 — The Wedding Celebrations.
 *
 * Three cards of one shape on a rail. On a wide screen the section pins and
 * the row travels sideways as you scroll down; on a phone the same row is
 * swiped by hand, with the next card peeking in so the gesture explains
 * itself — no arrows, no dots.
 */
export function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const head = q("[data-celebrate-head] > *:not([data-ornament])");
      const cards = q(".rail__item"); // the card and the gem beside it, together
      const closing = q("[data-closing] > *");

      gsap.set([head, cards, closing], { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });

      onEnter(q("[data-celebrate-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(q("[data-celebrate-head] [data-ornament-rule]"), {
          opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE,
        }, 0.35)
        .to(q("[data-celebrate-head] [data-ornament-star]"), { opacity: 1, duration: 0.7 }, 0.6);

      gsap.set(q("[data-rail-line]"), { opacity: 0, scaleX: 0, transformOrigin: "left center" });

      onEnter(q("[data-rail]")[0], "top 82%")
        .to(q("[data-rail-line]"), { opacity: 1, scaleX: 1, duration: 1.5, ease: EASE_LINE }, 0)
        .to(cards, { opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE, stagger: REVEAL.stagger }, 0.1);

      /*
       * On every screen the section holds still while the row travels sideways,
       * so scrolling down walks through the celebrations one at a time.
       *
       * The travel is real scrolling, not a transform on the track. That way
       * the row stays reachable by hand — by thumb, by trackpad, by keyboard,
       * and when a guest has "reduce motion" on and this never runs at all.
       */
      let unpin: (() => void) | undefined;

      const walkTheRail = () => {
        const stage = q("[data-stage]")[0] as HTMLElement | undefined;
        const track = q("[data-track]")[0] as HTMLElement | undefined;
        if (!stage || !track) return;

        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

        // on a screen wide enough to hold the whole row, there is nothing to
        // travel — leave the section unpinned rather than holding it still
        if (distance() < 24) return;

        // the timeline owns the sideways travel now: no snapping to fight the
        // scrub, and a sideways finger should not wrestle it either
        track.classList.add("rail__track--driven");

        const reader = { x: 0 };
        const tween = gsap.fromTo(
          reader,
          { x: 0 },
          {
            x: () => distance(),
            ease: "none",
            immediateRender: false,
            onUpdate: () => {
              track.scrollLeft = reader.x;
            },
            scrollTrigger: {
              trigger: stage,
              // centred when it fits, top-aligned when it is taller than the
              // screen, so the title is never the part that gets cut off
              start: () =>
                stage.offsetHeight > window.innerHeight * 0.94 ? "top top" : "center center",
              // a short beat once the row has arrived, then the section releases
              end: () => `+=${distance() + window.innerHeight * 0.2}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          },
        );

        unpin = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          track.classList.remove("rail__track--driven");
          track.scrollLeft = 0;
        };
      };

      walkTheRail();

      onEnter(q("[data-closing]")[0], "top 85%")
        .to(closing, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: 0.18 }, 0);

      return () => unpin?.();
    },
    { scope: root },
  );

  return (
    <section className="celebrate" ref={root} aria-labelledby="celebrate-title">
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

      {/* heading and rail are pinned together, so the title stays over the
          cards the whole way along instead of sliding off the top */}
      <div className="celebrate__stage" data-stage>
        <header className="celebrate__head" data-celebrate-head>
          <h2 className="celebrate__title" id="celebrate-title">
            {CELEBRATION_COPY.title}
          </h2>
          <p className="celebrate__lede">{CELEBRATION_COPY.lede}</p>
          <Ornament className="celebrate__ornament" />
        </header>

        {/* the rail: one row, scrolled by hand on any screen */}
        <div className="rail" data-rail>
          {/* the thread the celebrations are strung on: it runs the width of
              the rail and shows only in the gaps, since the cards are opaque */}
          <span className="rail__line" aria-hidden data-rail-line />

          <div className="rail__track" role="list" data-track>
            {CELEBRATIONS.map((c) => (
              <div className="rail__item" role="listitem" key={c.index}>
                <EventCard event={c} />
              </div>
            ))}
            {/* trailing gutter: padding alone is not counted in scrollWidth */}
            <span className="rail__pad" aria-hidden />
          </div>
        </div>
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
