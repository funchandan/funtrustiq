# FundTrustIQ — marketing site v1

**Live demo:** https://funchandan.github.io/funtrustiq/

**Website v2 (spec):** see [`docs/v2/SPEC.md`](docs/v2/SPEC.md) — craft bar from the Sharplink Loom walkthrough, remapped to FundTrustIQ brand.

**Website v2 (implementation, held):** branch [`cursor/website-v2-frontend-9932`](https://github.com/funchandan/funtrustiq/tree/cursor/website-v2-frontend-9932) — Vite + Three.js frontend from #4, kept for a later deploy. `main` serves v1 until then.

Static site: plain HTML/CSS/JS with no build step. Fonts are self-hosted. Smooth scrolling is a vendored copy of Lenis (no build step, no CDN).

```
index.html          single page (all sections)
css/tokens.css      design tokens (colour, type, spacing, radii, motion)
css/site.css        components + layout
js/main.js          interactions (nav, fan hero, reveals, story, slider, tabs, smooth scroll)
js/vendor/lenis.min.js  Lenis 1.3.27 (MIT) inertia scroll
css/lenis.css       Lenis rules so it does not fight native sticky or CSS smooth scroll
assets/img          logo-mark.svg (vector redraw of the deck logo), favicon, boardroom.jpg (from deck p.8)
assets/fonts        Fraunces (display), Manrope (text), both OFL
BRAND.md            brand + component guidelines
```

## Hero headline time-savings figure

The hero omits the percentage until an approved figure is supplied. The only toggle is the `data-less-time` attribute on `#hero-h` in `index.html`. `js/main.js` reads it before the word-split reveal.

- `data-less-time=""` — “Confident board decisions to tracked actions, with 1940 Act compliance governed end to end.”
- `data-less-time="40"` — “Confident board decisions to tracked actions in up to 40% less time, with 1940 Act compliance governed end to end.”

Any finite number greater than zero is rounded and inserted the same way. An empty value, zero, or anything that is not a number leaves the headline unchanged.

## Run locally

From the repository root:

```
python3 -m http.server 8787     # → http://localhost:8787
```

GitHub Pages serves this site from the `/funtrustiq/` subpath. To preview that same layout, serve a parent directory that contains this checkout as `funtrustiq/`:

```
python3 -m http.server 8787     # → http://localhost:8787/funtrustiq/
```

Stylesheets, scripts, fonts, images, the favicon, and in-page links use relative URLs, so they resolve under that prefix. To deploy anywhere else, upload the repository root as-is to any static host.

Wheel scrolling uses a light inertia curve (vendored Lenis). In-page links ease to the target and keep the sticky nav clear via `scroll-padding-top`. The smooth scroll is not started when `prefers-reduced-motion` is set, or when the primary pointer is coarse; those visits keep native scrolling.

## Deploy

Pushes to `main` publish the repository root with GitHub Actions (`.github/workflows/pages.yml`). The workflow sets `enablement: true` so Actions tries to turn GitHub Pages on. The default `GITHUB_TOKEN` cannot enable Pages on a repository that has never had it, so after the first merge open **Settings → Pages** and set **Source** to **GitHub Actions** if the deploy workflow reports that Pages is not enabled, then re-run the workflow.
