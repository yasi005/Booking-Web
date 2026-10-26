"use client";

import { MobileHeaderMenu } from "@/components/discovery/mobile-header-menu";
import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type GlassHeaderProps = {
  variant?: "hero" | "solid";
};

export function GlassHeader({ variant = "hero" }: GlassHeaderProps) {
  const { phase, enterMarketplace, exitToDiscovery, exitToMarketplace } = useAppPhase();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const onHero = variant === "hero";

  const navItems = [
    { label: t.nav.home, action: "home" as const },
    { label: t.nav.properties, action: "properties" as const },
    { label: t.nav.projects, action: "projects" as const },
    { label: t.nav.market, action: "market" as const },
  ];

  useEffect(() => {
    if (!onHero) return;
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHero]);

  const handleNav = (action: (typeof navItems)[number]["action"]) => {
    if (pathname !== "/") {
      exitToDiscovery();
      router.push(action === "home" ? "/" : `/#${action}`);
      return;
    }
    switch (action) {
      case "home":
        if (phase === "workspace") {
          exitToMarketplace();
        } else if (phase !== "discovery") {
          exitToDiscovery();
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        break;
      case "properties":
        if (phase === "discovery") {
          document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
        } else {
          enterMarketplace();
        }
        break;
      case "projects":
      case "market":
        if (phase !== "discovery") {
          exitToDiscovery();
        }
        requestAnimationFrame(() => {
          document.getElementById(action)?.scrollIntoView({ behavior: "smooth" });
        });
        break;
      default: {
        const _exhaustive: never = action;
        return _exhaustive;
      }
    }
  };

  const handleLogoClick = () => {
    if (pathname !== "/") {
      exitToDiscovery();
      router.push("/");
      return;
    }
    if (phase === "workspace") {
      exitToMarketplace();
      return;
    }
    if (phase === "marketplace") {
      exitToDiscovery();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          onClick={handleLogoClick}
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="ZEUS home"
        >
          <BrandLogo size="header" tone={onHero ? "light" : "dark"} priority />
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
          {navItems.map(({ label, action }) => (
            <button
              key={action}
              type="button"
              onClick={() => handleNav(action)}
              className={cn(
                "group relative text-[13px] tracking-wide transition-colors",
                onHero ? "text-white/75 hover:text-white" : "text-neutral-500 hover:text-neutral-900",
                action === "properties" &&
                  (phase === "marketplace" || phase === "workspace") &&
                  (onHero ? "text-white" : "text-neutral-900"),
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

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher variant={variant} />
          <HeaderAuthActions onHero={onHero} />
          <MobileHeaderMenu onHero={onHero} />
        </div>
      </div>
    </header>
  );
}
