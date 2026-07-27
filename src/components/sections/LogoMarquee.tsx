import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Draggable } from "@/lib/gsap";
import { AFFILIATIONS } from "@/lib/content";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { prefersReducedMotion, isTouchDevice } from "@/lib/env";

export default function LogoMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dragCursor = useCursorVariant("drag");

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const half = el.scrollWidth / 2;
      const wrap = gsap.utils.wrap(-half, 0);
      let tween: gsap.core.Tween;

      const startLoop = (fromX: number) => {
        tween?.kill();
        tween = gsap.fromTo(
          el,
          { x: fromX },
          {
            x: fromX - half,
            duration: 26,
            ease: "none",
            repeat: -1,
            modifiers: { x: (x) => `${wrap(parseFloat(x))}px` },
          },
        );
      };

      if (!prefersReducedMotion()) startLoop(0);

      // Draggable strip (no premium InertiaPlugin dependency).
      if (!isTouchDevice()) {
        Draggable.create(el, {
          type: "x",
          inertia: false,
          onPressInit() {
            tween?.pause();
          },
          onDrag() {
            gsap.set(el, { x: wrap(this.x) });
          },
          onDragEnd() {
            if (!prefersReducedMotion()) startLoop(wrap(this.x));
          },
        });
      }
    },
    { scope: root },
  );

  const items = [...AFFILIATIONS, ...AFFILIATIONS];

  return (
    <section className="relative border-y border-line bg-panel/40 py-14">
      <div className="container-edge">
        <p className="mb-8 text-center font-display text-[13px] uppercase tracking-[0.3em] text-ink-faint">
          Affiliations & accreditations
        </p>
      </div>
      <div ref={root} className="overflow-hidden" {...dragCursor}>
        <div
          ref={track}
          className="flex w-max cursor-grab items-center gap-14 px-7 active:cursor-grabbing"
        >
          {items.map((name, i) => (
            <span
              key={i}
              className="shrink-0 select-none font-display text-2xl font-medium tracking-tight text-ink-muted transition-colors hover:text-ink md:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
