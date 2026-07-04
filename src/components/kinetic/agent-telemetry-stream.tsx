"use client";

import type { AgentStep } from "@/lib/kinetic-tour";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { forwardRef } from "react";

type AgentTelemetryStreamProps = {
  steps: AgentStep[];
  active: boolean;
};

export const AgentTelemetryStream = forwardRef<
  HTMLDivElement,
  AgentTelemetryStreamProps
>(function AgentTelemetryStream({ steps, active }, ref) {
  return (
    <div
      id="loggerBox"
      ref={ref}
      className={cn(
        "relative z-[81] rounded-lg border border-[#242424] bg-[#111111] p-5 transition-shadow duration-500",
        active && "shadow-[0_0_0_1px_rgba(245,158,11,0.25)]",
      )}
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
        AI Agent · Real-Time Compute Stream
      </p>

      <ol className="mt-5 space-y-0">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "relative flex items-start gap-4 py-4",
              index < steps.length - 1 && "border-b border-[#1a1a1a]",
            )}
          >
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
              {step.status === "processing" && (
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              )}
              {step.status === "complete" && (
                <Check className="h-4 w-4 text-amber-500" strokeWidth={2} />
              )}
              {step.status === "idle" && (
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-mono text-[12px]",
                  step.status === "complete"
                    ? "text-neutral-200"
                    : step.status === "processing"
                      ? "text-amber-400"
                      : "text-neutral-600",
                )}
              >
                {step.label}
              </p>
              <p className="mt-1 font-mono text-[10px] text-neutral-600">
                {step.status === "processing" && "network_state: active"}
                {step.status === "complete" && "network_state: resolved ✓"}
                {step.status === "idle" && "network_state: standby"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});
