# FundTrustIQ — marketing site v2

**Live:** https://funchandan.github.io/funtrustiq/

Vite + TypeScript marketing site with Lenis smooth scroll, GSAP ScrollTrigger, and Three.js governance visuals. Craft bar: seamless 3D scroll (see `docs/v2/SPEC.md`). Brand tokens follow `BRAND.md`.

```
index.html          page shell (all sections)
src/main.ts         boot
src/motion.ts       Lenis, reveals, magnetic CTAs, story scrub
src/three/          hero crystal + pinned board morph
src/styles/         tokens + layout
public/assets/      logo, favicon, boardroom, fonts (also bundled from src/assets/fonts)
docs/v2/            website v2 product/design spec
```

## Run locally

```bash
npm install
npm run dev          # → http://localhost:8787/
```

```bash
npm run build        # → dist/ (base /funtrustiq/ for GitHub Pages)
npm run preview      # preview production build
```

## Deploy

Pushes to `main` run `.github/workflows/pages.yml`: `npm ci` → `npm run build` → publish `dist/`.

After the first enablement, if Pages is not on yet: **Settings → Pages → Source: GitHub Actions**.
