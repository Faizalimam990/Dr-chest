import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/env";
import type { RefObject } from "react";

/**
 * Staggered scroll-reveal for any element tagged with [data-reveal] inside the
 * scoped section. Reduced motion → a plain opacity fade with no transform.
 */
export function useReveal(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (!targets.length) return;

      const reduced = prefersReducedMotion();

      targets.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: reduced ? 0 : 42,
          duration: reduced ? 0.4 : 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope },
  );
}
