"use client";

import { getAllProperties } from "@/lib/property-registry";
import type { Property } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SavesContextValue = {
  savedIds: Set<string>;
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => void;
  savesDrawerOpen: boolean;
  openSavesDrawer: () => void;
  closeSavesDrawer: () => void;
  savedProperties: Property[];
};

const SavesContext = createContext<SavesContextValue | null>(null);

export function SavesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savesDrawerOpen, setSavesDrawerOpen] = useState(false);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openSavesDrawer = useCallback(() => setSavesDrawerOpen(true), []);
  const closeSavesDrawer = useCallback(() => setSavesDrawerOpen(false), []);

  const savedProperties = useMemo(
    () => getAllProperties().filter((p) => savedIds.has(p.id)),
    [savedIds],
  );

  const value = useMemo(
    () => ({
      savedIds,
      isSaved,
      toggleSave,
      savesDrawerOpen,
      openSavesDrawer,
      closeSavesDrawer,
      savedProperties,
    }),
    [
      savedIds,
      isSaved,
      toggleSave,
      savesDrawerOpen,
      openSavesDrawer,
      closeSavesDrawer,
      savedProperties,
    ],
  );

  return <SavesContext.Provider value={value}>{children}</SavesContext.Provider>;
}

export function useSaves() {
  const context = useContext(SavesContext);
  if (!context) throw new Error("useSaves must be used within SavesProvider");
  return context;
}
