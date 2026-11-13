# FundTrustIQ — marketing site v1

**Live demo:** https://funchandan.github.io/funtrustiq/

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
