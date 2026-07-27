import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MEGA_MENU } from "@/lib/content";
import { useCursorVariant } from "@/hooks/useCursorVariant";

const container = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function MegaMenu() {
  const linkCursor = useCursorVariant("hover-link");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute left-1/2 top-full w-[min(960px,92vw)] -translate-x-1/2 pt-4"
    >
      <div className="glass-card overflow-hidden bg-panel/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {MEGA_MENU.map((col) => (
            <motion.div key={col.title} variants={item}>
              <h4 className="mb-4 font-display text-[13px] uppercase tracking-widest text-ink-faint">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#services"
                      {...linkCursor}
                      className="group flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      <span>{link}</span>
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={item}
          className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[rgba(45,212,191,0.07)] px-6 py-4"
        >
          <p className="text-sm text-ink-muted">
            <span className="text-ink">Not sure which you need?</span> Describe your symptoms and the
            clinic will advise.
          </p>
          <a
            href="#contact"
            {...linkCursor}
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent"
          >
            Book a consultation <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
