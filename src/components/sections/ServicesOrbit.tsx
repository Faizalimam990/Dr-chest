import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { SERVICES } from "@/lib/content";
import { prefersReducedMotion, isTouchDevice } from "@/lib/env";
import { useReveal } from "@/hooks/useReveal";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { scrollToId } from "@/hooks/useLenis";

const N = SERVICES.length;
const STEP = (Math.PI * 2) / N;
const FOCUS = Math.PI / 2; // the active node sits at the bottom of the ring

/**
 * Radial service selector: each service rides a circle, whichever node reaches
 * the bottom "focus" point becomes active and expands in the centre. It
 * auto-rotates, can be spun like a knob, and clicking a node snaps it forward.
 */
export default function ServicesOrbit() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const dragCursor = useCursorVariant("drag");

  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Animation state lives in refs so the rAF loop never triggers a re-render.
  const rot = useRef(-FOCUS);
  const vel = useRef(0);
  const dragging = useRef(false);
  const snapTarget = useRef<number | null>(null);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const reduced = prefersReducedMotion();

      const norm = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

      const layout = () => {
        const R = stage.clientWidth * 0.4;
        let bestProx = -Infinity;
        let bestIdx = 0;

        nodeRefs.current.forEach((el, i) => {
          if (!el) return;
          const a = i * STEP + rot.current;
          const prox = Math.sin(a); // 1 at focus (bottom), -1 opposite
          const depth = (prox + 1) / 2;
          el.style.transform = `translate(-50%, -50%) translate(${Math.cos(a) * R}px, ${
            Math.sin(a) * R
          }px) scale(${(0.72 + depth * 0.5).toFixed(3)})`;
          el.style.zIndex = String(Math.round(depth * 10));
          el.style.opacity = (0.45 + depth * 0.55).toFixed(3);
          if (prox > bestProx) {
            bestProx = prox;
            bestIdx = i;
          }
        });

        if (bestIdx !== activeRef.current) {
          activeRef.current = bestIdx;
          setActive(bestIdx);
        }
      };

      const tick = () => {
        if (!dragging.current) {
          if (snapTarget.current !== null) {
            const d = snapTarget.current - rot.current;
            rot.current += d * 0.12;
            if (Math.abs(d) < 0.001) {
              rot.current = snapTarget.current;
              snapTarget.current = null;
            }
          } else if (!reduced) {
            rot.current += vel.current;
            vel.current *= 0.94; // inertia decay after a throw
            rot.current += 0.0026; // steady drift, ~one service every 5s
          }
        }
        layout();
      };

      gsap.ticker.add(tick);

      // Knob-style drag to spin.
      let lastAngle = 0;
      const angleAt = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      };
      const onDown = (e: PointerEvent) => {
        if (isTouchDevice() && Math.abs(e.movementY) > Math.abs(e.movementX)) return;
        dragging.current = true;
        snapTarget.current = null;
        lastAngle = angleAt(e);
        vel.current = 0;
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging.current) return;
        const a = angleAt(e);
        const d = norm(a - lastAngle);
        rot.current += d;
        vel.current = d;
        lastAngle = a;
      };
      const onUp = () => {
        dragging.current = false;
      };

      stage.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);

      return () => {
        gsap.ticker.remove(tick);
        stage.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
    },
    { scope: root },
  );

  /** Click a node → ease it round to the focus point. */
  const selectNode = (i: number) => {
    let target = FOCUS - i * STEP;
    while (target - rot.current > Math.PI) target -= Math.PI * 2;
    while (target - rot.current < -Math.PI) target += Math.PI * 2;
    snapTarget.current = target;
    vel.current = 0;
  };

  const cur = SERVICES[active];
  const CurIcon = cur.icon;

  return (
    <section ref={root} id="services" className="relative overflow-hidden py-24">
      <div className="container-edge">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span data-reveal className="eyebrow">
              <span className="eyebrow-dot" />
              Clinical services
            </span>
            <h2 data-reveal className="mt-5 font-display text-display-md font-semibold text-ink">
              Chest care, <em className="accent-serif text-gradient">end to end.</em>
            </h2>
          </div>
          <p data-reveal className="max-w-xs text-sm text-ink-faint">
            Spin the wheel · tap a service to bring it into focus.
          </p>
        </div>

        {/* Radial wheel */}
        <div
          ref={stageRef}
          {...dragCursor}
          className="relative mx-auto aspect-square w-[min(680px,92vw)] cursor-grab select-none active:cursor-grabbing"
          data-reveal
        >
          {/* orbit ring */}
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full border border-accent/20" />

          {/* centre detail */}
          <div className="absolute left-1/2 top-1/2 flex w-[48%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-[rgba(45,212,191,0.08)] text-accent">
                  <CurIcon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="mt-4 block font-display text-xs font-medium tracking-[0.3em] text-accent">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
                  {cur.name}
                </h3>
                <p className="mx-auto mt-3 max-w-[17rem] text-sm leading-relaxed text-ink-muted">
                  {cur.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* nodes */}
          {SERVICES.map((s, i) => {
            const isActive = i === active;
            const Icon = s.icon;
            return (
              <button
                key={s.name}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                onClick={() => selectNode(i)}
                aria-pressed={isActive}
                className={`absolute left-1/2 top-1/2 flex aspect-square w-[23%] flex-col items-center justify-center gap-1.5 rounded-full border p-3 text-center transition-colors duration-500 ${
                  isActive
                    ? "border-transparent bg-accent text-void shadow-[0_0_60px_-8px_var(--accent)]"
                    : "border-line bg-panel-raised text-ink"
                }`}
              >
                <Icon
                  className={`h-4 w-4 md:h-5 md:w-5 ${isActive ? "text-void" : "text-accent"}`}
                  strokeWidth={1.8}
                />
                <span
                  className={`font-display text-[10px] font-semibold leading-tight md:text-[13px] ${
                    isActive ? "text-void" : "text-ink-muted"
                  }`}
                >
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => scrollToId("contact")}
            className="inline-flex items-center gap-2 font-medium text-ink transition-colors hover:text-accent"
          >
            Book this consultation <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
