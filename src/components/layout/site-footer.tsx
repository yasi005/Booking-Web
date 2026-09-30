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
    <footer className="border-t border-neutral-200 bg-neutral-950 text-zinc-300">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 py-12 sm:px-8 md:px-16 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-block opacity-90 transition hover:opacity-100">
              <BrandLogo size="auth" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{t.footer.tagline}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                {t.footer.contact}
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-200 transition hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {t.footer.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    className="inline-flex items-center gap-2 text-zinc-200 transition hover:text-white"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden />
                    {WHATSAPP_DISPLAY}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                {t.footer.explore}
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-zinc-200 transition hover:text-white">
                    {t.nav.home}
                  </Link>
                </li>
                <li>
                  <a href="#properties" className="text-zinc-200 transition hover:text-white">
                    {t.nav.properties}
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-zinc-200 transition hover:text-white">
                    {t.nav.login}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-zinc-200 transition hover:text-white">
                    {t.nav.signup}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t.footer.brand}. {t.footer.rights}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/30 hover:bg-white/10"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            {t.footer.chatWhatsapp}
          </a>
        </div>
      </div>
    </footer>
  );
}
