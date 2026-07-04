"use client";

import { TOUR_COPY, type TourStep } from "@/lib/kinetic-tour";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { SpotlightRect } from "@/components/kinetic/tour-spotlight";

type TourTooltipProps = {
  step: TourStep;
  rect: SpotlightRect | null;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
};

export function TourTooltip({
  step,
  rect,
  onNext,
  onSkip,
  isLast,
}: TourTooltipProps) {
  const copy = TOUR_COPY[step];

  const top = rect ? rect.top + rect.height + 16 : undefined;
  const left = rect ? Math.max(16, rect.left) : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
        className={cn(
          "fixed z-[83] w-[min(100vw-2rem,360px)] rounded-lg border border-[#242424] bg-[#141414] p-5",
          "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",
          !rect && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        )}
        style={rect ? { top, left } : undefined}
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500">
          Step {step} of 4 · {copy.title}
        </p>
        <p className="mt-3 font-mono text-[13px] leading-relaxed text-neutral-300">
          {copy.body}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[11px] text-neutral-500 transition hover:text-neutral-300"
          >
            Skip tour
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-[#242424] bg-[#1a1a1a] px-4 py-2 font-mono text-[11px] text-amber-400 transition hover:border-amber-500/40 hover:bg-[#222]"
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
