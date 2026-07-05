"use client";

import { useLocale } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

type LanguageSwitcherProps = {
  variant?: "hero" | "solid";
};

export function LanguageSwitcher({ variant = "hero" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const onHero = variant === "hero";

  const options: Array<{ id: Locale; label: string }> = [
    { id: "en", label: t.language.en },
    { id: "el", label: t.language.el },
  ];

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5",
        onHero ? "border-white/20 bg-black/20" : "border-neutral-200 bg-neutral-50",
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setLocale(option.id)}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition sm:px-3",
            locale === option.id
              ? onHero
                ? "bg-white text-neutral-950"
                : "bg-neutral-900 text-white"
              : onHero
                ? "text-white/70 hover:text-white"
                : "text-neutral-500 hover:text-neutral-900",
          )}
          aria-pressed={locale === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
