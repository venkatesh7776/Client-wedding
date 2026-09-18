"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { RSVP_COPY, RSVP_FALLBACK, RSVP_URL } from "@/lib/rsvp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLAY_ONCE = "play none none none";
const EASE = "power2.out";

/**
 * Section 6 — the invitation itself.
 *
 * The watercolour mosque stands alone on the ivory, and everything below it is
 * the invitation: who, what, where, and the one thing to do.
 */
export function Rsvp() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const lines = q("[data-rsvp-line]");
      gsap.set(q("[data-rsvp-scene]"), { opacity: 0, y: 18 });
      gsap.set(lines, { opacity: 0, y: 22 });
      gsap.set(q("[data-rsvp-bar]"), { opacity: 0, y: 24 });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%", toggleActions: PLAY_ONCE },
        })
        .to(q("[data-rsvp-scene]"), { opacity: 1, y: 0, duration: 0.9, ease: EASE }, 0)
        .to(lines, { opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.1 }, 0.25)
        .to(q("[data-rsvp-bar]"), { opacity: 1, y: 0, duration: 0.65, ease: EASE }, 0.55);
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

      <div className="rsvp__bar" data-rsvp-bar>
        <div className="rsvp__details">
          <p className="rsvp__occasion">{RSVP_COPY.occasion}</p>
          <p className="rsvp__meta">
            <span>{RSVP_COPY.date}</span>
            <span className="rsvp__dot" aria-hidden>
              ·
            </span>
            <span>{RSVP_COPY.venue}</span>
          </p>
        </div>

        <a
          className="rsvp__cta"
          href={RSVP_URL ?? RSVP_FALLBACK}
          {...(RSVP_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {RSVP_COPY.cta}
        </a>
      </div>

    </section>
  );
}
