import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export type MotionContext = {
  lenis: Lenis | null;
  reduced: boolean;
  destroy: () => void;
};

export function initMotion(): MotionContext {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  let lenis: Lenis | null = null;

  if (!reduced && !coarse) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis", "lenis-smooth");
  }

  // Word-mask split
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const html = el.innerHTML;
    el.innerHTML = html
      .split(/(<br\s*\/?>)/i)
      .map((part) => {
        if (/^<br/i.test(part)) return part;
        return part
          .split(/(\s+)/)
          .map((token) => {
            if (/^\s+$/.test(token) || token === "") return token;
            return `<span class="word"><span>${token}</span></span>`;
          })
          .join("");
      })
      .join("");

    if (reduced) {
      el.querySelectorAll<HTMLElement>(".word > span").forEach((span) => {
        span.style.transform = "none";
      });
      return;
    }

    gsap.to(el.querySelectorAll(".word > span"), {
      y: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.05,
      delay: 0.15,
    });
  });

  // Reveal on enter
  if (!reduced) {
    gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
      const delay = Number.parseFloat(el.style.getPropertyValue("--d") || "0") || 0;
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  } else {
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // Duplicate marquee children for seamless loop
  const track = document.querySelector<HTMLElement>("[data-marquee] .marquee__track");
  if (track && !reduced) {
    track.innerHTML += track.innerHTML;
  }

  // Magnetic buttons
  if (!reduced && !coarse) {
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const strength = 18;
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x / strength, y: y / strength, duration: 0.35, ease: "power3.out" });
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      });
    });
  }

  // Year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Parallax boardroom
  const media = document.querySelector<HTMLElement>("[data-parallax]");
  if (media && !reduced) {
    gsap.to(media, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: media.closest(".meet"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Pillar focus
  const pillars = Array.from(document.querySelectorAll<HTMLElement>("[data-pillar]"));
  if (pillars.length) {
    const setHot = () => {
      let best: HTMLElement | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      const mid = window.innerHeight * 0.45;
      pillars.forEach((p) => {
        const r = p.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      });
      pillars.forEach((p) => p.classList.toggle("is-hot", p === best));
    };
    window.addEventListener("scroll", setHot, { passive: true });
    setHot();
  }

  return {
    lenis,
    reduced,
    destroy() {
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    },
  };
}

export function bindStoryScroll(
  onProgress: (p: number, index: number) => void,
  reduced: boolean,
): void {
  const section = document.querySelector<HTMLElement>("[data-story]");
  const props = Array.from(document.querySelectorAll<HTMLElement>("[data-prop]"));
  if (!section || !props.length) return;

  if (reduced) {
    props.forEach((p) => p.classList.add("is-on"));
    onProgress(1, props.length - 1);
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      const index = Math.min(props.length - 1, Math.floor(p * props.length));
      props.forEach((el, i) => el.classList.toggle("is-on", i === index));
      onProgress(p, index);
    },
  });
}
