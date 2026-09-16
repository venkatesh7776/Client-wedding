# Sahla Abdulla & Abdul Basith T.A — wedding invitation

Next.js 15 (App Router, TypeScript) + GSAP. One page, one master timeline.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

```
app/
  layout.tsx        fonts, metadata, image preloads
  page.tsx
  globals.css       every value lifted from Figma; layout model documented at the top
components/
  Invitation.tsx    "use client" — the master GSAP timeline
  Loader.tsx        Figma node 73:217
  Hero.tsx          Figma node 73:309
lib/
  assets.ts         asset paths, with the Figma name for each
  copy.ts           verbatim text — do not reword
  timeline.ts       CUE sheet + the lamp drift
  useStageScale.ts  fits the 1440x780 artboard to the viewport
public/assets/      the exported Figma files, unmodified
design/             DESIGN_SPEC.md, tokens.css, tokens.json
```

## The timeline

All positions are absolute seconds on one `gsap.timeline()`, and all of them
live in `CUE` in [lib/timeline.ts](lib/timeline.ts) — re-time the whole
sequence there without touching a tween.

| t | what |
|---|---|
| 0.0 → 2.8 | Loader Ring sweeps 360° clockwise, linear |
| 2.6 → 3.6 | Loader dissolves outward (opacity + scale 1.06) |
| 2.6 → 4.7 | **Hero 25%** — the palace opens out of the ring's own footprint (`clip-path: circle()` 15% → 105%) while the background eases from scale 1.14 → 1 |
| 3.6 → 5.6 | **Hero 50%** — Pillar 1 in from the left, Pillar 2 from the right, simultaneous and symmetric |
| 5.0 → 6.7 | Lamp 1 then Lamp 2 descend from above (0.22s apart) |
| 5.3 → 7.06 | names settle down from above, line by line |
| 5.5 → 7.0 | **Hero 100%** — the couple rises into the courtyard |
| 7.1 → ∞ | the lamps start to drift |

From the pillars onward the moves deliberately **overlap** rather than queue —
the arch is still settling as the lamps begin — so the scene never stops and
restarts.

### Easing

Easing, not duration, is what makes a move read as fast. An `out` curve leaves
at full speed and spends its tail decelerating, so it looks abrupt however long
it runs. The three curves live in `EASE` in [lib/timeline.ts](lib/timeline.ts):

| | curve | why |
|---|---|---|
| `architecture` | `power2.inOut` | the pillars are stone: they gather speed and shed it, never starting at full tilt |
| `reveal` | `power2.inOut` | the palace opening out of the ring |
| `settle` | `power2.out` | anything descending or rising into its final place |

Hero 25 / 50 / 100 are **not** separate components. They are states this one
DOM tree passes through, which is why it reads as a single continuous shot
rather than three screens being swapped.

### Lamp drift

Each lamp carries two independent motions:

- **sway** — `x` and `rotation` together, because a lamp that swings right also
  tilts right. Slow: a full pass takes six or seven seconds.
- **bob** — a shallower rise and fall on a shorter, unrelated period.

| | sway (x / rotation) | bob (y) |
|---|---|---|
| Lamp 1 | ±6px / ±1.4° over 6.1s | ±4px over 3.5s |
| Lamp 2 | ±5px / ∓1.6° over 6.9s, +0.6s delay | ±3px over 4.0s |

Each starts with a half-length lead-in so the lamp eases out of rest rather
than snapping to one end of its arc. The two periods never line up and the
second lamp is offset again, so nothing ticks in unison — it reads as air
moving rather than as a loop. Both pivot from `transform-origin: 50% 0%`, so
they swing from their chain rather than their middle.

## Layout

The Figma artboard is a fixed 1440×780. Above 860px the composition lives in
`.hero__stage`, a 1440×780 coordinate space scaled by `--s = min(vw/1440,
vh/780)` and anchored to the **bottom**, so:

- the couple always stands on the palace ground, never floats or crops
- spare height spills into the sky at the top, where there is nothing to lose
- nothing is ever cropped, because the fit is contain, not cover

The background and both pillars sit *outside* that stage, pinned to the
viewport, so the arch stays flush with the screen edges at any aspect ratio
(`--pillar-offset`, computed in `useStageScale`).

Below 860px the stage drops its scale transform and the same elements are
re-placed in viewport units — at phone width the scaled artboard would be
390×211, which is unreadable. Composition, order and hierarchy are unchanged;
only the spacing adapts. **GSAP only ever touches transforms**, so every
animation works identically in both layouts.

## Notes

- Only `transform`, `opacity` and one `clip-path` are animated. No filters, no
  blur tweens, no canvas, no particles.
- `prefers-reduced-motion: reduce` lands straight on the finished composition
  with no motion at all, lamp drift included.
- The Arabic is set in Arbutus (Bismillah) and Instrument Serif (loader verse)
  per Figma, but neither font ships Arabic glyphs — Figma is falling back
  silently. **Amiri** is stacked behind both so the Arabic renders the same on
  every machine instead of landing on whatever the OS supplies. This is the one
  place the code is deliberately more specified than the Figma file.
