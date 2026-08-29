"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { HeritageAbout } from "@/components/discovery/heritage-about";
import { HeroSlider } from "@/components/discovery/hero-slider";
import { HomePropertiesSection } from "@/components/discovery/home-properties-section";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
export function CinematicHome() {
  const { enterMarketplace } = useAppPhase();
  const { t } = useTranslation();

  const handleExplore = () => {
    enterMarketplace();
  };

  return (
    <div className="bg-white text-neutral-900">
      <section className="relative min-h-dvh w-full overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />

        <GlassHeader variant="hero" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-24 text-center sm:px-6 sm:pb-20 sm:pt-32">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/60 sm:mb-4 sm:text-[11px] sm:tracking-[0.32em]">
            {t.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
            {t.hero.title}
          </h1>

          <button
            type="button"
            onClick={handleExplore}
            className="mt-10 rounded-full bg-neutral-950 px-10 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-800"
          >
            {t.hero.explore}
          </button>

          <button
            type="button"
            onClick={() => enterMarketplace()}
            className="mt-4 text-[13px] tracking-wide text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            {t.hero.planJourney}
          </button>
        </div>
      </section>

      <HomePropertiesSection />
      <HeritageAbout />
    </div>
  );
}
