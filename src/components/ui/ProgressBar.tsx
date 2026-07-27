import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/** Fixed top scroll-progress bar tracking total page scroll. */
export default function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.to(ref.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent" aria-hidden>
      <div
        ref={ref}
        className="h-full w-full origin-left bg-gradient-primary"
        style={{ backgroundSize: "100% 100%" }}
      />
    </div>
  );
}
