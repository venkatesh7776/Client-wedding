"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { DRESS_COPY, DRESS_NOTES } from "@/lib/dresscode";

import { Ornament } from "../meet/Ornament";
import { ArchIcon, GarmentIcon, LanternIcon } from "./DressIcons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLAY_ONCE = "play none none none";
const EASE = "power2.out";

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
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const head = q("[data-dress-head] > *:not([data-ornament])");
      const notes = q("[data-dress-note]");

      gsap.set([head, notes], { opacity: 0, y: 22 });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%", toggleActions: PLAY_ONCE },
        })
        .to(head, { opacity: 1, y: 0, duration: 1.0, ease: EASE, stagger: 0.14 }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.65 }, 0.6)
        .to(notes, { opacity: 1, y: 0, duration: 0.95, ease: EASE, stagger: 0.16 }, 0.55);
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

      <ul className="dress__notes">
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
