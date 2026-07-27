import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CONDITIONS, type Condition } from "@/lib/content";
import { prefersReducedMotion, isSmallScreen } from "@/lib/env";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { scrollToId } from "@/hooks/useLenis";

const THEME: Record<Condition["theme"], { bg: string; fg: string; sub: string }> = {
  dark: { bg: "linear-gradient(160deg,#0f1a21,#070f14)", fg: "#eaf6f8", sub: "#93a8b1" },
  raised: { bg: "linear-gradient(160deg,#16242c,#0c161c)", fg: "#eaf6f8", sub: "#93a8b1" },
  accent: { bg: "linear-gradient(160deg,#2dd4bf,#0891b2)", fg: "#04090c", sub: "#04333a" },
  light: { bg: "linear-gradient(160deg,#e6f1f3,#c8dde1)", fg: "#04090c", sub: "#3d5a63" },
  plum: { bg: "linear-gradient(160deg,#3a1f2d,#24131c)", fg: "#eaf6f8", sub: "#d8a8b6" },
  steel: { bg: "linear-gradient(160deg,#152430,#0a141c)", fg: "#eaf6f8", sub: "#8fb2c4" },
};

/**
 * Conditions treated, laid out along a giant wheel that counter-rotates with
 * scroll — the cards ride the arc while the statement type stays fixed behind.
 */
export default function ConditionsArc() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const viewCursor = useCursorVariant("hover-view");

  const small = isSmallScreen();
  const R = small ? 980 : 1320;
  const D = R * 2;
  const cardW = small ? 150 : 250;
  const SPREAD = 72; // degrees each side of bottom dead centre
  const step = (SPREAD * 2) / (CONDITIONS.length - 1);

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
    <section ref={section} id="conditions" className="relative h-[240vh] bg-panel">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Statement type behind the wheel. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
          <span className="eyebrow pointer-events-auto">
            <span className="eyebrow-dot" />
            Conditions treated
          </span>
          <h2 className="mt-6 font-display text-[clamp(3rem,13vw,11rem)] font-semibold leading-[0.85] tracking-tight text-ink/90">
            BREATHE
          </h2>
          <p className="my-4 max-w-sm text-center text-sm uppercase tracking-widest text-ink-faint">
            Airway, interstitial, infectious and sleep-related disease
          </p>
          <h2 className="font-display text-[clamp(3rem,13vw,11rem)] font-semibold leading-[0.85] tracking-tight text-ink/90">
            BETTER
          </h2>
        </div>

        {/* Rotating arc of condition cards. */}
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
          {CONDITIONS.map((c, i) => {
            const phi = -SPREAD + i * step;
            const th = THEME[c.theme];
            return (
              <button
                key={c.title}
                {...viewCursor}
                onClick={() => scrollToId("services")}
                aria-label={`${c.title} — see related services`}
                className="group absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-line text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                style={{
                  width: cardW,
                  height: cardW * 1.3,
                  marginLeft: -cardW / 2,
                  marginTop: (-cardW * 1.3) / 2,
                  transform: `rotate(${phi}deg) translateY(${R}px)`,
                  background: th.bg,
                }}
              >
                <div className="flex h-full flex-col justify-between p-4" style={{ color: th.fg }}>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-[10px] uppercase tracking-widest"
                      style={{ color: th.sub }}
                    >
                      {c.tag}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <div className="font-display text-2xl font-semibold leading-none tracking-tight md:text-3xl">
                    {c.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
