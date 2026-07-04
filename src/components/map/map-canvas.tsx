"use client";

import { PropertyMap } from "@/components/map/property-map";
import { useAppPhase } from "@/context/app-phase-context";
import { vibeOverlays, useVibe } from "@/context/vibe-context";
import { cn } from "@/lib/utils";
import Image from "next/image";

type MapCanvasProps = {
  variant?: "full" | "sidebar";
};

export function MapCanvas({ variant = "full" }: MapCanvasProps) {
  const { selectedProperty } = useAppPhase();
  const { vibe } = useVibe();
  const isMidnight = vibe === "midnight";
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col",
        isSidebar ? "bg-[#ececea] p-2.5" : "bg-[#ececea] p-3 sm:p-4 md:p-6",
      )}
    >
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden border border-black/5 transition-colors duration-700",
          isSidebar ? "rounded-2xl" : "rounded-[20px] sm:rounded-[28px]",
          isMidnight ? "border-white/10" : "border-black/5",
        )}
      >
        <div className="absolute inset-0">
          <PropertyMap />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute z-10 overflow-hidden rounded-xl border-2 border-white shadow-lg",
            isSidebar ? "top-3 left-3 h-12 w-12" : "top-6 left-6 h-14 w-14 rounded-2xl",
          )}
        >
          <div className="relative h-full w-full">
            <Image
              src={selectedProperty.image}
              alt={selectedProperty.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute z-10 rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] backdrop-blur-md uppercase",
            isSidebar ? "bottom-3 left-3" : "bottom-8 left-8 px-4 py-2 text-xs",
            isMidnight
              ? "border-white/10 bg-black/50 text-white/70"
              : "border-black/10 bg-white/80 text-black/60",
          )}
        >
          {selectedProperty.locationDisplay}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-700",
            vibeOverlays[vibe].overlay,
            isMidnight && "opacity-80",
          )}
        />
      </div>
    </div>
  );
}
