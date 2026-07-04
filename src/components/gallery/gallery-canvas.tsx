"use client";

import { vibeOverlays, useVibe } from "@/context/vibe-context";
import { useAppPhase } from "@/context/app-phase-context";
import { useCanvasFocus } from "@/context/canvas-focus-context";
import { cn, formatCurrency } from "@/lib/utils";
import { getAnchorRate } from "@/lib/property-utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80";

export function GalleryCanvas() {
  const { selectedProperty } = useAppPhase();
  const { vibe, setVibe } = useVibe();
  const { focusedRoom } = useCanvasFocus();
  const overlay = vibeOverlays[vibe];
  const rate = getAnchorRate(selectedProperty);
  const [failedPropertyId, setFailedPropertyId] = useState<string | null>(null);
  const imageSrc =
    failedPropertyId === selectedProperty.id ? FALLBACK_IMAGE : selectedProperty.image;

  const focus = focusedRoom?.imageFocus ?? { x: 50, y: 50, scale: 1 };
  const panX = (50 - focus.x) * 0.55;
  const panY = (50 - focus.y) * 0.55;

  return (
    <div className="flex h-full w-full flex-col p-3 sm:p-4 md:p-6">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-zinc-900 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] sm:rounded-[28px]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="relative h-[115%] w-[115%] -left-[7.5%] -top-[7.5%]"
            animate={{
              x: `${panX}%`,
              y: `${panY}%`,
              scale: focus.scale,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            style={{ transformOrigin: "center center" }}
          >
            <Image
              key={`${selectedProperty.id}-${imageSrc}-${focusedRoom?.id ?? "default"}`}
              src={imageSrc}
              alt={selectedProperty.name}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
              sizes="(max-width: 1200px) 60vw, 55vw"
              onError={() => setFailedPropertyId(selectedProperty.id)}
            />
          </motion.div>
        </div>

        <motion.div
          key={vibe}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors duration-700",
            overlay.overlay,
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {focusedRoom && (
          <motion.div
            key={focusedRoom.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="rounded-full border border-white/25 bg-black/35 px-4 py-2 text-[10px] tracking-[0.2em] text-white/90 uppercase backdrop-blur-md">
              {focusedRoom.label}
            </span>
          </motion.div>
        )}

        <div className="absolute top-4 right-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap justify-end gap-1 rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md sm:top-6 sm:right-6">
          {(["golden", "midnight", "misty"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setVibe(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] tracking-wide text-white/70 transition",
                vibe === key && "bg-white/20 text-white",
              )}
            >
              {vibeOverlays[key].emoji}{" "}
              {key === "golden" ? "Day" : key === "midnight" ? "Night" : "Rain"}
            </button>
          ))}
        </div>

        <div className="absolute right-6 bottom-6 left-6 z-10 sm:right-10 sm:bottom-10 sm:left-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/70">
            {selectedProperty.locationDisplay}
          </p>
          <h1 className="max-w-xl font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl">
            {selectedProperty.name}
          </h1>
          <p className="mt-4 text-2xl font-light text-white sm:mt-6 sm:text-3xl md:text-4xl">
            From{" "}
            <span className="font-medium">{formatCurrency(rate)}</span>
            <span className="text-lg text-white/60"> /night</span>
          </p>
        </div>
      </div>
    </div>
  );
}
