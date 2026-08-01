import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CERTIFICATES, type Certificate } from "@/lib/content";
import { prefersReducedMotion, isSmallScreen } from "@/lib/env";
import { useCursorVariant } from "@/hooks/useCursorVariant";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardSrc = (c: Certificate) => `/certificates/${c.slug}-card.jpg`;
const fullSrc = (c: Certificate) => `/certificates/${c.slug}.jpg`;
const caption = (c: Certificate) => `${c.title} — ${c.issuer}, ${c.year}`;

/** Stops the page scrolling underneath the lightbox, Lenis included. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    const prev = document.body.style.overflow;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/**
 * Full-frame reader for one certificate. Arrow keys and the side buttons walk
 * the wall; Escape closes. The neighbours are warmed in the background so
 * stepping through doesn't flash an empty frame.
 */
function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const cert = CERTIFICATES[index];
  const [ready, setReady] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useScrollLock(true);

  useEffect(() => {
    setReady(false);
    const total = CERTIFICATES.length;
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = fullSrc(CERTIFICATES[(index + d + total) % total]);
    });
  }, [index]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate ${index + 1} of ${CERTIFICATES.length}: ${cert.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[160] flex flex-col bg-void/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1rem,3vw,2rem)]">
        <span className="nums font-display text-[11px] uppercase tracking-[0.28em] text-ink-faint">
          {String(index + 1).padStart(2, "0")} / {String(CERTIFICATES.length).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-panel-raised/80 text-ink transition-colors hover:border-accent/60 hover:text-accent"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center gap-3 px-[clamp(1rem,4vw,2.5rem)] py-6 sm:gap-6">
        <button
          type="button"
          aria-label="Previous certificate"
          onClick={(e) => {
            e.stopPropagation();
            onStep(-1);
          }}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-panel-raised/80 text-ink transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.figure
            key={cert.slug}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex min-h-0 max-w-[min(1100px,100%)] flex-col items-center"
          >
            <div className="relative flex min-h-0 items-center justify-center rounded-2xl border border-line bg-panel p-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:p-3">
              {!ready && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-line border-t-accent"
                />
              )}
              <img
                src={fullSrc(cert)}
                alt={caption(cert)}
                onLoad={() => setReady(true)}
                onError={() => setReady(true)}
                className={`max-h-[62vh] w-auto max-w-full rounded-lg object-contain transition-opacity duration-300 ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            <figcaption className="mt-5 max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3 font-display text-[11px] uppercase tracking-[0.24em] text-accent">
                {cert.tag}
                {cert.year && <span className="nums text-ink-faint">{cert.year}</span>}
              </div>
              <div className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                {cert.title}
              </div>
              <div className="mt-1 text-sm text-ink-muted">{cert.issuer}</div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          type="button"
          aria-label="Next certificate"
          onClick={(e) => {
            e.stopPropagation();
            onStep(1);
          }}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-panel-raised/80 text-ink transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * The certificate wall, laid out along a giant wheel that counter-rotates with
 * scroll — the framed record rides the arc while the statement type stays fixed
 * behind it. Any card opens the full certificate.
 */
export default function CredentialWall() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const viewCursor = useCursorVariant("hover-view", "View");
  const [open, setOpen] = useState<number | null>(null);

  const small = isSmallScreen();
  const R = small ? 980 : 1320;
  const D = R * 2;
  const cardW = small ? 156 : 254;
  const SPREAD = 74; // degrees each side of bottom dead centre
  const step = (SPREAD * 2) / (CERTIFICATES.length - 1);

  const onStep = useCallback(
    (delta: number) =>
      setOpen((i) =>
        i === null ? i : (i + delta + CERTIFICATES.length) % CERTIFICATES.length,
      ),
    [],
  );

  useGSAP(
    () => {
      if (!wheel.current) return;
      if (prefersReducedMotion()) {
        gsap.set(wheel.current, { rotation: 0 });
        return;
      }
      gsap.fromTo(
        wheel.current,
        { rotation: 34 },
        {
          rotation: -34,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: section },
  );

  return (
    <section ref={section} id="credentials" className="relative h-[240vh] bg-panel">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Statement type behind the wheel. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
          <span className="eyebrow pointer-events-auto">
            <span className="eyebrow-dot" />
            Credentials & training
          </span>
          <h2 className="mt-6 font-display text-[clamp(3rem,13vw,11rem)] font-semibold leading-[0.85] tracking-tight text-ink">
            TRAINED
          </h2>
          <p className="my-4 max-w-md text-center text-sm uppercase tracking-widest text-ink-faint">
            Degrees, council registration, fellowships and hands-on course certification
          </p>
          <h2 className="font-display text-[clamp(3rem,13vw,11rem)] font-semibold leading-[0.85] tracking-tight text-ink">
            CERTIFIED
          </h2>
        </div>

        {/* Rotating arc of framed certificates. */}
        <div
          ref={wheel}
          className="absolute left-1/2 z-10"
          style={{
            width: D,
            height: D,
            marginLeft: -R,
            top: `calc(90vh - ${D}px)`,
            willChange: "transform",
          }}
        >
          {CERTIFICATES.map((c, i) => {
            const phi = -SPREAD + i * step;
            return (
              <button
                key={c.slug}
                {...viewCursor}
                onClick={() => setOpen(i)}
                aria-label={`View certificate: ${caption(c)}`}
                className="group absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-line bg-panel-raised text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-colors duration-300 hover:border-accent/50"
                style={{
                  width: cardW,
                  height: cardW * 1.34,
                  marginLeft: -cardW / 2,
                  marginTop: (-cardW * 1.34) / 2,
                  transform: `rotate(${phi}deg) translateY(${R}px)`,
                }}
              >
                {/* the certificate itself */}
                <div className="relative h-[62%] w-full overflow-hidden bg-void">
                  <img
                    src={cardSrc(c)}
                    alt={caption(c)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(4,9,12,0) 45%, rgba(4,9,12,0.55) 100%)",
                    }}
                  />
                  <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/25 bg-void/60 text-ink backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* the label plate */}
                <div className="flex h-[38%] flex-col justify-center gap-1 px-3.5 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-[9px] uppercase tracking-[0.18em] text-accent">
                      {c.tag}
                    </span>
                    <span className="nums font-display text-[10px] text-ink-faint">{c.year}</span>
                  </div>
                  <div className="line-clamp-2 font-display text-[13px] font-semibold leading-tight text-ink md:text-[15px]">
                    {c.title}
                  </div>
                  <div className="line-clamp-1 hidden text-[11px] text-ink-muted md:block">
                    {c.issuer}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Portalled so no transformed / clipped ancestor can trap the overlay. */}
      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <Lightbox index={open} onClose={() => setOpen(null)} onStep={onStep} />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
