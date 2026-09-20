"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { MESSAGE_COPY, MESSAGE_MAILTO, MESSAGE_URL } from "@/lib/messages";

import { EASE, EASE_LINE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Ornament } from "../meet/Ornament";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Section 7 — Leave a Message.
 *
 * Night falls again here: the navy skyline behind, and a single invitation to
 * write. No fields on the page — the note is composed wherever the guest
 * already writes, which is one less thing to trust with their words.
 */
export function LeaveMessage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const lines = q("[data-message-line]");
      gsap.set(lines, { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });

      onEnter(q("[data-message-inner]")[0], "top 84%")
        .to(lines, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.7 }, 0.6);
    },
    { scope: root },
  );

  return (
    <section className="message" ref={root} aria-labelledby="message-title">
      <div className="message__backdrop" aria-hidden>
        <img className="message__bgImg" loading="lazy" decoding="async" src={ASSETS.messageBackground} alt="" />
        <span className="message__scrim" />
      </div>

      <div className="message__inner" data-message-inner>
        <h2 className="message__title" id="message-title" data-message-line>
          {MESSAGE_COPY.title}
        </h2>

        <Ornament className="message__ornament" />

        <p className="message__intro" data-message-line>
          {MESSAGE_COPY.intro}
        </p>

        <a
          className="message__cta"
          href={MESSAGE_URL ?? MESSAGE_MAILTO}
          data-message-line
          {...(MESSAGE_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {MESSAGE_COPY.cta}
        </a>
      </div>
    </section>
  );
}
