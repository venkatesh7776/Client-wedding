"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { DRESS_COPY, DRESS_NOTES } from "@/lib/dresscode";

import { EASE, EASE_LINE, REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

import { Ornament } from "../meet/Ornament";
import { ArchIcon, GarmentIcon, LanternIcon } from "./DressIcons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ICONS = {
  garment: GarmentIcon,
  lantern: LanternIcon,
  arch: ArchIcon,
};

/**
 * Section 5 — Dress Code.
 *
 * Back into daylight after the navy of the venues: the same ivory ground,
 * khatam lattice and gold rules as Section 2, so the page closes in the
 * material it opened in. The closing line is set as three panels rather than a
 * sentence, which is the only thing here with any weight.
 */
export function DressCode() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) return;

      const head = q("[data-dress-head] > *:not([data-ornament])");
      const notes = q("[data-dress-note]");

      gsap.set([head, notes], { opacity: 0, y: REVEAL.rise });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });

      onEnter(q("[data-dress-head]")[0], "top 85%")
        .to(head, { opacity: 1, y: 0, duration: REVEAL.line, ease: EASE, stagger: REVEAL.stagger }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: REVEAL.line, ease: EASE_LINE }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.7 }, 0.6);

      /* the three notes wait for their own row rather than riding the heading */
      onEnter(q("[data-dress-notes]")[0], "top 84%")
        .to(notes, { opacity: 1, y: 0, duration: REVEAL.frame, ease: EASE, stagger: 0.18 }, 0);
    },
    { scope: root },
  );

  return (
    <section className="dress" ref={root} aria-labelledby="dress-title">
      <div className="dress__backdrop" aria-hidden>
        <div className="dress__lattice" />
      </div>

      <header className="dress__head" data-dress-head>
        <h2 className="dress__title" id="dress-title">
          {DRESS_COPY.title}
        </h2>
        <p className="dress__lede">{DRESS_COPY.lede}</p>
        <Ornament className="dress__ornament" />
        <p className="dress__body">
          {DRESS_COPY.body.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </header>

      <ul className="dress__notes" data-dress-notes>
        {DRESS_NOTES.map((note) => {
          const Icon = ICONS[note.icon];
          return (
            <li className="dress__note" key={note.label} data-dress-note>
              <span className="dress__noteFrame" aria-hidden />
              <span className="dress__noteJali" aria-hidden />
              <span className="dress__noteIcon">
                <Icon />
              </span>
              <span className="dress__noteGem" aria-hidden />
              <span className="dress__noteLabel">{note.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
