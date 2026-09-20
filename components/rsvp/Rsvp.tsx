"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { EASE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";
import { RSVP_COPY, RSVP_URL } from "@/lib/rsvp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Section 6 — the invitation itself.
 *
 * The watercolour mosque stands alone on the ivory, and everything below it is
 * the invitation: who it is from, and the one thing to do.
 */
export function Rsvp() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const lines = q("[data-rsvp-line]");
      gsap.set(q("[data-rsvp-scene]"), { opacity: 0, y: 18 });
      gsap.set(lines, { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-rsvp-bar]"), { opacity: 0, y: REVEAL.rise });

      onEnter(q("[data-rsvp-scene]")[0], "top 82%")
        .to(q("[data-rsvp-scene]"), { opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE }, 0);

      /* the words wait for themselves, not for the scene above them */
      onEnter(lines[0], "top 86%")
        .to(lines, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0);

      /* the invitation itself lands last, once the words above it have settled */
      onEnter(q("[data-rsvp-bar]")[0], "top 90%")
        .to(q("[data-rsvp-bar]"), { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE }, 0);
    },
    { scope: root },
  );

  return (
    <section className="rsvp" ref={root} aria-labelledby="rsvp-title">
      <div className="rsvp__scene" data-rsvp-scene aria-hidden>
        <img className="rsvp__sceneImg" src={ASSETS.rsvpScene} alt="" />
      </div>

      <p className="rsvp__eyebrow" data-rsvp-line>
        {RSVP_COPY.eyebrow}
      </p>

      <h2 className="rsvp__names" id="rsvp-title" data-rsvp-line>
        {RSVP_COPY.names}
      </h2>

      <p className="rsvp__body" data-rsvp-line>
        {RSVP_COPY.body.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      <a
        className="rsvp__cta"
        href={RSVP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-rsvp-bar
      >
        {RSVP_COPY.cta}
      </a>

    </section>
  );
}
