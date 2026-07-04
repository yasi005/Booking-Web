"use client";

import { AppPhaseProvider } from "@/context/app-phase-context";
import { CanvasFocusProvider } from "@/context/canvas-focus-context";
import { MapProvider } from "@/context/map-context";
import { MarketplaceProvider } from "@/context/marketplace-context";
import { PreferencesProvider } from "@/context/preferences-context";
import { SavesProvider } from "@/context/saves-context";
import { VibeProvider } from "@/context/vibe-context";
import { ViewModeProvider } from "@/context/view-mode-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppPhaseProvider>
      <MarketplaceProvider>
        <MapProvider>
          <SavesProvider>
            <PreferencesProvider>
              <VibeProvider>
                <CanvasFocusProvider>
                  <ViewModeProvider>{children}</ViewModeProvider>
                </CanvasFocusProvider>
              </VibeProvider>
            </PreferencesProvider>
          </SavesProvider>
        </MapProvider>
      </MarketplaceProvider>
    </AppPhaseProvider>
  );
}
