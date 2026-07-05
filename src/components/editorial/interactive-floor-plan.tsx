"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useCanvasFocus } from "@/context/canvas-focus-context";
import { useLocale } from "@/context/locale-context";
import { useViewMode } from "@/context/view-mode-context";
import { getRoomLabel } from "@/lib/localized-property";
import { cn } from "@/lib/utils";
import type { FloorPlanRoom } from "@/types/property";
import { useState } from "react";

function roomCenter(path: string) {
  const numbers = path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = numbers.filter((_, i) => i % 2 === 0);
  const ys = numbers.filter((_, i) => i % 2 === 1);
  const x = xs.reduce((sum, n) => sum + n, 0) / xs.length;
  const y = ys.reduce((sum, n) => sum + n, 0) / ys.length;
  return { x, y };
}

export function InteractiveFloorPlan() {
  const { selectedProperty } = useAppPhase();
  const { focusedRoom, setFocusedRoom } = useCanvasFocus();
  const { setMode } = useViewMode();
  const { locale, t } = useLocale();
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);

  const rooms = selectedProperty.floorPlanRooms.filter((r) => r.floor === activeFloor);

  const handleRoomSelect = (room: FloorPlanRoom) => {
    if (focusedRoom?.id === room.id) {
      setFocusedRoom(null);
      return;
    }
    setFocusedRoom(room);
    setMode("gallery");
  };

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
          {t.editorial.floorPlan}
        </p>
        <div className="flex gap-1">
          {([1, 2] as const).map((floor) => (
            <button
              key={floor}
              type="button"
              onClick={() => setActiveFloor(floor)}
              className={cn(
                "cursor-pointer px-3 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors",
                activeFloor === floor
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600",
              )}
            >
              {t.editorial.floor(floor)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-[#fafaf8] p-4">
        <svg viewBox="0 0 192 160" className="h-auto w-full" aria-label="Interactive floor plan">
          <rect x="8" y="8" width="176" height="144" fill="white" stroke="#e5e5e5" strokeWidth="0.5" rx="4" />
          {rooms.map((room) => {
            const isActive = focusedRoom?.id === room.id;
            const center = roomCenter(room.path);
            const label = room.galleryRoom
              ? getRoomLabel(locale, room.galleryRoom)
              : room.label;

            return (
              <g key={room.id}>
                <path
                  d={room.path}
                  fill={isActive ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.02)"}
                  stroke={isActive ? "#171717" : "#d4d4d4"}
                  strokeWidth={isActive ? 1.4 : 0.7}
                  className="cursor-pointer transition-all duration-300 hover:fill-black/[0.06]"
                  onClick={() => handleRoomSelect(room)}
                />
                <text
                  x={center.x}
                  y={center.y + 3}
                  textAnchor="middle"
                  className={cn(
                    "pointer-events-none select-none text-[6.5px] font-medium uppercase tracking-wider transition-colors",
                    isActive ? "fill-neutral-800" : "fill-neutral-400",
                  )}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-3 text-center text-[10px] tracking-[0.12em] text-neutral-400 uppercase">
          {t.editorial.floorHint}
        </p>
      </div>
    </section>
  );
}
