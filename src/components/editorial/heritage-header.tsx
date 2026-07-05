"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { KineticText } from "@/components/ui/kinetic-text";
import { useLocale } from "@/context/locale-context";
import {
  getLocationDisplay,
  getPropertyName,
} from "@/lib/localized-property";

export function HeritageHeader() {
  const { selectedProperty } = useAppPhase();
  const { locale } = useLocale();

  return (
    <header className="border-b border-neutral-100 pb-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
        <KineticText
          key={`loc-${selectedProperty.id}-${locale}`}
          text={getLocationDisplay(selectedProperty, locale)}
        />
      </p>
      <h2 className="font-serif mt-4 text-3xl font-normal tracking-tight text-neutral-900">
        <KineticText
          key={`name-${selectedProperty.id}-${locale}`}
          text={getPropertyName(selectedProperty, locale)}
          delay={0.12}
        />
      </h2>
      <p className="mt-3 text-sm text-neutral-500">
        <span className="text-neutral-800">★ {selectedProperty.rating.toFixed(2)}</span>
        <span className="text-neutral-400"> ({selectedProperty.reviewCount} Reviews)</span>
      </p>
    </header>
  );
}
