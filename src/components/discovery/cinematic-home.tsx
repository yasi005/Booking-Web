"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { HeritageAbout } from "@/components/discovery/heritage-about";
import { useAppPhase } from "@/context/app-phase-context";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function CinematicHome() {
  const { enterMarketplace, setHomeSearchQuery } = useAppPhase();
  const [query, setQuery] = useState("");

  const handleExplore = () => {
    setHomeSearchQuery(query);
    enterMarketplace(query);
  };

  return (
    <div className="bg-white text-neutral-900">
      <section className="relative min-h-dvh w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt="Ultra-luxury villa destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />

        <GlassHeader variant="hero" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-6 sm:pb-20 sm:pt-32">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/60 sm:mb-4 sm:text-[11px] sm:tracking-[0.32em]">
            Luxury Residences · Global Collection
          </p>
          <h1 className="max-w-3xl text-center font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
            Arrive somewhere unforgettable.
          </h1>

          <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExplore()}
                placeholder="Search destinations, villas, regions..."
                className="w-full rounded-full border border-white/20 bg-white/95 py-3.5 pr-4 pl-11 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-white/40"
              />
            </div>
            <button
              type="button"
              onClick={handleExplore}
              className="shrink-0 rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-800"
            >
              Explore Properties
            </button>
          </div>

          <button
            type="button"
            onClick={() => enterMarketplace()}
            className="mt-4 text-[13px] tracking-wide text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            Plan Your Journey
          </button>
        </div>
      </section>

      <HeritageAbout />
    </div>
  );
}
