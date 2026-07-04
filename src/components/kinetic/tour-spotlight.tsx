"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type RefObject, useCallback, useEffect, useState } from "react";

export type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const PAD = 10;

export function useSpotlightRect(
  targetRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) {
      setRect(null);
      return;
    }
    const box = el.getBoundingClientRect();
    setRect({
      top: box.top - PAD,
      left: box.left - PAD,
      width: box.width + PAD * 2,
      height: box.height + PAD * 2,
    });
  }, [targetRef]);

  useEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const interval = window.setInterval(measure, 120);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      window.clearInterval(interval);
    };
  }, [active, measure]);

  return rect;
}

export function TourMask({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]"
      aria-hidden
    />
  );
}

type SpotlightRingProps = {
  rect: SpotlightRect | null;
  active: boolean;
};

export function SpotlightRing({ rect, active }: SpotlightRingProps) {
  if (!active || !rect) return null;

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed z-[82] rounded-lg",
        "ring-1 ring-amber-500/90",
        "shadow-[0_0_24px_rgba(245,158,11,0.35)]",
      )}
      initial={false}
      animate={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 22 }}
    />
  );
}
