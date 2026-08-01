import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { STATS } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/env";

function format(v: number, decimals = 0): string {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-stat]");
      const reduced = prefersReducedMotion();

      items.forEach((item, i) => {
        const valueEl = item.querySelector<HTMLElement>("[data-stat-num]")!;
        const target = Number(item.dataset.value);
        const decimals = Number(item.dataset.decimals || 0);
        const obj = { n: 0 };

        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" },
          })
          .from(item, { opacity: 0, y: 30, duration: 0.6, delay: i * 0.1 })
          .to(
            obj,
            {
              n: target,
              duration: reduced ? 0 : 1.8,
              ease: "power2.out",
              onUpdate: () => {
                valueEl.textContent = format(obj.n, decimals);
              },
            },
            "<",
          );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-24">
      <div className="container-edge">
        <div className="mb-14 max-w-2xl">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Track record
          </span>
          <h2 className="mt-5 font-display text-display-sm font-semibold text-ink">
            Experience you can <em className="accent-serif text-gradient">count.</em>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              data-stat
              data-value={s.value}
              data-decimals={s.decimals ?? 0}
              className="min-w-0 border-l border-line pl-4 sm:pl-6"
            >
              {/* Two columns on a phone: "12,000+" has to fit ~150px. */}
              <div className="flex items-baseline font-display text-[clamp(1.85rem,8.5vw,3.75rem)] font-semibold text-gradient">
                <span data-stat-num>0</span>
                <span>{s.suffix}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
