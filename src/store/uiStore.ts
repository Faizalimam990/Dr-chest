import { create } from "zustand";

export type CursorVariant =
  | "default"
  | "hover-link"
  | "hover-magnetic"
  | "hover-view"
  | "drag";

interface UIState {
  /* Custom cursor */
  cursorVariant: CursorVariant;
  cursorLabel: string;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;

  /* Preloader */
  progress: number;
  setProgress: (v: number) => void;
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  /* Navigation */
  activeSection: string;
  setActiveSection: (id: string) => void;
  megaMenuOpen: boolean;
  setMegaMenuOpen: (v: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  scrolled: boolean;
  setScrolled: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cursorVariant: "default",
  cursorLabel: "",
  setCursor: (cursorVariant, cursorLabel = "") => set({ cursorVariant, cursorLabel }),
  resetCursor: () => set({ cursorVariant: "default", cursorLabel: "" }),

  progress: 0,
  setProgress: (progress) => set({ progress }),
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),

  activeSection: "hero",
  setActiveSection: (activeSection) => set({ activeSection }),
  megaMenuOpen: false,
  setMegaMenuOpen: (megaMenuOpen) => set({ megaMenuOpen }),
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  scrolled: false,
  setScrolled: (scrolled) => set({ scrolled }),
}));
