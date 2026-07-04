"use client";

import type { FloorPlanRoom } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CanvasFocusContextValue = {
  focusedRoom: FloorPlanRoom | null;
  setFocusedRoom: (room: FloorPlanRoom | null) => void;
};

const CanvasFocusContext = createContext<CanvasFocusContextValue | null>(null);

export function CanvasFocusProvider({ children }: { children: ReactNode }) {
  const [focusedRoom, setFocusedRoomState] = useState<FloorPlanRoom | null>(null);

  const setFocusedRoom = useCallback((room: FloorPlanRoom | null) => {
    setFocusedRoomState(room);
  }, []);

  const value = useMemo(
    () => ({ focusedRoom, setFocusedRoom }),
    [focusedRoom, setFocusedRoom],
  );

  return (
    <CanvasFocusContext.Provider value={value}>{children}</CanvasFocusContext.Provider>
  );
}

export function useCanvasFocus() {
  const context = useContext(CanvasFocusContext);
  if (!context) {
    throw new Error("useCanvasFocus must be used within CanvasFocusProvider");
  }
  return context;
}
