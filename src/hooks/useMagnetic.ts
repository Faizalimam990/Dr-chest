import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/env";

interface Options {
  /** Pull strength 0..1 (fraction of pointer offset the element follows). */
  strength?: number;
  /** Activation radius in px around the element center. */
  radius?: number;
  /** Hard cap on the displacement, px. Keeps rows of buttons on one baseline. */
  max?: number;
}

const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, v));

/**
 * Attach the returned ref to any element to make it magnetic: it eases toward
 * the pointer within `radius` and springs back with an elastic ease on leave.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  { strength = 0.4, radius = 120, max = 14 }: Options = {},
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
        // Capped so a strong pull can never knock the element off the baseline
        // it shares with its neighbours — it nudges, it doesn't drift away.
        xTo(clamp(dx * strength, max));
        yTo(clamp(dy * strength, max));
        wasActive = true;
      } else if (wasActive) {
        // Pointer left the field without ever entering the element bounds.
        release();
      }
    };

    let wasActive = false;

    const release = () => {
      wasActive = false;
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    };

    // Scrolling moves the element out from under a stationary pointer, and the
    // cursor leaving the window stops firing pointermove — both would otherwise
    // strand the offset mid-pull.
    const onLeave = () => {
      if (wasActive) release();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onLeave, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onLeave);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return ref;
}
