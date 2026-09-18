"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { CLOSING_COPY } from "@/lib/closing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLAY_ONCE = "play none none none";

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
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(q("[data-closing-line]"), { opacity: 0, y: 22 });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: PLAY_ONCE },
        })
        .to(q("[data-closing-line]"), {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          stagger: 0.24,
        });
    },
    { scope: root },
  );

  return (
    <section className="farewell" ref={root} aria-label="A closing prayer">
      <div className="farewell__bg" aria-hidden>
        <img className="farewell__bgImg" src={ASSETS.footerBackground} alt="" />
        <span className="farewell__scrim" />
      </div>

      <div className="farewell__inner">
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
