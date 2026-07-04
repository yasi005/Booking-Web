"use client";

import type { AmbientVibe } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type VibeContextValue = {
  vibe: AmbientVibe;
  setVibe: (vibe: AmbientVibe) => void;
};

const VibeContext = createContext<VibeContextValue | null>(null);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [vibe, setVibe] = useState<AmbientVibe>("golden");

  const value = useMemo(() => ({ vibe, setVibe }), [vibe]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) throw new Error("useVibe must be used within VibeProvider");
  return context;
}

export const vibeOverlays: Record<
  AmbientVibe,
  { label: string; emoji: string; overlay: string; panelTint: string }
> = {
  golden: {
    label: "Daylight",
    emoji: "☀️",
    overlay: "bg-amber-300/20 mix-blend-soft-light",
    panelTint: "bg-amber-50/30",
  },
  misty: {
    label: "Overcast",
    emoji: "🌧️",
    overlay: "bg-slate-400/25 mix-blend-multiply",
    panelTint: "bg-slate-100/40",
  },
  midnight: {
    label: "Night",
    emoji: "🌙",
    overlay: "bg-indigo-950/50 mix-blend-multiply",
    panelTint: "bg-indigo-50/35",
  },
};
