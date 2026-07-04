"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ChannelEditorProps = {
  platform: string;
  value: string;
  onChange: (value: string) => void;
  maxChars?: number;
  charCountId?: string;
  showRefine?: boolean;
  onRefine?: () => void;
};

function ChannelEditor({
  platform,
  value,
  onChange,
  maxChars,
  charCountId,
  showRefine,
  onRefine,
}: ChannelEditorProps) {
  const count = value.length;
  const limit = maxChars ?? 2000;

  return (
    <div
      id={platform === "X (Twitter)" ? "step4Focus" : undefined}
      className="flex min-h-[220px] flex-col rounded-lg border border-[#242424] bg-[#111111] p-4"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {platform}
        </p>
        {maxChars !== undefined && (
          <span
            id={charCountId}
            className={cn(
              "font-mono text-[10px]",
              count > limit ? "text-red-400" : "text-neutral-600",
            )}
          >
            {count} / {limit}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 min-h-[120px] flex-1 resize-none bg-transparent font-mono text-[12px] leading-relaxed text-neutral-300 outline-none"
      />
      {showRefine ? (
        <button
          type="button"
          onClick={onRefine}
          className="mt-3 self-start font-mono text-[11px] text-amber-500/90 transition hover:text-amber-400"
        >
          [ Refine with AI ]
        </button>
      ) : null}
    </div>
  );
}

type OmniChannelSuiteProps = {
  xDraft: string;
  linkedInDraft: string;
  instagramDraft: string;
  onXChange: (v: string) => void;
  onLinkedInChange: (v: string) => void;
  onInstagramChange: (v: string) => void;
  onRefineX: () => void;
  populated: boolean;
};

export const OmniChannelSuite = forwardRef<HTMLDivElement, OmniChannelSuiteProps>(
  function OmniChannelSuite(
    {
      xDraft,
      linkedInDraft,
      instagramDraft,
      onXChange,
      onLinkedInChange,
      onInstagramChange,
      onRefineX,
      populated,
    },
    ref,
  ) {
    return (
      <div
        id="omniEditorView"
        ref={ref}
        className={cn(
          "relative z-[81] grid grid-cols-1 gap-4 transition-all duration-500 lg:grid-cols-3",
          populated && "shadow-[0_0_0_1px_rgba(245,158,11,0.15)]",
        )}
      >
        <ChannelEditor
          platform="X (Twitter)"
          value={xDraft}
          onChange={onXChange}
          maxChars={280}
          charCountId="charCountX"
          showRefine
          onRefine={onRefineX}
        />
        <ChannelEditor
          platform="LinkedIn"
          value={linkedInDraft}
          onChange={onLinkedInChange}
        />
        <ChannelEditor
          platform="Instagram"
          value={instagramDraft}
          onChange={onInstagramChange}
          maxChars={2200}
        />
      </div>
    );
  },
);
