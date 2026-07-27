/** Shared environment probes. All guard against SSR even though this is a client SPA. */

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/** True when we should run the full motion/cursor experience. */
export const canAnimate = (): boolean => !prefersReducedMotion();

/** Small screens get a simplified (or disabled) WebGL scene. */
export const isSmallScreen = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
