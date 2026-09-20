"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { SPARKS, driftSparkles } from "@/lib/sparkles";

gsap.registerPlugin(useGSAP);

/**
 * The sparks that carry across the whole invitation.
 *
 * One fixed layer for the entire page, like the lanterns — they are in the
 * room, not in the furniture. They travel up the screen as the page is
 * scrolled down, never restarting at a section edge, and they keep shining
 * when the page is still.
 *
 * They sit above the sections and below the lanterns, and take no clicks.
 */
export function Sparkles() {
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(() => driftSparkles(layer.current), { scope: layer });

  return (
    <div className="sparks" ref={layer} aria-hidden>
      {SPARKS.map((s, i) => (
        <div
          className="spark"
          key={i}
          data-spark
          style={
            {
              left: `${s.x * 100}%`,
              "--spark-size": `${s.size}px`,
            } as React.CSSProperties
          }
        >
          <span className="spark__point" />
        </div>
      ))}
    </div>
  );
}
