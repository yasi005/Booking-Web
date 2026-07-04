"use client";

import { MobileHeaderMenu } from "@/components/discovery/mobile-header-menu";
import { useAppPhase } from "@/context/app-phase-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", action: "home" as const },
  { label: "Properties", action: "properties" as const },
  { label: "Our Projects", action: "projects" as const },
  { label: "Market", action: "market" as const },
];

type GlassHeaderProps = {
  variant?: "hero" | "solid";
};

export function GlassHeader({ variant = "hero" }: GlassHeaderProps) {
  const { enterMarketplace, exitToDiscovery } = useAppPhase();
  const [scrolled, setScrolled] = useState(false);
  const onHero = variant === "hero";

  useEffect(() => {
    if (!onHero) return;
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHero]);

  const handleNav = (action: (typeof navItems)[number]["action"]) => {
    if (action === "home") exitToDiscovery();
    if (action === "properties") enterMarketplace();
    if (action === "projects" || action === "market") {
      exitToDiscovery();
      requestAnimationFrame(() => {
        document.getElementById(action)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500",
        onHero
          ? scrolled
            ? "border-b border-white/10 bg-black/30 backdrop-blur-md"
            : "border-b border-white/10 bg-white/10 backdrop-blur-md"
          : "border-b border-neutral-100 bg-white/90 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8 md:px-12 lg:px-16">
        <button
          type="button"
          onClick={() => exitToDiscovery()}
          className={cn(
            "font-serif text-lg tracking-[0.12em] transition-opacity hover:opacity-70 sm:text-xl",
            onHero && !scrolled ? "text-white" : onHero ? "text-white" : "text-neutral-900",
          )}
        >
          REMAX
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
          {navItems.map(({ label, action }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleNav(action)}
              className={cn(
                "group relative text-[13px] tracking-wide transition-colors",
                onHero ? "text-white/75 hover:text-white" : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              {label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                  onHero ? "bg-white" : "bg-neutral-900",
                )}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <button
            type="button"
            className={cn(
              "hidden text-[13px] tracking-wide transition-colors sm:inline",
              onHero ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            Log In
          </button>
          <button
            type="button"
            className={cn(
              "hidden rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition sm:inline",
              onHero
                ? "bg-white text-neutral-950 hover:bg-white/90"
                : "bg-neutral-950 text-white hover:bg-neutral-800",
            )}
          >
            Sign Up
          </button>
          <MobileHeaderMenu onHero={onHero} />
        </div>
      </div>
    </header>
  );
}
