"use client";

import { useAppPhase } from "@/context/app-phase-context";

export function ArchitectureNarrative() {
  const { selectedProperty } = useAppPhase();

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        The Experience
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
        {selectedProperty.description}
      </p>
    </section>
  );
}
