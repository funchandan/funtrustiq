import "./styles/tokens.css";
import "./styles/site.css";

import { bindStoryScroll, initMotion } from "./motion";
import { initNav } from "./ui/nav";
import { initTabs } from "./ui/tabs";

async function main(): Promise<void> {
  initNav();
  initTabs();
  const motion = initMotion();

  const heroCanvas = document.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
  const storyCanvas = document.querySelector<HTMLCanvasElement>("[data-story-canvas]");

  const [{ createHeroCrystal }, { createStoryMorph }] = await Promise.all([
    import("./three/crystal"),
    import("./three/storyMorph"),
  ]);

  const hero = heroCanvas ? createHeroCrystal(heroCanvas) : null;
  const story = storyCanvas ? createStoryMorph(storyCanvas) : null;

  hero?.setReduced(motion.reduced);
  story?.setReduced(motion.reduced);

  bindStoryScroll((p) => {
    story?.setProgress(p);
  }, motion.reduced);

  const onPointer = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    hero?.setPointer(nx, -ny);
    story?.setPointer(nx, -ny);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const onResize = () => {
    hero?.resize();
    story?.resize();
  };
  window.addEventListener("resize", onResize, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroCanvas) {
            hero?.setReduced(motion.reduced || !entry.isIntersecting);
          }
          if (entry.target === storyCanvas && motion.reduced) {
            story?.setReduced(true);
          }
        });
      },
      { threshold: 0.05 },
    );
    if (heroCanvas) io.observe(heroCanvas);
    if (storyCanvas) io.observe(storyCanvas);
  }
}

void main();
