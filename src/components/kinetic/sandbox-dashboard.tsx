"use client";

import {
  DEMO_URL,
  MOCK_INSTAGRAM_DRAFT,
  MOCK_LINKEDIN_DRAFT,
  MOCK_X_DRAFT,
  type AgentStep,
  type TourStep,
} from "@/lib/kinetic-tour";
import { BespokeTourOverlay } from "@/components/kinetic/bespoke-tour";
import { AgentTelemetryStream } from "@/components/kinetic/agent-telemetry-stream";
import { ContextInputZone } from "@/components/kinetic/context-input-zone";
import { OmniChannelSuite } from "@/components/kinetic/omni-channel-suite";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

const INITIAL_AGENTS: AgentStep[] = [
  { id: "scrape", label: "Scraping", status: "idle" },
  { id: "filter", label: "Semantic Filtering", status: "idle" },
  { id: "synth", label: "Omni-Channel Synthesis", status: "idle" },
];

const X_REFINE_VARIANTS = [
  MOCK_X_DRAFT,
  "p99 latency is a coupling signal. We decoupled read/write paths and dropped tail latency 40%—no hot-path rewrite. Thread ↓",
  "Throughput scales. Latency tells the truth. Here's the decoupling pattern that fixed our tail without a rewrite.",
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SandboxDashboard() {
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState<TourStep>(1);
  const [contextUrl, setContextUrl] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agents, setAgents] = useState<AgentStep[]>(INITIAL_AGENTS);
  const [xDraft, setXDraft] = useState("");
  const [linkedInDraft, setLinkedInDraft] = useState("");
  const [instagramDraft, setInstagramDraft] = useState("");
  const [omniPopulated, setOmniPopulated] = useState(false);
  const [refineIndex, setRefineIndex] = useState(0);

  const inputRef = useRef<HTMLDivElement>(null);
  const loggerRef = useRef<HTMLDivElement>(null);
  const omniRef = useRef<HTMLDivElement>(null);
  const charCountRef = useRef<HTMLSpanElement | null>(null);

  const runStepSimulation = useCallback(async (step: TourStep) => {
    if (step === 1) {
      setContextUrl("");
      setIsTyping(true);
      for (let i = 0; i <= DEMO_URL.length; i++) {
        setContextUrl(DEMO_URL.slice(0, i));
        await delay(42);
      }
      setIsTyping(false);
    }

    if (step === 2) {
      setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: "idle" })));
      for (let i = 0; i < 3; i++) {
        setAgents((prev) =>
          prev.map((agent, idx) =>
            idx === i ? { ...agent, status: "processing" } : agent,
          ),
        );
        await delay(900);
        setAgents((prev) =>
          prev.map((agent, idx) =>
            idx === i ? { ...agent, status: "complete" } : agent,
          ),
        );
        await delay(350);
      }
    }

    if (step === 3) {
      setXDraft("");
      setLinkedInDraft("");
      setInstagramDraft("");
      setOmniPopulated(false);
      await delay(300);
      setXDraft(MOCK_X_DRAFT);
      await delay(200);
      setLinkedInDraft(MOCK_LINKEDIN_DRAFT);
      await delay(200);
      setInstagramDraft(MOCK_INSTAGRAM_DRAFT);
      setOmniPopulated(true);
    }
  }, []);

  const startTour = useCallback(async () => {
    setTourActive(true);
    setTourStep(1);
    await runStepSimulation(1);
  }, [runStepSimulation]);

  const endTour = useCallback(() => {
    setTourActive(false);
    setTourStep(1);
    setIsTyping(false);
  }, []);

  const goNext = useCallback(async () => {
    if (tourStep >= 4) {
      endTour();
      return;
    }
    const next = (tourStep + 1) as TourStep;
    setTourStep(next);
    await runStepSimulation(next);
  }, [tourStep, endTour, runStepSimulation]);

  const handleRefineX = useCallback(() => {
    const next = (refineIndex + 1) % X_REFINE_VARIANTS.length;
    setRefineIndex(next);
    setXDraft(X_REFINE_VARIANTS[next]);
  }, [refineIndex]);

  const spotlightTarget =
    tourStep === 1
      ? inputRef
      : tourStep === 2
        ? loggerRef
        : tourStep === 3
          ? omniRef
          : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-neutral-400">
              KINETIC.OS
            </span>
            <span className="hidden font-mono text-[10px] text-neutral-600 sm:inline">
              / sandbox
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] text-neutral-600 md:inline">
              system_layout: active
            </span>
            {!tourActive ? (
              <button
                type="button"
                onClick={startTour}
                className={cn(
                  "rounded-md border border-[#242424] px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition",
                  "animate-[pulse_3s_ease-in-out_infinite] hover:border-amber-500/40 hover:text-amber-400",
                )}
              >
                🧭 Run 60-Second Console Tour
              </button>
            ) : (
              <span className="font-mono text-[10px] text-amber-500/80">
                tour_active · step {tourStep}/4
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <ContextInputZone
            ref={inputRef}
            value={contextUrl}
            onChange={setContextUrl}
            isTyping={isTyping}
          />
          <AgentTelemetryStream
            ref={loggerRef}
            steps={agents}
            active={tourStep === 2 && tourActive}
          />
        </div>

        <section>
          <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
            Omni-Channel Output Suite
          </p>
          <OmniChannelSuite
            ref={omniRef}
            xDraft={xDraft}
            linkedInDraft={linkedInDraft}
            instagramDraft={instagramDraft}
            onXChange={setXDraft}
            onLinkedInChange={setLinkedInDraft}
            onInstagramChange={setInstagramDraft}
            onRefineX={handleRefineX}
            populated={omniPopulated}
          />
        </section>
      </main>

      <BespokeTourOverlay
        active={tourActive}
        step={tourStep}
        targetRef={spotlightTarget}
        onNext={goNext}
        onSkip={endTour}
      />
    </div>
  );
}
