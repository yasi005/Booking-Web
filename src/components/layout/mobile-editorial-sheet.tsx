"use client";

import { EditorialPanel } from "@/components/editorial/editorial-panel";
import { useAppPhase } from "@/context/app-phase-context";
import { useLocale } from "@/context/locale-context";
import { getLocationDisplay, getPropertyName } from "@/lib/localized-property";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

export function MobileEditorialSheet() {
  const { selectedProperty } = useAppPhase();
  const { locale } = useLocale();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-40 lg:hidden">
      <motion.div
        layout
        className={cn(
          "pointer-events-auto mx-3 overflow-hidden rounded-t-[24px] border border-neutral-200/80 bg-white shadow-[0_-20px_60px_-24px_rgba(0,0,0,0.25)]",
          expanded ? "h-[min(72vh,640px)]" : "h-auto",
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left"
          aria-expanded={expanded}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] tracking-[0.18em] text-neutral-400 uppercase">
              {getLocationDisplay(selectedProperty, locale)}
            </p>
            <p className="truncate font-serif text-lg text-neutral-900">
              {getPropertyName(selectedProperty, locale)}
            </p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
            <ChevronUp
              className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
            />
          </span>
        </button>

        {expanded && (
          <div className="h-[calc(100%-4.25rem)] overflow-hidden">
            <EditorialPanel />
          </div>
        )}
      </motion.div>
    </div>
  );
}
