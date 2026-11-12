# FundTrustIQ — Brand & Component Guidelines (web v1)

**Where trust meets innovation.** This is the system behind the first FundTrustIQ site. The design language follows Greenlock's: a quiet off-white canvas, a refined serif for statements, a precise grotesk for everything else, lots of white space, and one large abstract "fan" motif. The palette and motif come from the FundTrustIQ logo and deck. Tokens live in `css/tokens.css`.

## 1. Logo
- Mark: three interlocking triangle strokes, redrawn as vector from the deck → `assets/img/logo-mark.svg` (also used as the favicon).
  - Navy `#1f396d` · Blue `#00609e` · Sky `#58bceb`
- Web lockup: mark + "FundTrust **IQ**" in FT Sans 700, −0.02em, ink `#012f71` with "IQ" in `#00609e`.
- Clear space: at least the width of one stroke on every side. Minimum mark size: 24 px.
- Don't recolour the strokes, add effects, or rotate the mark.

## 2. Colour
| Role | Token | Hex | Use |
|---|---|---|---|
| Canvas | `--mist-100` | `#f3f6f6` | Page background (the counterpart to Greenlock's `gray-100`) |
| Surface | `--white` | `#ffffff` | Alternating sections, cards, menus |
| Ink | `--navy-600` | `#0b1f3f` | All primary text and rules |
| Ink soft | `--gray-400` | `#5d6b7a` | Secondary text (AA on canvas) |
| Muted display | `--gray-200` | `#d3d9df` | "Inactive" headline state in scroll stories only |
| Accent | `--sky-400` | `#58bceb` | Motif, bullets, highlights |
| Accent deep | `--sky-500` | `#00609e` | Eyebrows, active labels, links on light |
| Dark surface | `--navy-700` | `#071530` | One dramatic section per page (Meetings) and the featured tier |
| Tint | `--mist-200` | `#ecf7f7` | Deck tint, used for diagram sections |

Rules: keep about 80% of the page neutral. Sky is an accent and never a large text colour. Use only one dark section per page.

## 3. Typography
- **Display:** FT Display = *Fraunces* (variable, `opsz` pinned at 36, weight 400). It's self-hosted and stands in for Greenlock's Reckless Neue. Use it for statements only: H1–H3, prices, and the marquee.
- **Text/UI:** FT Sans = *Manrope* (variable), the same family Greenlock uses. Use it for body, nav, buttons, and H4.
- Scale (fluid `clamp`): Display 44→84 · H1 36→74 · H2 30→48 · H3 24→36 · H4 22 · Lead 20→28 · Body 18 · Small 15 · Micro/eyebrow 12 caps, +0.14em.
- Display tracking is −0.02em and line-height is 1.08–1.15. Keep headings sentence case with no trailing full stops, except the hero line.
- Measure: section headings ≤ 22–28ch, body ≤ 40ch.

## 4. Space, grid, radii
- 8-pt scale (`--sp-1`…`--sp-11`). Section padding is `--section-y` (80→160 px). The page gutter is `--gutter` (20→40 px) and max width is 1440 px.
- Radii: 8 px (menu items, flow chips), 16 px (cards, tiers, menus), and pill (chips). Statement areas stay square-edged.
- Elevation: borders and 1-px dividers come first. `--shadow-2` appears only on hover or for floating menus.

## 5. Motif — "The Fan"
Translucent circular sectors fan out from a single pivot. This is Greenlock's hero construction, rebuilt in FundTrustIQ's three logo colours as triangular wedges.
- Depth comes from blur: navy wedges sit behind and are blurred 12–20 px, while sky and ice wedges sit in front and stay sharp.
- Motion: an intro "fan-open" (2.6 s, expo-out), a slow sinusoidal sway (±2–3°), and cursor parallax. Everything is transform-only and pauses offscreen.
- Navy wedges must never cross the headline area. Under reduced motion the fan renders static.
- Crystal icons (`#ic-connect`, `#ic-orchestrate`, `#ic-understand`, `#ic-evidence`, and the hexagon gem) are faceted SVGs built from triangles. They play the role of Greenlock's glass 3D objects.

## 6. Components
| Component | Class | Behaviour |
|---|---|---|
| Nav | `.nav` | Transparent at the top. After 20 px it frosts (blur + hairline). It hides on scroll-down and returns on scroll-up. The links' underline draws in from the left. |
| Mega menu | `.menu`/`.menu-card` | Opens on hover/click (Esc closes). Four cards, each with a crystal icon that lifts on hover. |
| Text CTA | `.cta` | Large 600-weight text plus a ↳ arrow and no button chrome. The underline draws on hover and the arrow nudges. |
| Eyebrow | `.eyebrow` | 12 px caps, +0.14em, deep sky. It sits above every section heading. |
| Marquee | `.marquee` | An infinite roles strip that pauses on hover and wraps statically under reduced motion. |
| Scroll story | `.story` | A sticky 240 vh section. The active statement turns ink and the other fades to muted. The gem rotates with scroll and the tags light up in sequence. |
| Slider | `.slider` | Scroll-snap track with mouse drag and dot pager (ARIA tabs). |
| Focus list | `.prow` | The row nearest the viewport centre (or under the pointer) turns ink and its icon gains colour. Other rows stay muted. |
| Card grid | `.card` | A 1-px ruled grid. On hover the background turns white, the number turns sky, and a 2-px ink line draws along the bottom. |
| Flow | `.flow` | Numbered steps with a gradient rail that fills as you scroll. Chips lift on hover. |
| Tabs | `.tabs` | WAI-ARIA tabs (arrow keys) with an underline indicator. Panels fade up. |
| Chips | `.chips` | Staggered entrance. Hover adds a sky border and tint. |
| Tier | `.tier` | Lifts on hover. `.tier--feat` is the dark variant, used for visual rhythm only (no "recommended" claim). |

## 7. Motion
- Easing: `--ease-out` (expo-out) for reveals and `--ease-inout` for line draws.
- Durations: 180 / 350 / 700 / 1100 ms.
- Reveals rise 28 px and fade over 1.1 s, staggered 50–100 ms.
- The hero headline is split into words, which rise through a mask.
- Animate only `transform` and `opacity`. Use one rAF-throttled scroll handler.
- `prefers-reduced-motion`: every animation is disabled, all content shows immediately, the fan is static, and the marquee wraps.

## 8. Voice
- Tone is calm and precise: governance, not hype. Use short declaratives ("Where trust meets innovation.").
- Always keep the human-authority line where AI is discussed: *"AI assists with review and preparation. Trustees retain independent judgment and final decision authority."*
- Use only claims that come from approved material (the deck). Don't add customer logos, testimonials, or metrics until they're approved.

## 9. Accessibility
- The page uses semantic landmarks, a skip link, visible focus rings (`--focus`), aria-expanded on the menu and burger, and ARIA tabs.
- Body text meets AA. The muted grey "inactive" state is a transient scroll effect on large display text. On mobile and under reduced motion, everything renders in full ink.
