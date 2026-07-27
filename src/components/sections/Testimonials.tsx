import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { prefersReducedMotion } from "@/lib/env";

const AUTO_MS = 7000;
const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.028, delayChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const wordVariant = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.6, ease: EASE } },
};

function Arrow({
  dir,
  onClick,
  children,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  children?: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLButtonElement>({ strength: 0.5, radius: 70 });
  const cursor = useCursorVariant("hover-magnetic");
  return (
    <button
      ref={ref}
      {...cursor}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous testimonial" : "Next testimonial"}
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {dir === "prev" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
      {children}
    </button>
  );
}

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduced = prefersReducedMotion();

  const paginate = useCallback((d: number) => {
    setState(([i]) => [(i + d + TESTIMONIALS.length) % TESTIMONIALS.length, d]);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => paginate(1), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, index, paginate, reduced]);

  const t = TESTIMONIALS[index];
  const words = t.quote.split(" ");

  return (
    <section
      ref={root}
      id="stories"
      className="relative flex min-h-[92vh] items-center overflow-hidden py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* huge ghosted index */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[4vw] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] font-semibold leading-none text-ink/[0.025] md:text-[30vw]"
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="container-edge relative">
        <span data-reveal className="eyebrow">
          <span className="eyebrow-dot is-coral" />
          Patient stories
        </span>

        <div data-reveal className="relative mt-12 min-h-[300px] max-w-5xl">
          {/* quote mark */}
          <svg
            aria-hidden
            viewBox="0 0 40 30"
            className="mb-8 h-10 w-14 text-accent"
            fill="currentColor"
          >
            <path d="M0 30V15C0 6.7 5.4 1 14 0l1.5 4.5C10.8 6 8 9 8 13h6v17H0Zm22 0V15C22 6.7 27.4 1 36 0l1.5 4.5C32.8 6 30 9 30 13h6v17H22Z" />
          </svg>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              variants={reduced ? undefined : container}
              initial={reduced ? { opacity: 0 } : "hidden"}
              animate={reduced ? { opacity: 1 } : "show"}
              exit={reduced ? { opacity: 0 } : "exit"}
            >
              <p className="flex flex-wrap font-display text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-[1.12] tracking-tight text-ink">
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.12em] pr-[0.28em]">
                    <motion.span variants={reduced ? undefined : wordVariant} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
              </p>

              <motion.footer
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.15 + words.length * 0.028, duration: 0.5, ease: EASE }}
                className="mt-10 text-lg"
              >
                <span className="font-medium text-ink">{t.name}</span>
                <span className="text-ink-muted"> — {t.role}, {t.company}</span>
              </motion.footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="mt-14 flex items-center gap-4">
          <Arrow dir="prev" onClick={() => paginate(-1)} />
          <Arrow dir="next" onClick={() => paginate(1)}>
            {/* auto-advance progress ring */}
            {!reduced && (
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 56 56"
              >
                <motion.circle
                  key={`${index}-${paused}`}
                  cx="28"
                  cy="28"
                  r="27"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: paused ? 0 : 1 }}
                  transition={{ duration: paused ? 0.3 : AUTO_MS / 1000, ease: "linear" }}
                />
              </svg>
            )}
          </Arrow>

          <div className="ml-4 flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-10 bg-accent" : "w-1.5 bg-line hover:bg-ink-faint"
                }`}
              />
            ))}
          </div>

          <span className="ml-auto hidden font-display text-sm tabular-nums text-ink-faint sm:block">
            {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-8 text-xs text-ink-faint">
          Shared with patient consent · surnames abbreviated · individual results vary.
        </p>
      </div>
    </section>
  );
}
