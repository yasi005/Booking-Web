"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { HeritageAbout } from "@/components/discovery/heritage-about";
import { HeroAvailabilityCard } from "@/components/discovery/hero-availability-card";
import { HeroSlider } from "@/components/discovery/hero-slider";
import { HomePropertiesSection } from "@/components/discovery/home-properties-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";

export function CinematicHome() {
  const { enterMarketplace } = useAppPhase();
  const { t } = useTranslation();

  return (
    <div className="bg-white text-neutral-900">
      <section className="relative min-h-dvh w-full overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/60" />

        <GlassHeader variant="hero" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/60 sm:mb-4 sm:text-[11px] sm:tracking-[0.32em]">
                {t.hero.eyebrow}
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
                {t.hero.title}
              </h1>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                <button
                  type="button"
                  onClick={() => enterMarketplace()}
                  className="rounded-full bg-gradient-to-r from-[#e0c05a]/90 via-[#d4af37]/90 to-[#b8941f]/90 px-10 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-white uppercase shadow-[0_8px_24px_-8px_rgba(212,175,55,0.65)] transition hover:brightness-105"
                >
                  {t.hero.explore}
                </button>
                <button
                  type="button"
                  onClick={() => enterMarketplace()}
                  className="inline-flex h-[48px] items-center text-[13px] tracking-wide text-white/85 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {t.hero.planJourney}
                </button>
              </div>
            </div>

            <div className="w-full max-w-[360px] shrink-0 lg:mb-2">
              <HeroAvailabilityCard />
            </div>
          </div>
        </div>
      </section>

      <HomePropertiesSection />
      <HeritageAbout />
      <SiteFooter />
    </div>
  );
}
