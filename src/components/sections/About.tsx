import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, BadgeCheck, Languages, GraduationCap } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { DOCTOR, CREDENTIALS } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/env";
import { scrollToId } from "@/hooks/useLenis";
import { useReveal } from "@/hooks/useReveal";
import EcgLine from "@/components/ui/EcgLine";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Line-art clinical portrait. Original artwork rather than stock photography:
 * it draws itself in on reveal, stays on palette, and doesn't put a licensing
 * or a real person's likeness into the build.
 */
function PortraitPlate() {
  const reduced = prefersReducedMotion();

  const draw = (delay: number) =>
    reduced
      ? { pathLength: 1, opacity: 1 }
      : {
          pathLength: 1,
          opacity: 1,
          transition: { pathLength: { duration: 1.6, delay, ease: EASE }, opacity: { duration: 0.2, delay } },
        };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-panel-raised">
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 18%, rgba(45,212,191,0.16), transparent 70%)",
        }}
      />
      <div aria-hidden className="scan-grid pointer-events-none absolute inset-0 opacity-60" />

      <motion.svg
        viewBox="0 0 400 460"
        className="relative w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        role="img"
        aria-label={`Illustrated portrait of ${DOCTOR.fullName}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <g className="text-accent">
          {/* head */}
          <motion.path
            d="M200 96c-30 0-52 22-52 52 0 18 5 33 13 45 8 12 21 21 39 21s31-9 39-21c8-12 13-27 13-45 0-30-22-52-52-52Z"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0) }}
          />
          {/* hair */}
          <motion.path
            d="M146 148c-4-36 22-62 54-62s58 26 54 62c-6-18-24-30-54-30s-48 12-54 30Z"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.15) }}
          />
          <motion.path
            d="M148 140c-14 24-16 54-8 78M252 140c14 24 16 54 8 78"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.3) }}
          />
          {/* neck + shoulders */}
          <motion.path
            d="M180 210v26c0 12-10 18-26 24l-38 16c-24 10-38 32-38 58v34M220 210v26c0 12 10 18 26 24l38 16c24 10 38 32 38 58v34"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.4) }}
          />
          {/* coat lapels */}
          <motion.path
            d="M172 244l28 46 28-46M200 290v78"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.55) }}
          />
          <motion.path
            d="M156 256l-14 112M244 256l14 112"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.65) }}
          />
        </g>

        {/* stethoscope — the one element in vital rose */}
        <g className="text-vital" strokeWidth={2.2}>
          <motion.path
            d="M168 232c-16 16-22 44-14 70 6 20 22 32 40 32s34-12 40-32c8-26 2-54-14-70"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(0.8) }}
          />
          <motion.path
            d="M194 334v34"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(1.0) }}
          />
          <motion.circle
            cx="194"
            cy="382"
            r="14"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: draw(1.1) }}
          />
        </g>
      </motion.svg>

      {/* data plate */}
      <div className="relative border-t border-line bg-void/50 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink">{DOCTOR.fullName}</div>
            <div className="mt-0.5 text-[13px] text-ink-faint">{DOCTOR.credentials}</div>
            <div className="mt-2 text-[12px] leading-snug text-ink-muted">
              {DOCTOR.title}
              <br />
              {DOCTOR.post}, {DOCTOR.institution}
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-accent">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified
          </span>
        </div>
        <div className="nums mt-3 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          {DOCTOR.registration}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const railRef = useRef<HTMLDivElement>(null);

  /* Timeline rail fills as the credential list scrolls past. */
  useGSAP(
    () => {
      if (prefersReducedMotion() || !railRef.current) return;
      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative overflow-hidden py-28">
      <div className="container-edge">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-20">
          {/* ── portrait ── */}
          <div data-reveal className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <PortraitPlate />
          </div>

          {/* ── bio + credentials ── */}
          <div>
            <span data-reveal className="eyebrow">
              <span className="eyebrow-dot" />
              About the doctor
            </span>

            <h2
              data-reveal
              className="mt-5 font-display text-display-sm font-semibold leading-[1.02] text-ink"
            >
              Eighteen years spent listening to{" "}
              <em className="accent-serif text-gradient">lungs.</em>
            </h2>

            <div data-reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-muted">
              <p>
                {DOCTOR.name} is an interventional pulmonologist with an MD in chest medicine, a
                fellowship in clinical cardiology and a diploma in allergy &amp; asthma from CMC
                Vellore. He serves as Associate Professor in the Department of Respiratory Medicine
                at {DOCTOR.institution}, alongside {DOCTOR.experienceYears} years of clinical
                practice in airway, interstitial, infectious and sleep-related disease.
              </p>
              <p>
                The practice is built around one conviction: a patient who understands their own
                lungs takes their treatment more seriously than one who was simply handed a
                prescription. Every consultation ends with the scan on screen and the diagnosis in
                plain language.
              </p>
            </div>

            <blockquote
              data-reveal
              className="mt-10 border-l-2 border-accent pl-6 font-display text-xl font-medium leading-snug text-ink"
            >
              “Breathlessness is never ‘just anxiety’ until the lungs have been properly measured.”
              <footer className="mt-3 text-sm font-normal text-ink-faint">
                — {DOCTOR.name}, {DOCTOR.credentials}
              </footer>
            </blockquote>

            <div data-reveal className="mt-10">
              <EcgLine beats={7} duration={5} className="h-10 opacity-70" />
            </div>

            {/* ── training timeline ── */}
            <div className="mt-12">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  <GraduationCap className="h-4 w-4" /> Training & fellowships
                </h3>
                <button
                  type="button"
                  onClick={() => scrollToId("credentials")}
                  className="group flex items-center gap-1.5 font-display text-[12px] uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80"
                >
                  See the certificates
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="relative mt-8 pl-8">
                {/* rail */}
                <span aria-hidden className="absolute left-[7px] top-1 h-full w-px bg-line" />
                <div
                  ref={railRef}
                  aria-hidden
                  className="absolute left-[7px] top-1 h-full w-px origin-top bg-gradient-primary"
                />

                <ol className="space-y-7">
                  {CREDENTIALS.map((c, i) => (
                    <motion.li
                      key={c.title}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                      className="relative"
                    >
                      <span
                        aria-hidden
                        className="absolute -left-8 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-void"
                      />
                      {c.year && (
                        <div className="nums font-display text-[13px] font-semibold tracking-widest text-accent">
                          {c.year}
                        </div>
                      )}
                      <div className="mt-1 font-display text-lg font-semibold text-ink">
                        {c.title}
                      </div>
                      <div className="text-sm text-ink-muted">{c.place}</div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>

            <div
              data-reveal
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted"
            >
              <span className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-accent" />
                Consults in English & Hindi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
