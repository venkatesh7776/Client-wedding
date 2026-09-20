import { ASSETS } from "./assets";
import { VENUES } from "./venues";

/**
 * Every picture on the page. The loader holds until these are decoded, so a
 * guest never scrolls into a section that is still assembling itself — the
 * whole point of having a loading screen at all.
 */
export function imageUrls(): string[] {
  const fromAssets = Object.values(ASSETS).filter((v) => /\.(png|jpe?g|webp|avif)$/i.test(v));
  const venues = VENUES.map((v) => v.art);
  return Array.from(new Set([...fromAssets, ...venues]));
}

/**
 * Resolves when every image has loaded, failed, or the deadline passes —
 * whichever comes first. A slow or missing file delays the opening by at most
 * `timeout`; it can never strand the visitor on the loading screen.
 */
export function preloadImages(timeout = 7000): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const each = imageUrls().map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
        // already in cache
        if (img.complete) resolve();
      }),
  );

  return Promise.race([
    Promise.all(each).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeout)),
  ]);
}
