import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/env";

interface Options {
  /** Pull strength 0..1 (fraction of pointer offset the element follows). */
  strength?: number;
  /** Activation radius in px around the element center. */
  radius?: number;
}

/**
 * Attach the returned ref to any element to make it magnetic: it eases toward
 * the pointer within `radius` and springs back with an elastic ease on leave.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  { strength = 0.4, radius = 120 }: Options = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const active = dist < radius + Math.max(rect.width, rect.height) / 2;
      if (active) {
        xTo(dx * strength);
        yTo(dy * strength);
        wasActive = true;
      } else if (wasActive) {
        // Pointer left the field without ever entering the element bounds.
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
        wasActive = false;
      }
    };

    let wasActive = false;

    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return ref;
}
