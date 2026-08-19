import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Phone, Mail, MapPin, ArrowUp, ArrowUpRight, Star } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, isTouchDevice } from "@/lib/env";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { scrollToId } from "@/hooks/useLenis";
import { DOCTOR, CLINICS, GOOGLE, NAV_LINKS, SERVICES, SOCIALS } from "@/lib/content";
import EcgLine from "@/components/ui/EcgLine";

const LINK_TARGET: Record<string, string> = {
  About: "about",
  Services: "services",
  Locations: "locations",
  Contact: "contact",
};

/**
 * Oversized wordmark with a liquid warp — an animated SVG turbulence +
 * displacement filter over a flowing teal gradient, with the displacement scale
 * driven by cursor speed so the type ripples as you move past it.
 */
function LiquidWordmark() {
  const ref = useRef<SVGSVGElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const reduced = prefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      gsap.from(ref.current, {
        yPercent: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%" },
      });

      const disp = dispRef.current;
      if (!disp || isTouchDevice()) return;

      const BASE = 22;
      const st = { scale: BASE, target: BASE };
      let lastX = 0;
      let lastY = 0;
      let lastT = performance.now();

      const tick = () => {
        st.scale += (st.target - st.scale) * 0.12;
        st.target += (BASE - st.target) * 0.06; // decay back towards rest
        disp.setAttribute("scale", st.scale.toFixed(2));
      };
      gsap.ticker.add(tick);

      const onMove = (e: PointerEvent) => {
        const now = performance.now();
        const dt = Math.max(16, now - lastT);
        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;

        const rect = ref.current!.getBoundingClientRect();
        const near =
          e.clientX > rect.left - 120 &&
          e.clientX < rect.right + 120 &&
          e.clientY > rect.top - 120 &&
          e.clientY < rect.bottom + 120;
        if (near) st.target = Math.min(70, st.target + speed * 38);
      };

      window.addEventListener("pointermove", onMove);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 300"
      className="w-full overflow-visible"
      role="img"
      aria-label={DOCTOR.name}
    >
      <defs>
        <linearGradient id="footer-liquid-grad" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#2dd4bf">
            {!reduced && (
              <animate
                attributeName="stop-color"
                values="#2dd4bf;#22d3ee;#0891b2;#2dd4bf"
                dur="9s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="55%" stopColor="#22d3ee">
            {!reduced && (
              <animate
                attributeName="stop-color"
                values="#22d3ee;#0891b2;#2dd4bf;#22d3ee"
                dur="9s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="100%" stopColor="#0891b2">
            {!reduced && (
              <animate
                attributeName="stop-color"
                values="#0891b2;#2dd4bf;#22d3ee;#0891b2"
                dur="9s"
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>

        <filter id="footer-liquid" x="-20%" y="-40%" width="140%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.014"
            numOctaves={2}
            result="noise"
          >
            {!reduced && (
              <animate
                attributeName="baseFrequency"
                dur="16s"
                values="0.008 0.014;0.016 0.02;0.006 0.01;0.008 0.014"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale={reduced ? 0 : 22}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* textLength pins the wordmark to the viewBox regardless of how long the
          practitioner's name is, so it can never overflow or leave a gap. */}
      <text
        x="600"
        y="215"
        textAnchor="middle"
        textLength="1100"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="'Figtree', 'Inter', sans-serif"
        fontWeight={700}
        fontSize="180"
        fill="url(#footer-liquid-grad)"
        filter="url(#footer-liquid)"
      >
        {DOCTOR.name}
      </text>
    </svg>
  );
}

export default function Footer() {
  const linkCursor = useCursorVariant("hover-link");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line bg-void">
      {/* soft glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[50%] w-[70%] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.14), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container-edge relative pt-20">
        {/* ── practice information ── */}
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink">{DOCTOR.fullName}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {DOCTOR.title}
              <br />
              {DOCTOR.post}
            </p>
            <p className="nums mt-4 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {DOCTOR.credentialsLong}
            </p>
            <p className="nums mt-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {DOCTOR.registration}
            </p>
            <div className="mt-6 max-w-[220px]">
              <EcgLine beats={4} duration={3.6} className="h-8 opacity-70" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-ink-faint">
              Clinics
            </h3>
            <ul className="mt-5 space-y-4">
              {CLINICS.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...linkCursor}
                    className="group flex items-start gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-medium text-ink group-hover:text-accent">
                        {c.area}
                      </span>
                      <span className="text-xs">{c.hours}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-ink-faint">
              Care
            </h3>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.name}>
                  <button
                    onClick={() => scrollToId("services")}
                    {...linkCursor}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-ink-faint">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`tel:${DOCTOR.phoneHref}`}
                  {...linkCursor}
                  className="nums flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  {DOCTOR.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${DOCTOR.email}`}
                  {...linkCursor}
                  className="flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  {DOCTOR.email}
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE.review}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...linkCursor}
                  className="group flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
                >
                  <Star className="h-3.5 w-3.5 text-accent" />
                  Review us on Google
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle}`}
                    {...linkCursor}
                    className="group flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    <s.icon className="h-3.5 w-3.5 text-accent" />
                    {s.handle}
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-display text-[11px] uppercase tracking-[0.24em] text-ink-faint">
              Navigate
            </h3>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {NAV_LINKS.map((label) => (
                <li key={label}>
                  <button
                    onClick={() => scrollToId(LINK_TARGET[label] ?? "hero")}
                    {...linkCursor}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── wordmark ── */}
        <div className="border-t border-line pt-12">
          <LiquidWordmark />
        </div>

        {/* ── legal ── */}
        <div className="flex flex-col items-center gap-6 py-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-center text-xs leading-relaxed text-ink-faint md:text-left">
            The information on this site is for general guidance and is not a substitute for a
            consultation, diagnosis, or treatment. In an emergency, call{" "}
            <a
              href="tel:108"
              className="nums text-vital underline decoration-vital/40 underline-offset-2"
            >
              108
            </a>{" "}
            or attend your nearest emergency department.
            <span className="mt-2 block">
              © {new Date().getFullYear()} {DOCTOR.fullName}. All rights reserved.
            </span>
          </p>

          <button
            onClick={() => scrollToId("hero")}
            {...linkCursor}
            className="group flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="border-t border-line py-5 text-center">
          <a
            href="https://flazetech.in"
            target="_blank"
            rel="noopener noreferrer"
            {...linkCursor}
            className="text-xs text-ink-faint transition-colors hover:text-accent"
          >
            Developed by flazetech.in
          </a>
        </div>
      </div>
    </footer>
  );
}
