"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import {
  APPLE_MAPS_URL,
  FOOTER_LOCATION,
  FooterLocationMap,
  GOOGLE_MAPS_URL,
} from "@/components/layout/footer-location-map";
import { useTranslation } from "@/context/locale-context";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "306932906966";
const WHATSAPP_DISPLAY = "+30 693 290 6966";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const headingClass =
  "text-[11px] font-medium uppercase tracking-[0.28em] text-[#c9a961]";
const linkClass =
  "inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-[#c9a961]";

export function SiteFooter() {
  const { t, locale } = useTranslation();
  const year = new Date().getFullYear();
  const neighborhood =
    locale === "el"
      ? FOOTER_LOCATION.neighborhoodEl
      : FOOTER_LOCATION.neighborhoodEn;

  return (
    <footer className="bg-neutral-950 text-zinc-400">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8 sm:px-8 md:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block opacity-90 transition hover:opacity-100">
              <BrandLogo size="compact" />
            </Link>
            <p className="mt-5 max-w-xs font-serif text-lg leading-snug text-zinc-200">
              {t.footer.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label={t.footer.explore}>
            <p className={headingClass}>{t.footer.explore}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/" className={linkClass}>
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <a href="#properties" className={linkClass}>
                  {t.nav.properties}
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <p className={headingClass}>{t.footer.contact}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className={linkClass}>
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {WHATSAPP_DISPLAY}
                </a>
                <p className="mt-1 pl-6 text-xs text-zinc-500">
                  {t.footer.callHours}
                </p>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  {FOOTER_LOCATION.addressLine}, {neighborhood}
                  <span className="block text-xs text-zinc-500">
                    {t.footer.floor(FOOTER_LOCATION.floor)}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-2 lg:col-span-3">
            <p className={headingClass}>{t.footer.thePoint}</p>
            <div className="mt-5">
              <FooterLocationMap />
            </div>
            <div className="mt-3 flex gap-5 text-xs">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-[#c9a961]"
              >
                Google Maps <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
              <a
                href={APPLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-[#c9a961]"
              >
                Apple Maps <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-xs text-zinc-500">
          <p>
            © {year} {t.footer.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
