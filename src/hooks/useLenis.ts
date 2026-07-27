import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/env";

/**
 * Boots Lenis smooth scroll and syncs it into ScrollTrigger via gsap.ticker.
 * Skips smoothing entirely when the user prefers reduced motion — ScrollTrigger
 * still works against native scroll.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose so anchor links / buttons can request a smooth scroll.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

/** Programmatic smooth scroll to an element id or offset. */
export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    // Land exactly at the section top. Pinned sections frame their first step;
    // padded sections keep their heading clear of the fixed navbar.
    lenis.scrollTo(target, { offset: 0, duration: 1 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
