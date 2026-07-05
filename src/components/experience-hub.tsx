"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CinematicHome } from "@/components/discovery/cinematic-home";
import { MarketplacePage } from "@/components/marketplace/marketplace-page";
import { useAppPhase } from "@/context/app-phase-context";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export function ExperienceHub() {
  const { isDiscovery, isMarketplace, isWorkspace } = useAppPhase();

  useEffect(() => {
    const scrollable = isDiscovery || isMarketplace;
    document.body.style.overflow = scrollable ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDiscovery, isMarketplace]);

  return (
    <AnimatePresence mode="sync" initial={false}>
      {isDiscovery && (
        <motion.div
          key="discovery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <CinematicHome />
        </motion.div>
      )}

      {isMarketplace && (
        <motion.div
          key="marketplace"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
        >
          <MarketplacePage />
        </motion.div>
      )}

      {isWorkspace && (
        <motion.div
          key="workspace"
          className="fixed inset-0 z-50 flex h-full w-full flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <AppShell />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
