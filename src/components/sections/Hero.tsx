import { Suspense, lazy, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Activity } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useUIStore } from "@/store/uiStore";
import { prefersReducedMotion, isTouchDevice } from "@/lib/env";
import { scrollToId } from "@/hooks/useLenis";
import { heroScroll } from "@/lib/scrollSignal";
import { DOCTOR, SERVICE_TAGS } from "@/lib/content";
import MagneticButton from "@/components/ui/MagneticButton";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import EcgLine from "@/components/ui/EcgLine";

const HeroScene = lazy(() => import("./HeroScene"));

const EASE = [0.16, 1, 0.3, 1] as const;

/** Narration for the scroll-driven anatomy sequence, keyed to scroll progress. */
const PHASES = [
  {
    at: 0.16,
    label: "Thoracic cage",
    metric: "12 pairs",
    title: "The cage opens",
    body: "Your ribs lift and rotate around twenty thousand times a day. When breathing hurts, this is where the examination starts.",
  },
  {
    at: 0.42,
    label: "Lungs",
    metric: "~70 m²",
    title: "Half a tennis court",
    body: "Laid flat, the alveolar surface of two healthy lungs would cover about seventy square metres. Lung function testing measures how much of it still works.",
  },
  {
    at: 0.64,
    label: "Bronchial tree",
    metric: "23 divisions",
    title: "Twenty-three generations",
    body: "The airway branches twenty-three times between your throat and a single alveolus. Asthma and COPD narrow it — bronchoscopy lets us see it.",
  },
  {
    at: 0.86,
    label: "Every breath, measured",
    metric: "Same visit",
    title: "Then it gets explained",
    body: "Your scans and flow-volume loops go up on screen, annotated, in the same appointment — so you leave able to explain your own diagnosis.",
  },
];

const HEADLINE = ["Breathe", "easier."];

/**
 * Service chips riding an elliptical orbit around the chest. They are the first
 * thing on screen and peel away as the scroll sequence begins, handing the
 * stage over to the anatomy.
 */
function OrbitStage() {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const cleanups: Array<() => void> = [];

      const chips = gsap.utils.toArray<HTMLElement>("[data-orbit]");
      if (chips.length) {
        const radius = () => {
          const w = stage.current?.clientWidth ?? 560;
          const rx = Math.max(190, Math.min(w * 0.46, 300));
          return { rx, ry: rx * 0.62 };
        };
        let { rx, ry } = radius();

        gsap.set(chips, { xPercent: -50, yPercent: -50 });
        const place = (a: number) =>
          chips.forEach((c, i) => {
            const ang = a + (i / chips.length) * Math.PI * 2;
            const depth = (Math.sin(ang) + 1) / 2; // 0 behind → 1 in front
            gsap.set(c, {
              x: Math.cos(ang) * rx,
              y: Math.sin(ang) * ry,
              scale: 0.76 + depth * 0.3,
              opacity: 0.28 + depth * 0.62,
              filter: `blur(${(1 - depth) * 1.6}px)`,
              zIndex: Math.round(depth * 10),
            });
          });
        place(0);

        if (!reduced) {
          const state = { a: 0 };
          const spin = gsap.to(state, {
            a: Math.PI * 2,
            duration: 44,
            repeat: -1,
            ease: "none",
            onUpdate: () => place(state.a),
          });
          const onResize = () => ({ rx, ry } = radius());
          window.addEventListener("resize", onResize);
          cleanups.push(() => {
            spin.kill();
            window.removeEventListener("resize", onResize);
          });
        }
      }

      // Cursor-reactive tilt of the whole orbit plane.
      if (!reduced && !isTouchDevice() && tilt.current) {
        gsap.set(tilt.current, { transformPerspective: 1000, transformOrigin: "center" });
        const ry = gsap.quickTo(tilt.current, "rotationY", { duration: 0.9, ease: "power3.out" });
        const rx = gsap.quickTo(tilt.current, "rotationX", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          ry((e.clientX / window.innerWidth - 0.5) * 20);
          rx(-(e.clientY / window.innerHeight - 0.5) * 20);
        };
        window.addEventListener("pointermove", onMove);
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: stage },
  );

  return (
    <div
      ref={stage}
      aria-hidden
      data-orbit-stage
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden aspect-square w-[min(720px,94%)] -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ perspective: "1000px" }}
    >
      <div ref={tilt} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-line" />
        <div className="absolute left-1/2 top-1/2 h-[40%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-line opacity-50" />

        {SERVICE_TAGS.map((label) => (
          <span
            data-orbit
            key={label}
            className="absolute left-1/2 top-1/2 flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-panel-raised/70 px-3.5 py-1.5 font-display text-[13px] font-medium text-ink shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <span className="h-1 w-1 rounded-full bg-accent" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Live vitals read-out. Values are written straight to the DOM from the GSAP
 * ticker — a React state update per frame for three numbers would be waste.
 */
function VitalsHud() {
  const spo2 = useRef<HTMLSpanElement>(null);
  const rr = useRef<HTMLSpanElement>(null);
  const hr = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    let last = 0;
    const tick = (time: number) => {
      // Twice a second is enough to read as "live" without looking twitchy.
      if (time - last < 500) return;
      last = time;
      const t = time / 1000;
      if (spo2.current) spo2.current.textContent = String(97 + Math.round(Math.abs(Math.sin(t * 0.31)) * 2));
      if (rr.current) rr.current.textContent = String(13 + Math.round(Math.abs(Math.sin(t * 0.19)) * 2));
      if (hr.current) hr.current.textContent = String(68 + Math.round(Math.abs(Math.sin(t * 0.23)) * 8));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const rows: [string, React.RefObject<HTMLSpanElement>, string][] = [
    ["SpO₂", spo2, "%"],
    ["RR", rr, "/min"],
    ["HR", hr, "bpm"],
  ];

  return (
    <div
      data-hero-hud
      className="pointer-events-none absolute bottom-9 left-[clamp(1.25rem,5vw,4rem)] z-30 hidden lg:block"
    >
      <div className="flex items-end gap-6 border-l border-line pl-5">
        {rows.map(([label, ref, unit]) => (
          <div key={label}>
            <div className="font-display text-[10px] uppercase tracking-[0.28em] text-ink-faint">
              {label}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span ref={ref} className="nums font-display text-2xl font-semibold text-ink">
                —
              </span>
              <span className="text-[11px] text-ink-faint">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 w-[260px] pl-5">
        <EcgLine beats={4} duration={3.4} className="h-8" />
      </div>
    </div>
  );
}

export default function Hero() {
  const loaded = useUIStore((s) => s.loaded);
  const root = useRef<HTMLElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [phase, setPhase] = useState(-1);
  const phaseRef = useRef(-1);

  /* ── the scroll conductor: writes the shared signal, swaps the narration ── */
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          heroScroll.value = p;

          let next = -1;
          for (let i = 0; i < PHASES.length; i++) if (p >= PHASES[i].at) next = i;
          if (next !== phaseRef.current) {
            phaseRef.current = next;
            setPhase(next);
          }

          // Right-edge phase ticks fill as their phase is reached.
          tickRefs.current.forEach((el, i) => {
            if (!el) return;
            const span = (PHASES[i + 1]?.at ?? 1) - PHASES[i].at;
            const local = Math.max(0, Math.min(1, (p - PHASES[i].at) / span));
            el.style.transform = `scaleY(${local})`;
          });
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  /* ── intro reveal + copy hand-off ── */
  useGSAP(
    () => {
      if (!loaded) return;
      const reduced = prefersReducedMotion();

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 20, duration: 0.6 })
        .from(
          "[data-hero-line]",
          { yPercent: reduced ? 0 : 115, opacity: reduced ? 0 : 1, duration: 1.1, stagger: 0.1 },
          reduced ? "<" : "-=0.3",
        )
        .from("[data-hero-sub]", { opacity: 0, y: 24, duration: 0.8 }, "-=0.6")
        .from("[data-hero-cta]", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, "-=0.5")
        .from("[data-hero-trust]", { opacity: 0, y: 16, duration: 0.6, stagger: 0.06 }, "-=0.4")
        .from(
          "[data-hero-stage-in]",
          { opacity: 0, scale: 0.88, duration: 1.6, ease: "power3.out" },
          "-=1.4",
        )
        .from("[data-hero-hud]", { opacity: 0, x: -20, duration: 0.8 }, "-=0.9");

      if (reduced) return;

      // The copy and the orbit chips clear out of the way early, leaving the
      // anatomy sequence the whole stage.
      gsap.to("[data-hero-copy]", {
        yPercent: -12,
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "18% top", scrub: true },
      });
      gsap.to("[data-orbit-stage]", {
        opacity: 0,
        scale: 0.92,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "14% top", scrub: true },
      });
      gsap.to("[data-hero-hud]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "70% top", end: "bottom bottom", scrub: true },
      });
      gsap.to(cueRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "8% top", scrub: true },
      });
    },
    { scope: root, dependencies: [loaded] },
  );

  const current = phase >= 0 ? PHASES[phase] : null;

  return (
    // Tall section, sticky viewport: the extra height is the runway the chest
    // sequence scrubs along.
    <section ref={root} id="hero" className="relative h-[320svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* radiology light-box grid */}
        <div aria-hidden className="scan-grid pointer-events-none absolute inset-0 -z-10" />

        {/* WebGL anatomy stage */}
        <div
          data-hero-stage
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[62%]"
        >
          <div data-hero-stage-in className="relative h-full w-full">
            <ErrorBoundary>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </ErrorBoundary>
            {/* Left fade keeps the headline legible where it overlaps the stage. */}
            <div
              aria-hidden
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to right, var(--void) 0%, rgba(4,9,12,0.72) 20%, rgba(4,9,12,0.18) 42%, transparent 62%)",
              }}
            />
            <OrbitStage />
          </div>
        </div>

        {/* ── headline copy ── */}
        <div data-hero-copy className="container-edge relative z-30 pt-[var(--nav-h)]">
          <div className="max-w-2xl">
            <span data-hero-eyebrow className="eyebrow">
              <span className="eyebrow-dot is-coral" />
              {DOCTOR.name} · {DOCTOR.title.split("&")[0].trim()}
            </span>

            <h1 className="mt-7 font-display text-display-lg font-semibold text-ink">
              {HEADLINE.map((line, i) => (
                <span key={i} className="line-mask">
                  <span data-hero-line className="block will-reveal">
                    {i === 1 ? <em className="accent-serif text-gradient">{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>

            <p data-hero-sub className="mt-7 max-w-lg text-lg leading-relaxed text-ink-muted">
              Chest, lung and sleep medicine in Bengaluru. {DOCTOR.experienceYears} years of
              pulmonology, lung function testing read on-site, and a diagnosis explained in words
              you actually use.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div data-hero-cta>
                <MagneticButton onClick={() => scrollToId("contact")}>
                  Book an appointment <CalendarCheck className="h-4 w-4" />
                </MagneticButton>
              </div>
              <div data-hero-cta>
                <MagneticButton variant="ghost" onClick={() => scrollToId("services")}>
                  <Activity className="h-4 w-4" /> Explore care
                </MagneticButton>
              </div>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[DOCTOR.credentials, `${DOCTOR.experienceYears} yrs practice`, "3 Bengaluru clinics"].map(
                (item) => (
                  <li
                    data-hero-trust
                    key={item}
                    className="flex items-center gap-2 text-[13px] text-ink-faint"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <VitalsHud />

        {/* ── scroll-phase narration ── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 lg:inset-x-auto lg:bottom-auto lg:right-[clamp(1.25rem,5vw,4rem)] lg:top-1/2 lg:-translate-y-1/2">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.label}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
                className="container-edge lg:w-[360px] lg:px-0"
              >
                <div className="glass-card bg-panel/70 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-[11px] uppercase tracking-[0.28em] text-accent">
                      {current.label}
                    </span>
                    <span className="nums font-display text-xs text-ink-faint">
                      {String(phase + 1).padStart(2, "0")}/{String(PHASES.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">
                    {current.metric}
                  </div>
                  <div className="mt-1 font-display text-sm font-medium text-ink-muted">
                    {current.title}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{current.body}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── right-edge phase ticks ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
        >
          {PHASES.map((ph, i) => (
            <span key={ph.label} className="relative h-10 w-px bg-line">
              <span
                ref={(el) => {
                  tickRefs.current[i] = el;
                }}
                className="absolute inset-0 origin-top scale-y-0 bg-accent"
              />
            </span>
          ))}
        </div>

        {/* ── scroll cue ── */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-display text-[11px] uppercase tracking-[0.3em] text-ink-faint">
            Scroll to look inside
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-line">
            <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
