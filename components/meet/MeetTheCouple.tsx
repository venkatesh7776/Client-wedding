"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { BRIDE, FAMILIES, GROOM, SECTION } from "@/lib/family";

import { Crescent, Ornament, Star } from "./Ornament";
import { PersonIntro } from "./PersonIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Two columns from here up; below it the couple stacks. */
const SIDE_BY_SIDE = "(min-width: 700px)";

/*
 * Same philosophy as the hero timeline: transforms, opacity and clip-path
 * only, long `power2` curves, nothing that bounces or spins. Each block plays
 * once as it scrolls into view.
 */
const EASE = "power2.out";
const EASE_ARCH = "power2.inOut";

export function MeetTheCouple() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Hero → gallery: the photo's bottom edge dissolves as the visitor scrolls.
      gsap.to(q("[data-meet-seam]"), {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 45%", scrub: true },
      });

      const hidden = {
        backdrop: q("[data-meet-backdrop]"),
        heading: q("[data-meet-heading] > *:not([data-ornament])"),
        rules: q("[data-ornament-rule]"),
        stars: q("[data-ornament-star]"),
        arches: q("[data-arch]"),
        windows: q("[data-arch-window]"),
        info: q("[data-info-line]"),
        center: q("[data-meet-center]"),
        families: q("[data-families-head] > *:not([data-ornament]), [data-family-col]"),
      };

      gsap.set(hidden.backdrop, { opacity: 0 });
      gsap.set([hidden.heading, hidden.info, hidden.families], { opacity: 0, y: 24 });
      gsap.set(hidden.rules, { opacity: 0, scaleX: 0 });
      gsap.set(hidden.stars, { opacity: 0 });
      gsap.set(hidden.arches, { clipPath: "inset(100% 0% 0% 0%)", y: 30 });
      gsap.set(hidden.windows, { opacity: 0, scale: 1.05, transformOrigin: "50% 45%" });
      gsap.set(hidden.center, { opacity: 0, y: 16 });

      const onEnter = (trigger: Element | undefined, start = "top 78%") =>
        gsap.timeline({ scrollTrigger: { trigger, start, once: true } });

      /* 1–3: architecture, title, divider */
      const head = q("[data-meet-heading]")[0];
      onEnter(head, "top 85%")
        .to(hidden.backdrop, { opacity: 1, duration: 1.6, ease: "power1.out" }, 0)
        .to(q("[data-meet-heading] > *:not([data-ornament])"), {
          opacity: 1, y: 0, duration: 1.2, ease: EASE, stagger: 0.18,
        }, 0.3)
        .to(q("[data-meet-heading] [data-ornament-rule]"), {
          opacity: 1, scaleX: 1, duration: 1.2, ease: EASE_ARCH,
        }, 0.8)
        .to(q("[data-meet-heading] [data-ornament-star]"), { opacity: 1, duration: 0.9, ease: EASE }, 1.1);

      /* 4–10: one person's arch, photograph, then their details */
      const person = (tl: gsap.core.Timeline, side: "bride" | "groom", at: number) => {
        const s = (sel: string) => q(`[data-person="${side}"] ${sel}`);
        return tl
          .to(s("[data-arch]"), {
            clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.6, ease: EASE_ARCH,
          }, at)
          // release the clip so the finial and shadow can breathe
          .set(s("[data-arch]"), { clipPath: "none" }, at + 1.6)
          .to(s("[data-arch-window]"), { opacity: 1, scale: 1, duration: 1.4, ease: EASE }, at + 1.0)
          .to(s("[data-info-line]"), {
            opacity: 1, y: 0, duration: 1.0, ease: EASE, stagger: 0.14,
          }, at + 1.5);
      };

      const centreIn = (tl: gsap.core.Timeline, at: number) =>
        tl.to(hidden.center, { opacity: 1, y: 0, duration: 1.4, ease: EASE }, at);

      const mm = gsap.matchMedia();

      mm.add(SIDE_BY_SIDE, () => {
        // Side by side, bride and groom reveal together as a pair — arches
        // rise in unison, portraits and details follow on both sides at once,
        // and the centre ornament settles between them.
        const tl = onEnter(q("[data-meet-couple]")[0], "top 72%");
        person(tl, "bride", 0);
        person(tl, "groom", 0);
        centreIn(tl, 1.2);
      });

      mm.add("(max-width: 699px)", () => {
        // Stacked, each block reveals as it reaches the viewport.
        person(onEnter(q('[data-person="bride"]')[0], "top 80%"), "bride", 0);
        onEnter(hidden.center[0], "top 88%")
          .to(hidden.center, { opacity: 1, y: 0, duration: 1.2, ease: EASE }, 0)
          .to(q("[data-meet-center] [data-ornament-rule]"), {
            opacity: 1, scaleX: 1, duration: 1.2, ease: EASE_ARCH,
          }, 0.2)
          .to(q("[data-meet-center] [data-ornament-star]"), { opacity: 1, duration: 0.9 }, 0.6);
        person(onEnter(q('[data-person="groom"]')[0], "top 80%"), "groom", 0);
      });

      /* 11: families, gently staggered */
      onEnter(q("[data-families]")[0], "top 80%")
        .to(q("[data-families-head] > *:not([data-ornament])"), {
          opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.16,
        }, 0)
        .to(q("[data-families] [data-ornament-rule]"), {
          opacity: 1, scaleX: 1, duration: 1.1, ease: EASE_ARCH,
        }, 0.4)
        .to(q("[data-families] [data-ornament-star]"), { opacity: 1, duration: 0.8 }, 0.7)
        .to(q("[data-family-col]"), {
          opacity: 1, y: 0, duration: 1.2, ease: EASE, stagger: 0.22,
        }, 0.7);
    },
    { scope: root },
  );

  return (
    <section className="meet" ref={root} aria-labelledby="meet-title">
      <div className="meet__seam" data-meet-seam aria-hidden />
      <div className="meet__backdrop" data-meet-backdrop aria-hidden>
        <div className="meet__lattice" />
      </div>

      <header className="meet__heading" data-meet-heading>
        <h2 className="meet__title" id="meet-title">
          {SECTION.title}
        </h2>
        <p className="meet__lede">{SECTION.lede}</p>
        <Ornament className="meet__ornament" />
      </header>

      <div className="meet__couple" data-meet-couple>
        <PersonIntro person={BRIDE} side="bride" />

        <div className="meet__center" data-meet-center aria-hidden>
          <span className="meet__centerRule" />
          <span className="meet__medallion">
            <Crescent size={26} />
            <Star size={30} />
          </span>
          <span className="meet__centerRule" />
          <Ornament className="meet__centerOrnament" />
        </div>

        <PersonIntro person={GROOM} side="groom" />
      </div>

      <div className="families" data-families>
        <header className="families__head" data-families-head>
          <h3 className="families__title">{SECTION.familiesTitle}</h3>
          <Ornament className="families__ornament" />
        </header>

        <div className="families__cols">
          {FAMILIES.map((family) => (
            <div className="family" key={family.title} data-family-col>
              <h4 className="family__title">{family.title}</h4>
              <ul className="family__list">
                {family.members.map((m) => (
                  <li className="family__member" key={m.name}>
                    <span className="family__name">{m.name}</span>
                    {m.spouse && <span className="family__spouse">Spouse of {m.spouse}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
