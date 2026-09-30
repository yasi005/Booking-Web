"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { useTranslation } from "@/context/locale-context";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "306932906966";
const WHATSAPP_DISPLAY = "+30 693 290 6966";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-zinc-400">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-16">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/" className="shrink-0 opacity-90 transition hover:opacity-100">
            <BrandLogo size="compact" />
          </Link>
          <p className="text-[11px] text-zinc-500">
            © {year} {t.footer.brand}. {t.footer.rights}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 transition hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.footer.whatsapp}
          </a>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="inline-flex items-center gap-1.5 text-zinc-300 transition hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {WHATSAPP_DISPLAY}
          </a>
          <Link href="/" className="text-zinc-300 transition hover:text-white">
            {t.nav.home}
          </Link>
          <a href="#properties" className="text-zinc-300 transition hover:text-white">
            {t.nav.properties}
          </a>
        </div>
      </div>
    </footer>
  );
}
