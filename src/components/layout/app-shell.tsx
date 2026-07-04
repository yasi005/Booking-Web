"use client";

import { BespokePreferencesDrawer } from "@/components/workspace/bespoke-preferences-drawer";
import { FavoritesDrawer } from "@/components/workspace/favorites-drawer";
import { EditorialPanel } from "@/components/editorial/editorial-panel";
import { GalleryCanvas } from "@/components/gallery/gallery-canvas";
import { MobileEditorialSheet } from "@/components/layout/mobile-editorial-sheet";
import { MobileNavRail } from "@/components/layout/mobile-nav-rail";
import { NavRail } from "@/components/layout/nav-rail";
import { MapCanvas } from "@/components/map/map-canvas";
import { useCanvasFocus } from "@/context/canvas-focus-context";
import { useViewMode } from "@/context/view-mode-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ImageIcon, MapIcon } from "lucide-react";
import { useEffect } from "react";

function CanvasModeToggle() {
  const { mode, setMode, toggleMode } = useViewMode();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center sm:bottom-6 lg:bottom-7">
      <motion.button
        type="button"
        onClick={toggleMode}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-black/10 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2"
        aria-label={mode === "map" ? "Switch to gallery" : "Switch to map"}
      >
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] transition sm:gap-1.5 sm:px-2.5 sm:text-[10px] sm:tracking-[0.14em]",
            mode === "map" ? "bg-neutral-900 text-white" : "text-neutral-500",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setMode("map");
          }}
        >
          <MapIcon className="h-3 w-3" strokeWidth={1.75} />
          Map
        </span>
        <span className="h-3 w-px bg-neutral-200" aria-hidden />
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] transition sm:gap-1.5 sm:px-2.5 sm:text-[10px] sm:tracking-[0.14em]",
            mode === "gallery" ? "bg-neutral-900 text-white" : "text-neutral-500",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setMode("gallery");
          }}
        >
          <ImageIcon className="h-3 w-3" strokeWidth={1.75} />
          Gallery
        </span>
      </motion.button>
    </div>
  );
}

export function AppShell() {
  const { isGallery, isMap, mode } = useViewMode();
  const { setFocusedRoom } = useCanvasFocus();

  useEffect(() => {
    if (mode === "map") {
      setFocusedRoom(null);
    }
  }, [mode, setFocusedRoom]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div className="hidden h-full shrink-0 lg:flex">
        <NavRail />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[#f4f4f2] pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: isMap ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            style={{ pointerEvents: isMap ? "auto" : "none", zIndex: isMap ? 2 : 1 }}
          >
            <MapCanvas />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            animate={{ opacity: isGallery ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            style={{ pointerEvents: isGallery ? "auto" : "none", zIndex: isGallery ? 2 : 1 }}
          >
            <GalleryCanvas />
          </motion.div>

          <CanvasModeToggle />
        </main>

        <div className="hidden h-full w-[min(100%,420px)] shrink-0 border-l border-neutral-100 lg:block">
          <EditorialPanel />
        </div>
      </div>

      <MobileEditorialSheet />
      <MobileNavRail />

      <BespokePreferencesDrawer />
      <FavoritesDrawer />
    </div>
  );
}
