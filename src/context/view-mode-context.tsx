"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ViewMode = "gallery" | "map";

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
  isGallery: boolean;
  isMap: boolean;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("map");

  const toggleMode = useCallback(() => {
    setMode((current) => (current === "gallery" ? "map" : "gallery"));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      isGallery: mode === "gallery",
      isMap: mode === "map",
    }),
    [mode, toggleMode],
  );

  return (
    <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
