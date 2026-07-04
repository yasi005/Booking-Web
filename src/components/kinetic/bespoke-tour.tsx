"use client";

import { TourMask, SpotlightRing, useSpotlightRect } from "@/components/kinetic/tour-spotlight";
import { TourTooltip } from "@/components/kinetic/tour-tooltip";
import type { TourStep } from "@/lib/kinetic-tour";
import { type RefObject, useEffect, useState } from "react";
import type { SpotlightRect } from "@/components/kinetic/tour-spotlight";

type BespokeTourOverlayProps = {
  active: boolean;
  step: TourStep;
  targetRef: RefObject<HTMLElement | null> | null;
  onNext: () => void;
  onSkip: () => void;
};

function measureElement(el: HTMLElement): SpotlightRect {
  const pad = 10;
  const box = el.getBoundingClientRect();
  return {
    top: box.top - pad,
    left: box.left - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
}

export function BespokeTourOverlay({
  active,
  step,
  targetRef,
  onNext,
  onSkip,
}: BespokeTourOverlayProps) {
  const useRefTarget = step !== 4;
  const refRect = useSpotlightRect(targetRef ?? { current: null }, active && useRefTarget);
  const [step4Rect, setStep4Rect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!active || step !== 4) {
      setStep4Rect(null);
      return;
    }

    const charEl = document.getElementById("charCountX");
    const refineCol = document.getElementById("step4Focus");
    const el = refineCol ?? charEl;
    if (!el) return;

    const measure = () => {
      if (charEl && refineCol) {
        const a = charEl.getBoundingClientRect();
        const b = refineCol.getBoundingClientRect();
        const top = Math.min(a.top, b.top);
        const left = Math.min(a.left, b.left);
        const right = Math.max(a.right, b.right);
        const bottom = Math.max(a.bottom, b.bottom);
        setStep4Rect({
          top: top - 10,
          left: left - 10,
          width: right - left + 20,
          height: bottom - top + 20,
        });
      } else {
        setStep4Rect(measureElement(el));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, step]);

  const rect = step === 4 ? step4Rect : refRect;

  if (!active) return null;

  return (
    <>
      <TourMask active />
      <SpotlightRing rect={rect} active />
      <TourTooltip
        step={step}
        rect={rect}
        onNext={onNext}
        onSkip={onSkip}
        isLast={step === 4}
      />
    </>
  );
}
