import gsap from "gsap";

import { reducedMotion } from "./reveal";

/**
 * One lantern's path through the page.
 *
 * Nothing here is keyed to a section. The whole document is the timeline, so a
 * lantern crosses a section boundary without noticing it — it simply keeps
 * drifting, and where it happens to be when the celebrations arrive is wherever
 * the scroll has carried it.
 */
export type Drift = {
  /** which edge it hangs near */
  side: "left" | "right";
  /** fractions of the viewport height it drifts between over the whole page */
  from: number;
  to: number;
  /** px from its edge at its furthest out, and how far it wanders inward */
  inset: number;
  wander: number;
  /** how many times it wanders in and out across the page, and where it starts */
  waves: number;
  phase: number;
  /** the pendulum: degrees, px, px, and seconds for one swing */
  tilt: number;
  sway: number;
  bob: number;
  period: number;
  /** so no two lanterns share a beat */
  delay: number;
};

/*
 * Three lanterns. The two on the left run parallel — a constant gap apart, so
 * they can never drift into one another — and the third has the right edge to
 * itself. Each one is a different size, speed and path, so the three never
 * read as one drawing repeated.
 */
export const DRIFTS: Drift[] = [
  {
    side: "left",
    from: 0.04, to: 0.4,
    inset: 3, wander: 11,
    waves: 1.5, phase: 0,
    tilt: 1.4, sway: 5, bob: 5, period: 6.6, delay: 0,
  },
  {
    side: "right",
    from: 0.24, to: 0.72,
    inset: 2, wander: 14,
    waves: 2.5, phase: 0.35,
    tilt: -1.7, sway: -4, bob: 4, period: 7.9, delay: 1.3,
  },
  {
    side: "left",
    from: 0.56, to: 0.92,
    inset: 6, wander: 9,
    waves: 2, phase: 0.6,
    tilt: 1.1, sway: 3.5, bob: 3, period: 9.1, delay: 2.4,
  },
];

const TAU = Math.PI * 2;

/*
 * What a lantern gets out of the way of. Not a list of sections — a list of the
 * things a guest came to read, wherever on the page they turn up. The only one
 * that ever reaches the margins is a celebrations card on its way past, and
 * this is why the lantern in front of it quietly steps back.
 */
const SOLID =
  ".event,[data-venue],[data-assist-card],[data-arch],[data-countdown]," +
  "a,button,h1,h2,h3,img";

/** how far a lantern fades when something is underneath it */
const YIELD = 0.06;

/** px of warning it gives itself, so the fade starts before the contact does */
const REACH = 14;

/* A paragraph's box is far wider than the words in it, and on a phone almost
   every box reaches the edge of the screen. So for anything made of text we
   ask the harder question — is there a letter at this exact point? — and let
   the lantern hang happily over the empty half of a centred line. */
const TEXTY = new Set(["P", "H1", "H2", "H3", "LI", "DT", "DD", "A", "SPAN"]);
const PAD = 2;

function inked(el: Element, x: number, y: number, range: Range) {
  if (!TEXTY.has(el.tagName)) return true;
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Hangs the lanterns in the page and keeps them moving.
 *
 * Three things move each one and none of them fight, because each owns its own
 * element: the outer box is carried by the scroll, the inner box swings on its
 * chain, and the flame inside breathes. Only the first is tied to the scroll,
 * so the swinging carries on while the page is still.
 */
export function floatLanterns(layer: HTMLElement | null) {
  const lanterns = layer ? Array.from(layer.querySelectorAll<HTMLElement>("[data-lantern]")) : [];
  if (!lanterns.length) return;

  const move = lanterns.map((el) => ({
    x: gsap.quickSetter(el, "x", "px") as (v: number) => void,
    y: gsap.quickSetter(el, "y", "px") as (v: number) => void,
  }));

  /** where every lantern sits at a given point in the page, 0 → 1 */
  const place = (p: number) => {
    const h = window.innerHeight;
    // a phone has almost no margin, so the whole lane narrows rather than the
    // lanterns wandering into the column
    const lane = window.innerWidth <= 860 ? 0.3 : 1;
    lanterns.forEach((_, i) => {
      const d = DRIFTS[i % DRIFTS.length];
      // out and back in, never past its own lane
      const inward = (Math.sin((p * d.waves + d.phase) * TAU) * 0.5 + 0.5) * d.wander;
      move[i].x((d.inset + inward) * lane * (d.side === "left" ? 1 : -1));
      move[i].y((d.from + (d.to - d.from) * p) * h);
    });
  };

  place(0);
  if (reducedMotion()) return;

  /*
   * The driver is the page's own scroll position — no trigger element, no
   * section, nothing for a lantern to restart at. The reading is then eased on
   * every frame rather than snapped to the scroll, which gives the drift its
   * weight and keeps it settling for a moment after the page has stopped.
   */
  let eased = 0;

  /* is anything a guest came to read sitting under this lantern right now? */
  const range = document.createRange();
  const occupied = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return false;
    // sampled a little wider than the lantern, so it has begun stepping back
    // before whatever is coming actually reaches it; and only across the part
    // of it that is on screen, since on a phone much of it hangs off the edge
    const left = Math.max(r.left - REACH, 1);
    const right = Math.min(r.right + REACH, window.innerWidth - 1);
    if (right <= left) return false;
    for (const fx of [0.5, 0.08, 0.92]) {
      const x = left + (right - left) * fx;
      for (const fy of [0.3, 0.62, 0.92]) {
        const y = r.top - REACH + (r.height + REACH * 2) * fy;
        if (y < 0 || y > window.innerHeight) continue;
        const under = document.elementsFromPoint(x, y);
        if (under.some((e) => e.matches?.(SOLID) && inked(e, x, y, range))) return true;
      }
    }
    return false;
  };

  const fade = lanterns.map(() => 1);
  let frame = 0;

  const glide = () => {
    const room = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const target = Math.min(1, Math.max(0, window.scrollY / room));
    eased += (target - eased) * 0.045;
    place(eased);

    // the check costs a hit test, so it runs on every third frame; the fade
    // itself is eased on all of them, which is what keeps it from blinking
    const look = frame++ % 2 === 0;
    lanterns.forEach((el, i) => {
      if (look) el.dataset.yield = occupied(el) ? "1" : "";
      const want = el.dataset.yield ? YIELD : 1;
      // steps back briskly, returns at its own pace — the way a light dips
      fade[i] += (want - fade[i]) * (want < fade[i] ? 0.3 : 0.04);
      el.style.opacity = `${fade[i]}`;
    });
  };
  gsap.ticker.add(glide);

  const swings = lanterns.flatMap((el, i) => {
    const d = DRIFTS[i % DRIFTS.length];
    const hang = el.querySelector<HTMLElement>("[data-lantern-hang]");
    const glow = el.querySelector<HTMLElement>("[data-lantern-glow]");
    if (!hang) return [];

    /* a pendulum whose three parts run at different periods, so the swing
       never quite comes back round to where it started */
    const pendulum = (from: gsap.TweenVars, to: gsap.TweenVars, period: number) =>
      gsap.fromTo(hang, from, {
        ...to,
        duration: period,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: d.delay,
      });

    const parts = [
      pendulum({ rotation: -d.tilt }, { rotation: d.tilt }, d.period),
      pendulum({ x: -d.sway }, { x: d.sway }, d.period * 1.31),
      pendulum({ y: -d.bob }, { y: d.bob }, d.period * 0.79),
    ];

    if (glow) {
      parts.push(
        gsap.to(glow, {
          opacity: () => gsap.utils.random(0.45, 0.95),
          scale: () => gsap.utils.random(0.92, 1.08),
          duration: () => gsap.utils.random(1.2, 2.8),
          ease: "sine.inOut",
          repeat: -1,
          repeatRefresh: true,
          delay: d.delay,
        }),
      );
    }
    return parts;
  });

  return () => {
    gsap.ticker.remove(glide);
    swings.forEach((t) => t.kill());
  };
}
