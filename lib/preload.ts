import { ASSETS } from "./assets";
import { VENUES } from "./venues";

/** Every picture on the page, the first screen's and the rest alike. */
export function imageUrls(): string[] {
  const fromAssets = Object.values(ASSETS).filter((v) => /\.(png|jpe?g|webp|avif)$/i.test(v));
  const venues = VENUES.map((v) => v.art);
  return Array.from(new Set([...fromAssets, ...venues]));
}

/**
 * What the first screen actually paints — and so the only thing the loader has
 * any business waiting for. The backdrops further down the page are tens of
 * megabytes between them; holding the hand-off until those arrive left a guest
 * looking at a finished loading screen for several seconds, which is the one
 * thing a loading screen must never do.
 */
export function heroImageUrls(): string[] {
  const narrow =
    typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches;
  return [
    ASSETS.heroBackground,
    ASSETS.couple,
    ASSETS.lamp,
    narrow ? ASSETS.pillarMobile : ASSETS.pillar,
  ];
}

/** Everything below the fold. It loads behind the hero, and nothing waits on it. */
export function restImageUrls(): string[] {
  const hero = new Set(heroImageUrls());
  return imageUrls().filter((u) => !hero.has(u));
}

/**
 * Resolves when every image has loaded, failed, or the deadline passes —
 * whichever comes first. A slow or missing file delays the opening by at most
 * `timeout`; it can never strand the visitor on the loading screen.
 */
export function preloadImages(urls: string[], timeout: number): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const each = urls.map(
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

/** The loader's gate: a short list, and a short deadline to match. */
export function preloadHero(timeout = 3500): Promise<void> {
  return preloadImages(heroImageUrls(), timeout);
}

/** Started and deliberately not awaited — the page reads while these arrive. */
export function preloadRest(): void {
  if (typeof window === "undefined") return;
  void preloadImages(restImageUrls(), 60000);
}
