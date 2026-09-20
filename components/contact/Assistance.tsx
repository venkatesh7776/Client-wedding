"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSIST_COPY, CONTACTS } from "@/lib/contacts";

import { EASE, EASE_LINE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Ornament, Star } from "../meet/Ornament";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** A handset, drawn to match the other line icons on the site. */
function PhoneIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden
      fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.2 3.6 5.6 3a2 2 0 0 0-2.3 1.3l-.5 1.5a2 2 0 0 0 .2 1.7 22 22 0 0 0 9.8 9.8 2 2 0 0 0 1.7.2l1.5-.5A2 2 0 0 0 21 14.7l-.6-2.6a1.6 1.6 0 0 0-1.6-1.2h-2a1.6 1.6 0 0 0-1.5 1.1l-.2.7a14 14 0 0 1-4-4l.7-.2A1.6 1.6 0 0 0 13 6.8v-2a1.6 1.6 0 0 0-1.2-1.6Z" />
    </svg>
  );
}

/**
 * Section 8 — the people to call.
 *
 * Set as two engraved plaques rather than contact cards: the name cut into the
 * stone, the relationship beneath it in gold, and the number itself the one
 * thing you can act on — a tel: link, so a guest on a phone just taps it.
 */
export function Assistance() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const head = q("[data-assist-head] > *:not([data-ornament])");
      gsap.set(head, { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });
      gsap.set(q("[data-assist-card]"), { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-assist-spine]"), { opacity: 0, scaleY: 0.4 });

      onEnter(q("[data-assist-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.7 }, 0.6);

      onEnter(q("[data-assist-pair]")[0], "top 84%")
        .to(q("[data-assist-card]"), {
          opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE, stagger: 0.18,
        }, 0)
        .to(q("[data-assist-spine]"), { opacity: 1, scaleY: 1, duration: REVEAL.line, ease: EASE_LINE }, 0.15);
    },
    { scope: root },
  );

  return (
    <section className="assist" ref={root} aria-labelledby="assist-title">
      <div className="assist__backdrop" aria-hidden />

      <header className="assist__head" data-assist-head>
        <h2 className="assist__title" id="assist-title">
          {ASSIST_COPY.title}
        </h2>
        <p className="assist__subtitle">{ASSIST_COPY.subtitle}</p>
        <Ornament className="assist__ornament" />
      </header>

      <div className="assist__pair" data-assist-pair>
        <span className="assist__spine" aria-hidden data-assist-spine>
          <span className="assist__spineLine" />
          <span className="assist__spineStar">
            <Star size={13} />
          </span>
          <span className="assist__spineLine" />
        </span>

        {CONTACTS.map((c) => (
          <article className="assist__card" key={c.name} data-assist-card>
            <p className="assist__role">{c.role}</p>
            <h3 className="assist__name">{c.name}</h3>

            {c.tel && c.display ? (
              <a className="assist__call" href={`tel:${c.tel}`}>
                <PhoneIcon />
                {c.display}
              </a>
            ) : (
              <span className="assist__call assist__call--pending" aria-disabled="true">
                <PhoneIcon />
                {ASSIST_COPY.pending}
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
