"use client";

import { getUserInitials, getUserProfileHref, useAuth } from "@/context/auth-context";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MobileHeaderMenuProps = {
  onHero?: boolean;
};

export function MobileHeaderMenu({ onHero = false }: MobileHeaderMenuProps) {
  const { phase, enterMarketplace, exitToDiscovery, exitToMarketplace } = useAppPhase();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, action: "home" as const },
    { label: t.nav.properties, action: "properties" as const },
    { label: t.nav.projects, action: "projects" as const },
    { label: t.nav.market, action: "market" as const },
  ];

  const handleNav = (action: (typeof navItems)[number]["action"]) => {
    setOpen(false);
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
        enterMarketplace();
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

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden",
          onHero
            ? "border-white/20 bg-black/20 text-white"
            : "border-neutral-200 bg-white text-neutral-700",
        )}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="mx-4 mt-[calc(4.5rem+env(safe-area-inset-top))] rounded-3xl border border-white/10 bg-neutral-950/95 p-5 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 text-[10px] tracking-[0.24em] text-white/50 uppercase">
                Navigation
              </p>
              <ul className="space-y-1">
                {navItems.map(({ label, action }) => (
                  <li key={action}>
                    <button
                      type="button"
                      onClick={() => handleNav(action)}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm tracking-wide text-white/85 transition hover:bg-white/10"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              {!loading && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  {user ? (
                    <Link
                      href={getUserProfileHref(user)}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-medium text-white">
                        {getUserInitials(user.name, user.email)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{user.name || user.email}</p>
                        <p className="text-xs text-white/50">{t.nav.myAccount}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="rounded-2xl px-4 py-3 text-center text-sm text-white/85 transition hover:bg-white/10"
                      >
                        {t.nav.login}
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-neutral-950"
                      >
                        {t.nav.signup}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
