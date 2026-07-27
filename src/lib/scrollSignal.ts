/**
 * Mutable scroll signals shared between GSAP ScrollTrigger (which writes) and
 * the react-three-fiber render loop (which reads).
 *
 * Deliberately a plain module object rather than React state: the hero's
 * anatomy sequence updates every scroll frame, and routing that through a
 * setState would re-render the whole tree 60 times a second.
 */
export const heroScroll = {
  /** 0 → 1 across the pinned hero. */
  value: 0,
};

/** Clamp to the 0–1 range. */
export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Hermite ease between two edges — the workhorse for phase envelopes. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
