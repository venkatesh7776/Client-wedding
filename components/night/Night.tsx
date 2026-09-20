"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { REVEAL, onEnter, reducedMotion } from "@/lib/reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The night that Venues & Directions and the Countdown are both set in.
 *
 * They used to carry a backdrop each, two crops of the same artwork meeting at
 * a seam. One picture now runs behind both, so the guest scrolls down through
 * a single scene: the lattice sky over the venue cards, open water through the
 * middle, and the skyline arriving under the clock at the foot.
 *
 * The picture is fixed to this wrapper rather than to either section, which is
 * why neither may set a background of its own — see `.venues` and `.count`.
 */
export function Night({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.set(q("[data-night-bg]"), { opacity: 0 });
      onEnter(root.current ?? undefined, "top 78%")
        .to(q("[data-night-bg]"), { opacity: 1, duration: REVEAL.wash, ease: "power1.out" }, 0);
    },
    { scope: root },
  );

  return (
    <div className="night" ref={root}>
      <div className="night__bg" data-night-bg aria-hidden>
        <img
          className="night__bgImg"
          loading="lazy"
          decoding="async"
          src={ASSETS.nightBackground}
          /* the stage it was drawn for; the file is twice this in each direction */
          width={1440}
          height={1433}
          alt=""
        />
      </div>

      {children}
    </div>
  );
}
