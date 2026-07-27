import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/env";
import { useUIStore } from "@/store/uiStore";
import { ArrowUpRight } from "lucide-react";

/**
 * Dot (instant) + lagging ring (gsap.quickTo), mix-blend-mode: difference.
 * Variants come from the UI store. Fully disabled on touch / reduced-motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const variant = useUIStore((s) => s.cursorVariant);
  const label = useUIStore((s) => s.cursorLabel);
  const enabledRef = useRef(false);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    enabledRef.current = true;
    document.documentElement.classList.add("has-custom-cursor");

    const ring = ringRef.current!;
    const dot = dotRef.current!;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };
    const onLeave = () => {
      visible = false;
      gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  // Ring styling per variant.
  const ringSize =
    variant === "hover-view" ? 120 : variant === "hover-link" ? 60 : variant === "drag" ? 88 : 34;
  const ringBg =
    variant === "hover-view" || variant === "drag"
      ? "var(--accent)"
      : variant === "hover-link"
        ? "rgba(45,212,191,0.16)"
        : "transparent";
  const ringBorder = variant === "default" ? "1.5px solid var(--accent)" : "1.5px solid transparent";

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full font-display text-[11px] font-semibold uppercase tracking-widest text-void opacity-0"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          background: ringBg,
          border: ringBorder,
          mixBlendMode: "difference",
          transition: "width .35s cubic-bezier(.16,1,.3,1), height .35s cubic-bezier(.16,1,.3,1), background .3s ease",
        }}
      >
        {variant === "hover-view" && <span>MORE</span>}
        {variant === "drag" && <span>DRAG</span>}
        {variant === "hover-magnetic" && (
          <ArrowUpRight className="h-5 w-5 text-void" strokeWidth={2.5} />
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-acid opacity-0"
        style={{
          marginLeft: -3,
          marginTop: -3,
          mixBlendMode: "difference",
          background: "var(--accent)",
        }}
      />
    </>
  );
}
