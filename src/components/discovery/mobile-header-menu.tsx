"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Home", action: "home" as const },
  { label: "Properties", action: "properties" as const },
  { label: "Our Projects", action: "projects" as const },
  { label: "Market", action: "market" as const },
];

type MobileHeaderMenuProps = {
  onHero?: boolean;
};

export function MobileHeaderMenu({ onHero = false }: MobileHeaderMenuProps) {
  const { enterMarketplace, exitToDiscovery } = useAppPhase();
  const [open, setOpen] = useState(false);

  const handleNav = (action: (typeof navItems)[number]["action"]) => {
    setOpen(false);
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
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => handleNav(action)}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm tracking-wide text-white/85 transition hover:bg-white/10"
                    >
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link
                    href="/sandbox"
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm tracking-wide text-amber-300/90 transition hover:bg-white/10"
                  >
                    KINETIC.OS Sandbox
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
