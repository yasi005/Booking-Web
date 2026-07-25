"use client";

import { HomePropertyCarousel } from "@/components/discovery/home-property-carousel";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { useMarketplace } from "@/context/marketplace-context";
import { sortProperties } from "@/lib/editorial-grid";
import { ArrowRight } from "lucide-react";

/** Enough cards for the deck to feel deep without loading the whole catalog. */
const HOME_PREVIEW_COUNT = 7;

export function HomePropertiesSection() {
  const { enterMarketplace } = useAppPhase();
  const { t } = useTranslation();
  const { allProperties, isLoading } = useMarketplace();

  const previewProperties = sortProperties(allProperties, "featured").slice(
    0,
    HOME_PREVIEW_COUNT,
  );

  if (!isLoading && previewProperties.length === 0) {
    return null;
  }

  return (
    <section id="properties" className="scroll-mt-24 bg-white py-10 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        <div className="mb-6 text-center md:mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-[11px]">
            {t.homeProperties.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-neutral-900 sm:text-3xl">
            {t.homeProperties.title}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {t.homeProperties.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-[210px] items-center justify-center gap-3 sm:h-[280px] md:h-[340px] lg:h-[380px]">
            <div className="aspect-[4/3] h-[74%] animate-pulse rounded-[26px] bg-neutral-100 sm:rounded-[32px]" />
            <div className="aspect-[4/3] h-full animate-pulse rounded-[26px] bg-neutral-100 sm:rounded-[32px]" />
            <div className="aspect-[4/3] h-[74%] animate-pulse rounded-[26px] bg-neutral-100 sm:rounded-[32px]" />
          </div>
        ) : (
          <HomePropertyCarousel properties={previewProperties} />
        )}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => enterMarketplace()}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-800"
          >
            {t.homeProperties.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
