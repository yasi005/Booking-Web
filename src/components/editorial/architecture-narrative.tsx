"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useLocale } from "@/context/locale-context";
import { getPropertyDescription } from "@/lib/localized-property";

export function ArchitectureNarrative() {
  const { selectedProperty } = useAppPhase();
  const { locale, t } = useLocale();

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        {t.editorial.experience}
      </p>
      <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">
        {getPropertyDescription(selectedProperty, locale)}
      </p>
    </section>
  );
}
