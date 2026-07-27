import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { FAQS } from "@/lib/content";
import { useReveal } from "@/hooks/useReveal";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { isSmallScreen, prefersReducedMotion } from "@/lib/env";

const STEP = 46; // px each row cascades to the right

export default function FAQ() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Each question fades in from the left, scrubbed to scroll position — so
  // scrolling slowly brings them in one by one (and reverses on scroll up).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-faq-row]");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, x: -80 },
          {
            autoAlpha: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: "top 62%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );
  const linkCursor = useCursorVariant("hover-link");
  const [open, setOpen] = useState<number | null>(0);
  const staircase = !isSmallScreen();

  return (
    <section ref={root} id="faq" className="relative overflow-hidden py-28">
      <div className="grid items-start gap-12 lg:grid-cols-[38%_62%]">
        {/* Left — giant title */}
        <div className="container-edge lg:sticky lg:top-[var(--nav-h)]">
          <span data-reveal className="eyebrow">
            <span className="eyebrow-dot" />
            Before you visit
          </span>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(3.5rem,11vw,9rem)] font-semibold leading-[0.9] text-ink"
          >
            FAQs
          </h2>
          <p data-reveal className="mt-6 max-w-xs text-ink-muted">
            The questions patients ask most often — answered before you book.
          </p>
        </div>

        {/* Right — staircase */}
        <div className="relative pr-5 sm:pr-8">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                data-faq-row
                style={{ marginLeft: staircase ? i * STEP : undefined }}
                className="mb-3"
              >
                <button
                  {...linkCursor}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`group flex w-full items-center gap-5 border px-6 py-6 text-left transition-colors duration-300 ${
                    isOpen
                      ? "border-accent bg-[rgba(45,212,191,0.05)]"
                      : "border-line hover:border-accent"
                  }`}
                >
                  <Plus
                    className={`h-6 w-6 shrink-0 transition-all duration-300 ${
                      isOpen ? "rotate-45 text-accent" : "text-ink-muted group-hover:text-accent"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={`font-display text-xl font-medium tracking-tight transition-colors duration-300 md:text-2xl ${
                      isOpen ? "text-accent" : "text-ink group-hover:text-accent"
                    }`}
                  >
                    {item.q}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-x border-b border-accent/40"
                    >
                      <p className="max-w-2xl px-6 py-6 leading-relaxed text-ink-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
