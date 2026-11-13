"use client";

import { MobileHeaderMenu } from "@/components/discovery/mobile-header-menu";
import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { brandNavyGoldBgClass } from "@/lib/brand-gradient";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** Scroll distance (px) over which the header fades from glass to navy→gold. */
const COLOR_RAMP = 160;

type GlassHeaderProps = {
  variant?: "hero" | "solid";
};

export function GlassHeader({ variant = "hero" }: GlassHeaderProps) {
  const { phase, enterMarketplace, exitToDiscovery, exitToMarketplace } = useAppPhase();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const onHero = variant === "hero";
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const gradientOpacity = useTransform(scrollY, (y) => {
    if (!onHero) return 1;
    const t = y / COLOR_RAMP;
    return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); // smoothstep
  });
  const smoothOpacity = useSpring(gradientOpacity, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const navItems = [
    { label: t.nav.home, action: "home" as const },
    { label: t.nav.properties, action: "properties" as const },
    { label: t.nav.projects, action: "projects" as const },
    { label: t.nav.market, action: "market" as const },
  ];

  useEffect(() => {
    if (!onHero) return;
    scrollY.set(window.scrollY);
  }, [onHero, scrollY]);

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
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-white/10 pt-[env(safe-area-inset-top)] backdrop-blur-md"
    >
      <motion.div
        aria-hidden
        style={{ opacity: smoothOpacity }}
        className={cn(
          "pointer-events-none absolute inset-0",
          brandNavyGoldBgClass,
        )}
      />
      <div className="relative mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8 md:px-12 lg:px-16">
        <button
          type="button"
          onClick={handleLogoClick}
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="ZEUS home"
        >
          <BrandLogo size="header" tone="light" priority />
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
          {navItems.map(({ label, action }) => (
            <button
              key={action}
              type="button"
              onClick={() => handleNav(action)}
              className={cn(
                "group relative text-[13px] tracking-wide text-white/80 transition-colors hover:text-white",
                action === "properties" &&
                  (phase === "marketplace" || phase === "workspace") &&
                  "text-white",
              )}
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher variant="hero" />
          <HeaderAuthActions onHero />
          <MobileHeaderMenu onHero />
        </div>
      </div>
    </header>
  );
}
