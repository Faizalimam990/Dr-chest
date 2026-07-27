import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/store/uiStore";
import { prefersReducedMotion } from "@/lib/env";
import { DOCTOR } from "@/lib/content";
import EcgLine from "@/components/ui/EcgLine";

const SESSION_KEY = "dranya_preloaded";

/**
 * Full-screen loader: a big number counts 0→100 tied to real font + window
 * load progress (the WebGL scene reports in via the store), over a live ECG
 * trace. Exits with a staggered multi-panel vertical wipe. Once per session.
 */
export default function Preloader() {
  const setLoaded = useUIStore((s) => s.setLoaded);
  const threeProgress = useUIStore((s) => s.progress);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const shown = useRef(0); // eased displayed value

  // Real load signals → target %.
  const fontsReady = useRef(false);
  const windowLoaded = useRef(false);

  useEffect(() => {
    // Skip entirely if already shown this session.
    if (sessionStorage.getItem(SESSION_KEY)) {
      setLoaded(true);
      setDone(true);
      return;
    }

    let raf = 0;
    const start = performance.now();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => (fontsReady.current = true));
    } else {
      fontsReady.current = true;
    }

    const onLoad = () => (windowLoaded.current = true);
    if (document.readyState === "complete") windowLoaded.current = true;
    else window.addEventListener("load", onLoad);

    const tick = (now: number) => {
      const elapsed = now - start;
      // Compose real signals, floor by a gentle time curve so it always moves.
      let t = 0;
      t += fontsReady.current ? 35 : 0;
      t += windowLoaded.current ? 35 : 0;
      t += Math.min(threeProgress, 100) * 0.3; // Three.js weight (0..30)
      const timeFloor = Math.min(96, (elapsed / 1300) * 100);
      target.current = Math.max(t, timeFloor);
      // Hard fallback so it stays snappy.
      if (elapsed > 2000) target.current = 100;
      if (fontsReady.current && windowLoaded.current) target.current = 100;

      shown.current += (target.current - shown.current) * 0.18;
      const display = Math.round(shown.current);
      setCount(display);

      if (display >= 100) {
        setCount(100);
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const exit = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      if (prefersReducedMotion()) {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          onComplete: finish,
        });
        return;
      }
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(numberRef.current, { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" })
        .to(barRef.current, { autoAlpha: 0, duration: 0.3 }, "<")
        .to(
          ".preloader-panel",
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.8,
            ease: "power4.inOut",
            stagger: 0.08,
          },
          "-=0.1",
        );
    };

    const finish = () => {
      setLoaded(true);
      setDone(true);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[1000]" aria-hidden>
      {/* Wipe panels sit above the content layer. */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="preloader-panel h-full flex-1 bg-void" />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Live trace behind the counter. */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-40">
          <EcgLine beats={9} duration={2.6} className="h-40" />
        </div>

        <div
          ref={numberRef}
          className="nums relative font-display text-[clamp(4rem,18vw,12rem)] font-semibold leading-none text-gradient"
        >
          {String(count).padStart(2, "0")}
        </div>
        <div
          ref={barRef}
          className="relative mt-6 h-[3px] w-[min(340px,70vw)] overflow-hidden rounded-full bg-[rgba(234,246,248,0.08)]"
        >
          <div
            className="h-full bg-gradient-primary transition-[width] duration-150 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>
        <div className="relative mt-5 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.26em] text-ink-faint sm:text-xs sm:tracking-[0.4em]">
          {DOCTOR.shortName} · Chest & Lung Clinic
        </div>
      </div>
    </div>
  );
}
