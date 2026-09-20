"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { COUNTDOWN_COPY } from "@/lib/countdown";
import { EASE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Ornament } from "../meet/Ornament";
import { Timer } from "./Timer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Section 5 — Counting Down to the Sacred Union.
 *
 * The clock used to sit in the corner of the venues, after the addresses, as
 * though it were a detail of them. It is its own thought, so it gets its own
 * night: the skyline artwork that is the sibling of the venues backdrop, with
 * the words and the clock held inside it.
 *
 * Everything lives within the picture. The section is sized from the artwork's
 * own proportions rather than from its contents, so the heading, the line
 * beneath it and the clock all fall in the clear field above the domes, and
 * nothing of it spills onto the sections either side.
 */
export function Countdown() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const head = q("[data-countdown-head] > *:not([data-ornament])");

      gsap.set(head, { opacity: 0, y: 26 });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });
      gsap.set(q("[data-countdown]"), { opacity: 0, y: 20 });

      onEnter(q("[data-countdown-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: REVEAL.line }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.7, ease: EASE }, 0.6);

      onEnter(q("[data-countdown]")[0], "top 90%")
        .to(q("[data-countdown]"), { opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE }, 0);
    },
    { scope: root },
  );

  return (
    <section className="count" ref={root} aria-labelledby="count-title">
      <div className="count__inner">
        <header className="count__head" data-countdown-head>
          <h2 className="count__title" id="count-title">
            {COUNTDOWN_COPY.title}
          </h2>
          <p className="count__lede">{COUNTDOWN_COPY.lede}</p>
          <Ornament className="count__ornament" />
        </header>

        <Timer />
      </div>
    </section>
  );
}
