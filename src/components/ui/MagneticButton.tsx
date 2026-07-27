import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursorVariant } from "@/hooks/useCursorVariant";

type Variant = "primary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  strength?: number;
  className?: string;
}

/**
 * Magnetic button/CTA. Wraps children in a magnetic field, drives the
 * "hover-magnetic" cursor variant, and animates its own gradient border.
 */
const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  { children, variant = "primary", strength = 0.45, className = "", ...rest },
  _ref,
) {
  const magneticRef = useMagnetic<HTMLSpanElement>({ strength, radius: 90 });
  const cursor = useCursorVariant("hover-magnetic");

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-acid";
  const styles =
    variant === "primary"
      ? "btn-gradient animate-gradient-shift hover:brightness-110"
      : "gradient-border text-ink hover:text-acid bg-[rgba(244,244,250,0.02)]";

  return (
    <span ref={magneticRef} className="inline-block will-change-transform">
      <button className={`${base} ${styles} ${className}`} {...cursor} {...rest}>
        <span className="pointer-events-none inline-flex items-center gap-2">{children}</span>
      </button>
    </span>
  );
});

export default MagneticButton;
