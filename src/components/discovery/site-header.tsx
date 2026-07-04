"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Properties", href: "#properties" },
  { label: "Our Projects", href: "#projects" },
  { label: "Market", href: "#market" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-neutral-200/60 bg-white/85 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-8 md:px-12 lg:px-16">
        <Link
          href="#"
          className="font-serif text-xl tracking-[0.12em] text-neutral-900 transition-opacity hover:opacity-70"
        >
          REMAX
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 md:flex"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="group relative text-[13px] tracking-wide text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-neutral-900 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            className="text-[13px] tracking-wide text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Log In
          </button>
          <button
            type="button"
            className="rounded-full bg-neutral-950 px-5 py-2.5 text-[13px] font-medium tracking-wide text-white transition hover:bg-neutral-800"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
