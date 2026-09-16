"use client";

import { useEffect, type RefObject } from "react";

/** The Figma artboard these coordinates come from. */
export const STAGE_WIDTH = 1440;
export const STAGE_HEIGHT = 780;

/** Below this width the stage drops out of scaled mode — see globals.css. */
const MOBILE_QUERY = "(max-width: 860px)";

/**
 * Fits the 1440x780 Figma coordinate space inside the viewport without ever
 * cropping it (contain), and works out how far the pillars have to sit outside
 * the stage so the arch stays flush with the screen edges.
 *
 * Writes `--s`, the stage scale, onto `ref`. Pillar 1 / Pillar 2 are pinned to
 * the viewport edges in CSS and scale off the same value.
 */
export function useStageScale(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mobile = window.matchMedia(MOBILE_QUERY);

    const apply = () => {
      if (mobile.matches) {
        el.style.removeProperty("--s");
        return;
      }

      const vw = el.clientWidth;
      const vh = el.clientHeight;
      if (!vw || !vh) return;

      el.style.setProperty("--s", String(Math.min(vw / STAGE_WIDTH, vh / STAGE_HEIGHT)));
    };

    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(el);
    mobile.addEventListener("change", apply);

    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", apply);
    };
  }, [ref]);
}
