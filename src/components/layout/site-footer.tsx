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
  "text-[10px] font-medium uppercase tracking-[0.24em] text-[#c9a961]";
const linkClass =
  "inline-flex items-center gap-1.5 text-[13px] text-zinc-300 transition-colors hover:text-[#c9a961]";

export function SiteFooter() {
  const { t, locale } = useTranslation();
  const year = new Date().getFullYear();
  const neighborhood =
    locale === "el"
      ? FOOTER_LOCATION.neighborhoodEl
      : FOOTER_LOCATION.neighborhoodEn;

  return (
    <footer className="bg-neutral-950 text-zinc-400">
      <div className="mx-auto max-w-[1400px] px-6 py-5 sm:px-8 md:px-16">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block opacity-90 transition hover:opacity-100">
              <BrandLogo size="compact" />
            </Link>
            <p className="mt-2 max-w-[220px] font-serif text-sm leading-snug text-zinc-300">
              {t.footer.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label={t.footer.explore}>
            <p className={headingClass}>{t.footer.explore}</p>
            <ul className="mt-2 space-y-1.5">
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
            <ul className="mt-2 space-y-1.5">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className={linkClass}>
                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {WHATSAPP_DISPLAY}
                </a>
                <p className="mt-0.5 pl-5 text-[10px] text-zinc-500">
                  {t.footer.callHours}
                </p>
              </li>
              <li className="flex items-start gap-1.5 text-[13px] text-zinc-300">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  {FOOTER_LOCATION.addressLine}, {neighborhood}
                  <span className="block text-[10px] text-zinc-500">
                    {t.footer.floor(FOOTER_LOCATION.floor)}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-2 lg:col-span-4">
            <p className={headingClass}>{t.footer.thePoint}</p>
            <div className="mt-2">
              <FooterLocationMap />
            </div>
            <div className="mt-1.5 flex gap-4 text-[11px]">
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

        <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-zinc-500">
          <p>
            © {year} {t.footer.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
