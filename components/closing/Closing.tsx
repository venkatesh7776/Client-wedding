"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { CLOSING_COPY } from "@/lib/closing";
import { EASE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Section 9 — the last word.
 *
 * The terrace at sunrise fills the frame; the thanks is set small above the
 * prayer, and the prayer is the largest thing on the page's final screen.
 */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      gsap.set(q("[data-closing-line]"), { opacity: 0, y: REVEAL.rise });

      /* the last words of the page take their time */
      onEnter(q("[data-closing-inner]")[0], "top 84%").to(q("[data-closing-line]"), {
        opacity: 1,
        y: 0,
        duration: REVEAL.frame + 0.2,
        ease: EASE,
        stagger: 0.3,
      });
    },
    { scope: root },
  );

  return (
    <section className="farewell" ref={root} aria-label="A closing prayer">
      <div className="farewell__bg" aria-hidden>
        <img className="farewell__bgImg" loading="lazy" decoding="async" src={ASSETS.footerBackground} alt="" />
        <span className="farewell__scrim" />
      </div>

      <div className="farewell__inner" data-closing-inner>
        <p className="farewell__gratitude" data-closing-line>
          {CLOSING_COPY.gratitude}
        </p>

        <p className="farewell__arabic" dir="rtl" lang="ar" data-closing-line>
          {CLOSING_COPY.arabic}
        </p>
      </div>
    </section>
  );
}
