"use client";

import { ArchitectureNarrative } from "@/components/editorial/architecture-narrative";
import { BookingTimeline } from "@/components/editorial/booking-timeline";
import { EditorialHeaderActions } from "@/components/editorial/editorial-header-actions";
import { HeritageHeader } from "@/components/editorial/heritage-header";
import { HostValidationCard } from "@/components/editorial/host-validation-card";
import { InteractiveFloorPlan } from "@/components/editorial/interactive-floor-plan";
import { SeasonalPriceChart } from "@/components/editorial/seasonal-price-chart";
import { SpecRow } from "@/components/editorial/spec-row";
import { usePreferences } from "@/context/preferences-context";
import { vibeOverlays, useVibe } from "@/context/vibe-context";
import { cn } from "@/lib/utils";

export function EditorialPanel() {
  const { vibe } = useVibe();
  const { discretionMode } = usePreferences();
  const panelTint = vibeOverlays[vibe].panelTint;

  return (
    <aside
      className={cn(
        "relative flex h-full w-full flex-col bg-white transition-colors duration-700",
        panelTint,
      )}
    >
      {discretionMode && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/30 backdrop-blur-[6px]" />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-6 pt-6 lg:px-8 lg:pt-8">
          <EditorialHeaderActions />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8 scrollbar-none lg:px-8 lg:pb-10">
          <div className="flex flex-col">
            <HeritageHeader />
            <SpecRow />
            <ArchitectureNarrative />
            <SeasonalPriceChart />
            <BookingTimeline />
            <InteractiveFloorPlan />
            <HostValidationCard />
          </div>
        </div>
      </div>
    </aside>
  );
}
