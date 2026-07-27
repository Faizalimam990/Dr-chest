import { useId, useMemo } from "react";
import { prefersReducedMotion } from "@/lib/env";

interface Props {
  /** Number of cardiac cycles drawn across the width. */
  beats?: number;
  className?: string;
  /** Seconds for the highlight to travel the full width. */
  duration?: number;
  color?: string;
}

const W = 1200;
const H = 90;

/**
 * Builds one ECG cycle: flat baseline, P wave, the QRS complex, then the T
 * wave. Written as an explicit point list rather than a smooth curve because a
 * real trace has hard corners at the R spike — smoothing it looks wrong.
 */
function cycle(x0: number, w: number): string {
  const mid = H / 2;
  const u = w / 100; // one "unit" of cycle width
  const pt = (dx: number, y: number) => `${(x0 + dx * u).toFixed(2)},${y.toFixed(2)}`;
  return [
    pt(0, mid),
    pt(14, mid),
    pt(19, mid - 7), // P wave
    pt(24, mid),
    pt(32, mid),
    pt(35, mid + 5), // Q
    pt(39, mid - 34), // R spike
    pt(43, mid + 13), // S
    pt(47, mid),
    pt(58, mid),
    pt(66, mid - 11), // T wave
    pt(74, mid),
    pt(100, mid),
  ].join(" ");
}

/**
 * Looping ECG trace used as a section divider and as the hero's vitals strip.
 * A dim full-width trace sits under a short bright dash that sweeps across it,
 * so the line reads as a live monitor rather than a static illustration.
 */
export default function EcgLine({
  beats = 6,
  className = "",
  duration = 4,
  color = "var(--vital)",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const reduced = prefersReducedMotion();

  const points = useMemo(() => {
    const beatW = W / beats;
    return Array.from({ length: beats }, (_, i) => cycle(i * beatW, beatW)).join(" ");
  }, [beats]);

  // A short dash the length of one beat, chased by a long gap.
  const dash = W / beats / 1.6;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`w-full overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`ecg-fade-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="12%" stopColor={color} stopOpacity="0.55" />
          <stop offset="88%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Resting trace. */}
      <polyline
        points={points}
        fill="none"
        stroke={`url(#ecg-fade-${uid})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* Live sweep. */}
      {!reduced && (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${dash} ${W}`,
            filter: `drop-shadow(0 0 6px ${color})`,
            animation: `ecg-run-${uid} ${duration}s linear infinite`,
          }}
        />
      )}

      <style>{`@keyframes ecg-run-${uid}{from{stroke-dashoffset:${W + dash}}to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}
