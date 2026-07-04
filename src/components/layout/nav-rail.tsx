"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useSaves } from "@/context/saves-context";
import { usePreferences } from "@/context/preferences-context";
import { useViewMode } from "@/context/view-mode-context";
import { cn } from "@/lib/utils";
import {
  AtSign,
  Compass,
  Globe,
  Heart,
  Map,
  MessageCircle,
  Settings,
  Share2,
} from "lucide-react";

function RailIcon({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="w-full">
      <button
        type="button"
        aria-label={label}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        className="group relative flex h-12 w-full items-center justify-center"
      >
        <span
          className={cn(
            "absolute left-0 h-5 w-px origin-center bg-white transition-transform duration-300",
            active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
          )}
        />
        <span
          className={cn(
            "transition-colors duration-300",
            active ? "text-white" : "text-neutral-500 group-hover:text-white",
          )}
        >
          {children}
        </span>
      </button>
    </li>
  );
}

function SocialLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="w-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group relative flex h-11 w-full items-center justify-center"
      >
        <span className="absolute left-0 h-4 w-px scale-y-0 bg-white transition-transform duration-300 group-hover:scale-y-100" />
        <span className="text-neutral-500 transition-colors duration-300 group-hover:text-white">
          {children}
        </span>
      </a>
    </li>
  );
}

export function NavRail() {
  const { phase, exitToDiscovery, exitToMarketplace } = useAppPhase();
  const { mode, setMode } = useViewMode();
  const { openMessages, openSettings } = usePreferences();
  const { openSavesDrawer, savesDrawerOpen, savedIds } = useSaves();

  return (
    <nav
      aria-label="Primary navigation"
      className="flex h-full w-[76px] shrink-0 flex-col items-center bg-neutral-950 py-10"
    >
      <button
        type="button"
        onClick={() => (phase === "workspace" ? exitToMarketplace() : exitToDiscovery())}
        aria-label="Home"
        className="group relative mb-12 flex h-10 w-10 items-center justify-center"
      >
        <span className="absolute left-0 h-5 w-px scale-y-0 bg-white transition-transform duration-300 group-hover:scale-y-100" />
        <span className="text-[10px] font-semibold tracking-[0.28em] text-neutral-500 transition-colors duration-300 group-hover:text-white">
          MO
        </span>
      </button>

      <ul className="flex w-full flex-col items-center gap-1">
        <RailIcon
          label="Explore Gallery"
          active={mode === "gallery"}
          onClick={() => setMode("gallery")}
        >
          <Compass className="h-[18px] w-[18px] stroke-[1.5]" />
        </RailIcon>
        <RailIcon label="Map" active={mode === "map"} onClick={() => setMode("map")}>
          <Map className="h-[18px] w-[18px] stroke-[1.5]" />
        </RailIcon>
        <RailIcon
          label="Saved Listings"
          active={savesDrawerOpen}
          onClick={openSavesDrawer}
        >
          <div className="relative">
            <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
            {savedIds.size > 0 && (
              <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </div>
        </RailIcon>
        <RailIcon label="Messages" onClick={openMessages}>
          <MessageCircle className="h-[18px] w-[18px] stroke-[1.5]" />
        </RailIcon>
        <RailIcon label="Settings" onClick={openSettings}>
          <Settings className="h-[18px] w-[18px] stroke-[1.5]" />
        </RailIcon>
      </ul>

      <div className="flex-1" aria-hidden />

      <ul className="flex w-full flex-col items-center gap-1 pb-2">
        <SocialLink label="Instagram" href="https://instagram.com">
          <Share2 className="h-[17px] w-[17px] stroke-[1.5]" />
        </SocialLink>
        <SocialLink label="LinkedIn" href="https://linkedin.com">
          <Globe className="h-[17px] w-[17px] stroke-[1.5]" />
        </SocialLink>
        <SocialLink label="Threads" href="https://threads.net">
          <AtSign className="h-[17px] w-[17px] stroke-[1.5]" />
        </SocialLink>
      </ul>
    </nav>
  );
}
