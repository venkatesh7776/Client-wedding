# Wedding — Design Reference

Pulled from Figma: `Wedding` → **Page 4** (node `73:189`), file key `ZE7F5kVcpd8jVrCcqDINGX`.

Four frames, all 1440px wide:

| Frame | Node | Size | Contents |
|---|---|---|---|
| Loader | `73:217` | 1440×816 | Dark navy photo backdrop, circular portrait with a spinning arc, Arabic verse |
| Hero – 25% | `73:190` | 1440×780 | Background only (scroll state 1) |
| Hero – 50% | `73:251` | 1440×780 | Background + both pillars in (scroll state 2) |
| Hero – 100% | `73:309` | 1440×780 | Full composition (scroll state 3) |

The three Hero frames are keyframes of one scroll-driven reveal, not separate screens.

---

## Color

| Token | Hex | Where |
|---|---|---|
| `--color-ink` | `#274968` | Every piece of hero copy + both meta icons |
| `--color-ink-shadow` | `#8ec1eb` | `1.5px 1.5px 0` shadow behind the two names |
| `--color-sky-top` | `#d8e9f8` | Gradient overlay, stop at 33.269% |
| `--color-sky-bottom` | `#c2d6e8` @ alpha 0 | Gradient overlay, bottom stop |
| `--color-surface` | `#ffffff` | Frame background |
| `--color-on-dark` | `#ffffff` | Loader verse |
| `--color-loader-ring` | `#7f7f7f` | 4.321px ring on the loader portrait |

Overlay: `linear-gradient(to bottom, #d8e9f8 33.269%, rgba(194,214,232,0) 100%)` sits on top of `hero-background.png`.

> The file has **no Figma Variables** — `get_variable_defs` returns `{}`. Everything above is a raw style, so `design/tokens.css` is now the single source of truth.

---

## Typography

Three families, all available on Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Arbutus&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

| Role | Family / style | Size | Line height | Tracking | Extras |
|---|---|---|---|---|---|
| Names | Instrument Serif Italic | 68px | 58px | 0.68px | text-shadow `1.5px 1.5px 0 #8ec1eb` |
| Loader verse | Instrument Serif Italic | 53.31px | normal | 0.5331px | white |
| `&` | Instrument Serif Italic | 49px | normal | 0.49px | flanked by 155px / 171px rules, 17px gaps |
| Bismillah | Arbutus Regular | 24px | 72px | — | `font-variation-settings: "wdth" 100` |
| Date / location | Bricolage Grotesque Regular | 20px | normal | — | `font-variation-settings: "opsz" 14, "wdth" 100` |

**Caveat worth flagging:** the two Arabic lines are set in **Arbutus** and **Instrument Serif**, neither of which has Arabic glyphs. In Figma they render through a fallback. In the browser you'll want a real Arabic face (e.g. *Amiri*, *Noto Naskh Arabic*, *Scheherazade New*) or the Arabic will land on whatever the OS picks and look different per machine. `--font-arabic` in `tokens.css` already stacks `Noto Naskh Arabic` behind Arbutus as a stopgap.

---

## Assets

Downloaded to `assets/` (exact Figma bytes, not redrawn):

**`assets/images/`**
| File | Natural size | Used as |
|---|---|---|
| `hero-background.png` | 1704×923 | Hero backdrop (`object-fit: cover`, under the sky gradient) |
| `couple.png` | 1374×1145 | Hero couple, cropped into a 371×347 box at `left:535 top:433` |
| `lamp.png` | 887×1774 | Both hanging lamps, 162×325, at `x:226` and `x:1052`, `top:18` |
| `pillar.png` | 1024×555 | Both side pillars, 428×780; right one is the same file rotated 180° + flipped Y |
| `loader-background.png` | 1264×711 | Loader backdrop, full 1440×816 |
| `loader-couple.png` | 840×840 | Loader portrait inside the 363px circle |

**`assets/icons/`**
| File | Size | Used as |
|---|---|---|
| `icon-date.svg` | 24×24 | `hugeicons:date-time`, before "November 2026" |
| `icon-location.svg` | 24×24 | `codicon:location`, before "Kozhikode, Kerala" |
| `divider-left.svg` | 155×0 | Rule left of the `&` |
| `divider-right.svg` | 171×0 | Rule right of the `&` |
| `loader-ring-arc.svg` | — | The arc that sweeps around the loader portrait |

Hero-50% reuses `hero-background.png` and `pillar.png` — no extra files needed for the intermediate states.

---

## Content

- Bismillah: `بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ`
- Loader verse: `وَخَلَقْنَاكُمْ أَزْوَاجًا`
- Names: **Sahla Abdulla** & **Abdul Basith T.A**
- Date: November 2026 · Venue: Kozhikode, Kerala
