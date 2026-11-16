# FundTrustIQ website v2 — product & design spec

**Status:** Ideation / approved-direction draft  
**Benchmark:** [Loom — Funtrust IQ Benchmark for Seamless 3D UI](https://www.loom.com/share/c7daf44d31f64b86a4c141c09b6f42b7) → [Sharplink](https://www.sharplink.com/) (Studio Freight, Awwwards SOTD)  
**Current live v1:** https://funchandan.github.io/funtrustiq/  
**Brand base:** `BRAND.md` (navy / sky / mist, Fraunces + Manrope, fan + crystal motif)

---

## 1. Verdict from the benchmark

The Loom is not asking for a crypto clone. It sets a **craft bar**:

| Narrator call-out | What it means for FundTrustIQ |
|---|---|
| “Nice 3D textured effect” | One continuous WebGL scene that reads as *product space*, not decoration |
| “The scroll is seamless” | Lenis + scroll-scrubbed animation with no layout jumps |
| “How the gradient changes… information hierarchy” | Section atmosphere shifts with scroll (mist → ice → navy) so hierarchy is felt, not only typed |
| “Typography, buttons, text… type-ahead / text effects” | Word-mask reveals, precise geometric CTAs, hover underlines / cursor-follow accents |
| “3D constant elements in the background” | Persistent camera / object that stays in world while copy changes |
| “News, FAQ… visual hover effects if you follow the cursor” | Add News + FAQ; cursor parallax / magnetic micro-interactions |

**Borrow (technique), don’t borrow (identity).** Keep FundTrustIQ’s calm governance voice, mist canvas, Fraunces statements, and sky accent. Do not adopt Sharplink’s Archivo mono, electric `#0E76FF`, ETH crystal, or chrome crypto canister as product metaphor.

---

## 2. North star

> A single-composition marketing site where **FundTrust IQ** is the hero brand, a **governance-native 3D object** carries the story through scroll, and every section has one job — so trustees feel continuous intelligence, not a brochure of cards.

Success looks like: first viewport is unmistakable FundTrustIQ even with nav removed; scroll feels inevitable; AI is presented as assistive; demo CTA is always one gesture away.

---

## 3. What stays from v1 vs what changes

### Keep
- Positioning: *Where trust meets innovation.* / AI-native governance for mutual fund & ETF boards
- Four pillars: Connect · Orchestrate · Understand · Evidence
- Human-authority line on every AI surface
- Colour tokens (navy / sky / mist) and Fraunces + Manrope
- Pricing tiers and engagement model (content approved)
- Patent-pending, contact points, calm voice

### Evolve
- Fan SVG → **true WebGL motif** (faceted trust crystal / board-book morph) with the same three logo hues
- Sticky gem story → **pinned solid→wireframe product scene** synced to value props (Sharplink’s strongest pattern, remapped)
- Problem slider + card grids → fewer, larger beats; cards only where interaction needs a container
- Add **FAQ** and optional **News / insight** strip
- Footer → blue-mist gradient + **giant cropped wordmark**

### Cut / demote
- Dense first-viewport clutter (no stat strip in hero)
- Multiple competing card systems on one scroll
- Generic “glass emoji 3D” without scroll meaning

---

## 4. Information architecture (single page)

| # | Section | One job | Primary visual |
|---|---|---|---|
| 01 | **Hero** | Brand + promise + dual CTA | Full-bleed 3D field (mist→steel), floating trust crystal / board volume |
| 02 | **Audience strip** | Who sits in the workspace | Quiet marquee of roles |
| 03 | **Market statement** | Why now (approved $70T claim) | Large Fraunces line; no cards |
| 04 | **Pinned story** | From static board books → continuous intelligence | One 3D object morphs solid→wireframe as 3–4 props scroll |
| 05 | **Pillars** | Connect / Orchestrate / Understand / Evidence | Scroll-synced stage changes on the same 3D world |
| 06 | **Proof surface** | Show the product language | Dark glass card: exception trend / board-readiness chart (governance data, not crypto) |
| 07 | **Modules** | Six capabilities, skimable | Ruled list or sparse interaction rows — not a 6-card wall |
| 08 | **AI map** | Skills by layer | Existing tabs, elevated motion + reduced chrome |
| 09 | **Meetings** | Committee coverage | One dark atmospheric section (keep boardroom or 3D room) |
| 10 | **Trust by design** | Security + human judgment | Split statement + short list |
| 11 | **Pricing** | Scale by funds / users | Existing tiers; quieter surfaces |
| 12 | **Engagement** | Discover → Configure → Launch | Three steps, one rail |
| 13 | **FAQ** *(new)* | Objections | Numbered accordion, square + controls |
| 14 | **News** *(new, optional)* | Credibility pulse | Single card + date (omit until real content) |
| 15 | **Final CTA** | Convert | Statement + demo / phone |
| 16 | **Footer** | Brand close | Gradient field, links, **cropped `FundTrustIQ` wordmark** |

Nav: Platform · AI · Pricing · Engagement · **Request a demo**. Mega-menu can remain for four pillars.

---

## 5. Hero composition rules (hard)

First viewport contains **only**:
1. Brand lockup (hero-level signal — wordmark scale competes with, or is the, display line)
2. One headline (keep *Where trust meets innovation.* or a tighter alternate)
3. One supporting sentence
4. One CTA group (primary: Explore platform · secondary: Request demo)
5. One dominant full-bleed 3D plane

No stats, schedules, module grids, or floating badge clusters on the hero. A single optional news chip is allowed only if real content exists (Sharplink pattern) — default off until approved.

---

## 6. Visual direction

### Atmosphere
- Base canvas remains mist (`#f3f6f6`), not purple-on-white and not cream-serif terracotta.
- Scroll drives **long gradients**: mist → ice (`#ecf7f7`) → deep navy (`#071530`) for Meetings / proof / footer close.
- Subtle precision grid or fine radial haze behind 3D (technical, quiet).

### 3D language (governance-native)
Replace ETH crystal / chrome canister with a **FundTrust object system**:
- **Trust crystal** — faceted volume built from logo triangle grammar (navy / blue / sky glass)
- **Board volume** — closed book / sealed packet that unfolds into wireframe data planes
- **Orbit nodes** — sparse partner nodes (custodian, counsel, adviser) connected by dotted paths

One object carries the pinned story. Secondary scenes reuse materials. No random mechanical parts.

### Type & controls
- Display: Fraunces (statements only)
- UI: Manrope
- CTAs: sharper geometry than v1 text-links for primary actions (filled navy or sky, square-ish radius 8–12px) while keeping the calm `↳` text CTA for secondary
- Eyebrows: micro caps + sky; optional small sky square bullet (Sharplink cue, brand-colored)

### Motion (ship 2–3 intentional systems)
1. **Scroll-scrubbed 3D** — camera + morph tied to scroll progress (deterministic)
2. **Word-mask reveals** — hero + section statements
3. **Cursor parallax / magnetic hover** — light on crystal and primary CTAs

Always honor `prefers-reduced-motion`: static 3D frame, instant copy, no scrub.

---

## 7. Content principles

- Calm, precise, governance — not hype
- Claims only from approved deck material
- Always: *AI assists with review and preparation. Trustees retain independent judgment and final decision authority.*
- No fake logos, testimonials, or metrics
- FAQ answers stay short; defer legal/security deep-dives to sales

### Suggested FAQ seeds (editable)
1. Is FundTrustIQ a generic board portal?  
2. Who retains decision authority when AI is used?  
3. How does source traceability work?  
4. What does a 30-day guided evaluation include?  
5. How is pricing scaled?

---

## 8. Technical recommendation

v1 is zero-build static HTML. Sharplink-level craft needs a thin build:

| Layer | Choice | Why |
|---|---|---|
| Tooling | **Vite + vanilla TypeScript** | Keep GH Pages simple; no Nuxt/CMS tax yet |
| Scroll | **Lenis** (already vendored) | Match seamless feel |
| Timeline | **GSAP + ScrollTrigger** | Pinned morph, text, gradient scrub |
| 3D | **Three.js** (2–3 scenes, one shared renderer if possible) | Real materials + morph targets |
| Deploy | Existing Pages workflow on built `dist/` | Update Actions to `npm run build` |

**Non-goals for v2 launch:** CMS, blog engine, app login, live API dashboards. Proof chart can be authored SVG/canvas with static illustrative data labeled as sample.

Performance budget: LCP &lt; 2.5s on cable; 3D pauses offscreen; mobile gets simplified geometry or baked poster + light parallax.

---

## 9. Build phases

1. **Direction lock** — this spec + mood frames (crystal / board morph)  
2. **IA & copy pass** — section map + FAQ; confirm hero line  
3. **Prototype** — Vite shell, Lenis, hero WebGL, one pinned morph  
4. **Full page** — remaining sections, FAQ, footer wordmark  
5. **Harden** — a11y, reduced motion, Pages deploy, lighthouse  

---

## 10. Acceptance criteria

- [ ] Brand test: first viewport without nav still reads as FundTrustIQ  
- [ ] Scroll feels continuous; no janky sticky jumps on desktop  
- [ ] One primary 3D story object with solid→wireframe (or closed→unfolded) meaning  
- [ ] Gradient / atmosphere supports hierarchy across at least three beats  
- [ ] FAQ present; News optional with real content only  
- [ ] Human-authority line intact on AI surfaces  
- [ ] Reduced-motion path usable without 3D scrub  
- [ ] Mobile: readable composition; 3D does not block content  

---

## 11. Reference captures

Loom walkthrough frames (for craft, not for brand cloning) live in `docs/v2/reference/`.

Source walkthrough: https://www.loom.com/share/c7daf44d31f64b86a4c141c09b6f42b7  
Live benchmark: https://www.sharplink.com/
