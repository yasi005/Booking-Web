"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useSaves } from "@/context/saves-context";
import { usePreferences } from "@/context/preferences-context";
import { useViewMode } from "@/context/view-mode-context";
import { cn } from "@/lib/utils";
import { Compass, Heart, Home, Map, Settings } from "lucide-react";

function MobileNavButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[9px] uppercase tracking-[0.12em] transition",
        active ? "text-white" : "text-neutral-500",
      )}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export function MobileNavRail() {
  const { phase, exitToDiscovery, exitToMarketplace } = useAppPhase();
  const { mode, setMode } = useViewMode();
  const { openSettings } = usePreferences();
  const { openSavesDrawer, savesDrawerOpen, savedIds } = useSaves();

  return (
    <nav
      aria-label="Mobile workspace navigation"
      className="flex shrink-0 items-stretch border-t border-white/10 bg-neutral-950 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 lg:hidden"
    >
      <MobileNavButton
        label="Home"
        onClick={() => (phase === "workspace" ? exitToMarketplace() : exitToDiscovery())}
      >
        <Home className="h-[18px] w-[18px] stroke-[1.5]" />
      </MobileNavButton>
      <MobileNavButton label="Map" active={mode === "map"} onClick={() => setMode("map")}>
        <Map className="h-[18px] w-[18px] stroke-[1.5]" />
      </MobileNavButton>
      <MobileNavButton
        label="Gallery"
        active={mode === "gallery"}
        onClick={() => setMode("gallery")}
      >
        <Compass className="h-[18px] w-[18px] stroke-[1.5]" />
      </MobileNavButton>
      <MobileNavButton label="Saves" active={savesDrawerOpen} onClick={openSavesDrawer}>
        <div className="relative">
          <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
          {savedIds.size > 0 && (
            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
        </div>
      </MobileNavButton>
      <MobileNavButton label="More" onClick={openSettings}>
        <Settings className="h-[18px] w-[18px] stroke-[1.5]" />
      </MobileNavButton>
    </nav>
  );
}
