"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useSaves } from "@/context/saves-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";

export function EditorialHeaderActions() {
  const { selectedProperty } = useAppPhase();
  const { isSaved, toggleSave } = useSaves();
  const liked = isSaved(selectedProperty.id);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({
        title: selectedProperty.name,
        text: selectedProperty.tagline,
        url,
      });
    }
  };

  return (
    <div className="mb-8 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share listing"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-800"
      >
        <Share2 className="h-[17px] w-[17px] stroke-[1.5]" />
      </button>
      <motion.button
        type="button"
        onClick={() => toggleSave(selectedProperty.id)}
        aria-label={liked ? "Remove from saves" : "Save listing"}
        aria-pressed={liked}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border transition",
          liked
            ? "border-neutral-900 bg-neutral-900 text-white animate-pulse"
            : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800",
        )}
      >
        <Heart
          className={cn("h-[17px] w-[17px]", liked && "fill-current")}
          strokeWidth={1.5}
        />
      </motion.button>
    </div>
  );
}
