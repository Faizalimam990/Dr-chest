import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { JOURNEY } from "@/lib/content";
import { prefersReducedMotion, isSmallScreen } from "@/lib/env";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Clinical-note card listing what actually happens at the active step. */
function NoteCard({ index }: { index: number }) {
  const step = JOURNEY[index];
  return (
    <div className="glass-card relative overflow-hidden p-6">
      {/* note header, styled as a patient chart */}
      <div className="flex items-center gap-2 border-b border-line pb-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(234,246,248,0.18)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(234,246,248,0.18)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="ml-3 font-display text-xs uppercase tracking-widest text-ink-faint">
          {step.title} · clinical note
        </span>
      </div>

      {/* ghost step number */}
      <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[9rem] font-semibold leading-none text-ink/[0.04]">
        {step.no}
      </span>

      <ul className="relative mt-6 space-y-3">
        {step.features.map((f, i) => (
          <motion.li
            key={f}
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.55, ease: EASE }}
            className="flex items-center gap-3 rounded-xl border border-line bg-[rgba(234,246,248,0.02)] px-4 py-3.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-accent">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-sm text-ink">{f}</span>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        className="mt-6 h-1 origin-left rounded-full bg-gradient-primary"
      />
    </div>
  );
}

function Panel({ index }: { index: number }) {
  const step = JOURNEY[index];
  return (
    <div className="container-edge grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.no}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="font-display text-[clamp(4.5rem,11vw,10rem)] font-semibold leading-none text-ink">
              {step.no}
            </div>
            <span className="mt-4 block font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {step.title}
            </span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.02] text-ink md:text-5xl">
              {step.headline}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">{step.blurb}</p>
            <p className="mt-8 font-display text-xl font-semibold tracking-tight text-ink">
              {step.outcome}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.no}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <NoteCard index={index} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * The patient pathway, pinned and scrubbed: one step per viewport of scroll.
 * Falls back to a plain stacked list on small screens and under reduced motion,
 * where pinning fights the native scroll.
 */
export default function PatientJourney() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const stacked = prefersReducedMotion() || isSmallScreen();

  useGSAP(
    () => {
      if (stacked || !stage.current) return;

      const st = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: () => "+=" + (JOURNEY.length - 1) * 100 + "%",
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.min(
            JOURNEY.length - 1,
            Math.round(self.progress * (JOURNEY.length - 1)),
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });
      return () => st.kill();
    },
    { scope: section, dependencies: [stacked] },
  );

  return (
    <section ref={section} id="journey" className="relative bg-panel">
      {stacked ? (
        <div className="container-edge py-24">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Your first visit
          </span>
          <h2 className="mt-5 font-display text-display-md font-semibold text-ink">
            Five steps, <em className="accent-serif text-gradient">no guesswork.</em>
          </h2>
          <div className="mt-14 space-y-16">
            {JOURNEY.map((step) => (
              <div key={step.no} className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="font-display text-6xl font-semibold text-ink">{step.no}</div>
                  <span className="mt-3 block font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    {step.title}
                  </span>
                  <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
                    {step.headline}
                  </h3>
                  <p className="mt-4 max-w-md text-ink-muted">{step.blurb}</p>
                </div>
                <ul className="space-y-3 self-center">
                  {step.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div ref={stage} className="relative flex h-screen items-center overflow-hidden">
          <div className="absolute left-0 right-0 top-[calc(var(--nav-h)+1.5rem)]">
            <div className="container-edge flex items-center justify-between">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Your first visit
              </span>
              <span className="nums font-display text-sm text-ink-faint">
                {String(active + 1).padStart(2, "0")} — {String(JOURNEY.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <Panel index={active} />

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[rgba(234,246,248,0.06)]">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-primary" />
          </div>
        </div>
      )}
    </section>
  );
}
