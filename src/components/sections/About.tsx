import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Clock,
  GraduationCap,
  Languages,
  MapPin,
  Phone,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { CLINICS, CREDENTIALS, DOCTOR, EXPERIENCE } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/env";
import { scrollToId } from "@/hooks/useLenis";
import { useReveal } from "@/hooks/useReveal";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import EcgLine from "@/components/ui/EcgLine";
import ClinicalPhoto from "@/components/ui/ClinicalPhoto";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The practitioner's own photograph over a data plate carrying the billing.
 * The grading lives in ClinicalPhoto so this frame matches the other clinic
 * photographs on the page.
 */
function PortraitPlate() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-panel-raised">
      <ClinicalPhoto
        src="/doctor/portrait.jpg"
        alt={`${DOCTOR.fullName}, ${DOCTOR.title}`}
        width={738}
        height={1033}
        aspect="aspect-[5/7]"
        position="object-top"
      />

      {/* data plate */}
      <div className="relative border-t border-line bg-void/50 px-5 py-5 backdrop-blur-sm sm:px-6">
        {/* The badge sits beside the name only where there is room for it. */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink">{DOCTOR.fullName}</div>
            <div className="mt-0.5 text-[13px] text-ink-faint">{DOCTOR.credentials}</div>
            <div className="mt-2 text-[12px] leading-snug text-ink-muted">
              {DOCTOR.title}
              <br />
              {DOCTOR.post}
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-accent">
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
  const linkCursor = useCursorVariant("hover-link");
  const clinic = CLINICS[0];

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
          {/*
            ── portrait rail ──
            The grid is items-start, so this column shrink-wraps its content
            rather than tracking the much longer bio beside it. It carries the
            photographs and the booking card so the space stays worked rather
            than running blank down the left of the timeline.
          */}
          <div data-reveal className="flex flex-col gap-4">
            <PortraitPlate />

            {/* ── at work ── */}
            <figure className="overflow-hidden rounded-3xl border border-line bg-panel-raised">
              <ClinicalPhoto
                src="/doctor/bronchoscopy-suite.webp"
                alt={`${DOCTOR.name} holding a flexible bronchoscope in the procedure room, patient vitals on the monitor beside him`}
                width={1080}
                height={514}
                aspect="aspect-[21/10]"
              />
              <figcaption className="border-t border-line bg-void/50 px-5 py-4 backdrop-blur-sm">
                <span className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">
                  In the procedure room
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-muted">
                  Flexible bronchoscopy under continuous monitoring — the airway looked at directly
                  rather than inferred from a scan.
                </span>
              </figcaption>
            </figure>

            {/* ── booking rail ── */}
            <div className="glass-card p-6">
              <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-ink-faint">
                Consulting
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li className="flex items-start gap-2.5 text-ink-muted">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {clinic.hours}
                </li>
                <li className="flex items-start gap-2.5 text-ink-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {clinic.area}
                </li>
                <li>
                  <a
                    href={`tel:${DOCTOR.phoneHref}`}
                    {...linkCursor}
                    className="flex items-start gap-2.5 text-ink transition-colors hover:text-accent"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="nums font-medium">{DOCTOR.phone}</span>
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <MagneticButton onClick={() => scrollToId("contact")}>
                  Book an appointment <CalendarCheck className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>
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
                Vellore. He serves as Associate Professor in the Department of Respiratory Medicine,
                alongside {DOCTOR.experienceYears} years of clinical practice in airway,
                interstitial, infectious and sleep-related disease. That
                practice was built across Delhi's tertiary chest services — LRS (NITRD), Maulana
                Azad Medical College, Fortis Vasant Kunj and Max Saket.
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

            {/* ── hospitals worked at ── */}
            <div className="mt-14">
              <h3
                data-reveal
                className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink-faint"
              >
                <Building2 className="h-4 w-4" /> Hospital experience
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {EXPERIENCE.map((p, i) => (
                  <motion.li
                    key={p.hospital}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                    className="rounded-2xl border border-line bg-panel-raised/50 px-5 py-4"
                  >
                    <div className="font-display text-[15px] font-semibold leading-snug text-ink">
                      {p.hospital}
                    </div>
                    <div className="mt-1 text-[13px] text-ink-faint">{p.city}</div>
                  </motion.li>
                ))}
              </ul>
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
