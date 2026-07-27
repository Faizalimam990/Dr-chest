import { useMemo } from "react";
import { useUIStore, type CursorVariant } from "@/store/uiStore";

/**
 * Returns mouse handlers that switch the custom cursor variant on hover and
 * reset it on leave. Spread onto any element:
 *   <a {...useCursorVariant("hover-link")}>…</a>
 */
export function useCursorVariant(variant: CursorVariant, label = "") {
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  return useMemo(
    () => ({
      onMouseEnter: () => setCursor(variant, label),
      onMouseLeave: () => resetCursor(),
    }),
    [variant, label, setCursor, resetCursor],
  );
}
