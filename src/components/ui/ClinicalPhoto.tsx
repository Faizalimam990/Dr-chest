import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/env";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The grade every clinic photograph on the page shares. The sources are warm,
 * bright ward and consulting-room snaps and the page is a cool near-black, so
 * each one gets a light desaturation, a teal soft-light wash and a vignette
 * that sinks its edges into the plate it sits on. Holding the values in one
 * place is what makes the photographs read as one set rather than four
 * unrelated uploads.
 */
const GRADE = "saturate(0.82) contrast(1.06) brightness(0.94)";
const TEAL_WASH = "rgba(45,212,191,0.28)";
const VIGNETTE =
  "radial-gradient(ellipse 78% 70% at 50% 40%, transparent 40%, rgba(4,9,12,0.42) 85%, rgba(4,9,12,0.72) 100%), linear-gradient(180deg, rgba(4,9,12,0.35) 0%, transparent 22%, transparent 72%, rgba(4,9,12,0.55) 100%)";

interface Props {
  src: string;
  alt: string;
  /** Intrinsic pixel size — reserves the box so nothing reflows on load. */
  width: number;
  height: number;
  /** Aspect-ratio utility for the crop window, e.g. "aspect-[21/10]". */
  aspect?: string;
  /** object-position utility, e.g. "object-top". */
  position?: string;
  /**
   * Override the shared grade. Only for sources that are exposed far off the
   * others — the consulting-room snap is shot against a white wall and needs
   * pulling down harder to sit level with the rest of the set.
   */
  grade?: string;
  /**
   * Absolutely fill the nearest positioned ancestor instead of setting the
   * height from `aspect` — for photographs that have to match the height of a
   * neighbouring column.
   */
  fill?: boolean;
  className?: string;
}

export default function ClinicalPhoto({
  src,
  alt,
  width,
  height,
  aspect = "aspect-[5/7]",
  position = "object-center",
  grade = GRADE,
  fill = false,
  className = "",
}: Props) {
  const reduced = prefersReducedMotion();

  return (
    <motion.div
      className={`${fill ? "absolute inset-0" : "relative"} ${className}`}
      initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={
          fill
            ? `block h-full w-full object-cover ${position}`
            : `block w-full object-cover ${aspect} ${position}`
        }
        style={{ filter: grade }}
      />
      {/* teal wash — soft-light keeps skin tones honest */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: TEAL_WASH }}
      />
      {/* vignette + foot fade into whatever sits below the frame */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: VIGNETTE }} />
      <div aria-hidden className="scan-grid pointer-events-none absolute inset-0 opacity-25" />
    </motion.div>
  );
}
