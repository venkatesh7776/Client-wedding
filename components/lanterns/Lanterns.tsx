"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { DRIFTS, floatLanterns } from "@/lib/lanterns";

import { LanternArt } from "./LanternArt";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SHAPES = ["full", "slim", "full"] as const;

/**
 * The lanterns that hang over the whole invitation.
 *
 * One fixed layer for the entire page rather than a set of decorations inside
 * each section: the lanterns are in the room, not in the furniture. They drift
 * with the scroll from the first screen to the last, never restarting at a
 * section edge, and they keep swinging when the page is still.
 *
 * They stay in the margins either side of the text column, and take no clicks.
 */
export function Lanterns() {
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(() => floatLanterns(layer.current), { scope: layer });

  return (
    <div className="lanterns" ref={layer} aria-hidden>
      {DRIFTS.map((d, i) => (
        <div
          className={`lantern lantern--${i + 1} lantern--${d.side}`}
          key={i}
          data-lantern
        >
          <div className="lantern__hang" data-lantern-hang>
            <LanternArt shape={SHAPES[i]} />
          </div>
        </div>
      ))}
    </div>
  );
}
