import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/env";

interface Props {
  color?: string;
  size?: number;
  className?: string;
  /** Scroll-parallax factor (px of drift over the page). */
  parallax?: number;
}

/**
 * A large, soft, blurred gradient blob that drifts on an infinite timeline
 * plus a light scroll-parallax. Purely decorative.
 */
export default function GradientBlob({
  color = "var(--indigo)",
  size = 520,
  className = "",
  parallax = 120,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      gsap.to(ref.current, {
        xPercent: "+=14",
        yPercent: "+=18",
        scale: 1.12,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(ref.current, {
        y: parallax,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 68%)`,
        filter: "blur(110px)",
        opacity: 0.22,
        willChange: "transform",
      }}
    />
  );
}
