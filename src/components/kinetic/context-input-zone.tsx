"use client";

import { DEMO_URL } from "@/lib/kinetic-tour";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ContextInputZoneProps = {
  value: string;
  onChange: (value: string) => void;
  isTyping: boolean;
};

export const ContextInputZone = forwardRef<HTMLDivElement, ContextInputZoneProps>(
  function ContextInputZone({ value, onChange, isTyping }, ref) {
    return (
      <div
        id="sandboxInputZone"
        ref={ref}
        className={cn(
          "relative rounded-lg border border-[#242424] bg-[#111111] p-5 transition-shadow duration-500",
          isTyping && "shadow-[0_0_0_1px_rgba(245,158,11,0.25)]",
        )}
      >
        <label
          htmlFor="context-url"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500"
        >
          Context Input
        </label>
        <p className="mt-1 font-mono text-[11px] text-neutral-600">
          URL or raw specification sheet
        </p>
        <input
          id="context-url"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://"
          className="mt-4 w-full border-b border-[#242424] bg-transparent py-3 font-mono text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-amber-500/50"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[10px] text-neutral-600">
            {value.length > 0 ? `${value.length} chars ingested` : "Awaiting context"}
          </span>
          <button
            type="button"
            className="rounded border border-[#242424] px-4 py-2 font-mono text-[11px] text-neutral-300 transition hover:border-amber-500/40 hover:text-amber-400"
          >
            Generate
          </button>
        </div>
        {isTyping && (
          <span className="absolute top-4 right-4 font-mono text-[10px] text-amber-500/80">
            auto-ingest ▍
          </span>
        )}
      </div>
    );
  },
);

export { DEMO_URL };
