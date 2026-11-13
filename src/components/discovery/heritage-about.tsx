"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  AirVent,
  Bath,
  BusFront,
  Coffee,
  KeyRound,
  Landmark,
  Luggage,
  Tv,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const SERVICES: {
  icon: LucideIcon;
  label: string;
  note?: string;
  noteBottom?: string;
}[] = [
  { icon: Landmark, label: "Acropolis Views" },
  { icon: KeyRound, label: "24H Self Check-in" },
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: AirVent, label: "Air Conditioning" },
  { icon: Coffee, label: "Coffee" },
  { icon: Tv, label: "Smart TV" },
  { icon: Bath, label: "Towels" },
  { icon: Luggage, label: "Luggage Storage" },
  {
    icon: BusFront,
    label: "Airport Transfer",
    note: "on request,",
    noteBottom: "with additional cost",
  },
];

// Photos live in public/after-hero-images. File names are case-sensitive on the
// server (".PNG"), so keep these paths exactly as the files are named.
const ABOUT_IMAGES = [
  {
    src: "/after-hero-images/1.PNG",
    alt: "Bright suite with a turquoise bed, sofa, desk and smart TV",
  },
  {
    src: "/after-hero-images/2.PNG",
    alt: "Sunlit suite with a city view, desk and fresh towels on the bed",
  },
  {
    src: "/after-hero-images/3.PNG",
    alt: "Living area with a yellow chair, white desk and beach artwork",
  },
] as const;

export function HeritageAbout() {
  const aboutImages = ABOUT_IMAGES;

  return (
    <section id="projects" className="scroll-mt-24 bg-[#f5f4f1] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-8 md:grid-cols-12 md:gap-20 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400">
            About Us
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-snug tracking-tight text-neutral-900 md:text-4xl">
            Your home deserves the most trusted curators in luxury hospitality.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">
            We assemble architecturally significant residences into a single,
            zero-refresh experience — from cinematic discovery to live map
            intelligence and seasonal booking analytics.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            Every listing is vetted for design integrity, host excellence, and
            operational discretion expected by high-net-worth travelers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 md:col-span-7"
        >
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[32px] bg-neutral-200">
            <Image
              src={aboutImages[0].src}
              alt={aboutImages[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200">
            <Image
              src={aboutImages[1].src}
              alt={aboutImages[1].alt}
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200 md:mt-12">
            <Image
              src={aboutImages[2].src}
              alt={aboutImages[2].alt}
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </motion.div>
      </div>

      <section
        id="services"
        aria-labelledby="services-title"
        className="mt-20 scroll-mt-24 border-t border-neutral-200/80 pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1400px] px-8 text-center md:px-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#a88a4f]">
            Amenities &amp; Services
          </p>
          <h2
            id="services-title"
            className="mt-3 font-serif text-3xl leading-tight tracking-tight text-neutral-900 md:text-4xl"
          >
            Everything handled, nothing fussy.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="services-marquee mt-10 overflow-hidden py-4"
        >
          <div className="services-marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className="flex shrink-0"
              >
                {SERVICES.map(({ icon: Icon, label, note, noteBottom }) => (
                  <li
                    key={label}
                    className="group mr-5 flex h-[190px] w-[240px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-[#c9a961]/70 px-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c9a961] hover:shadow-[0_0_0_1px_rgba(201,169,97,0.35),0_14px_36px_-16px_rgba(201,169,97,0.55)]"
                  >
                    <Icon
                      aria-hidden
                      strokeWidth={1.9}
                      className="h-10 w-10 text-[#b8934a] transition-colors duration-300 group-hover:text-[#9c7a35]"
                    />
                    <span className="font-serif text-xl leading-tight text-neutral-900">
                      {label}
                      {note ? (
                        <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                          {note}
                          {noteBottom ? (
                            <span className="block">{noteBottom}</span>
                          ) : null}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="market" className="mx-auto mt-20 max-w-[1400px] px-8 md:px-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400">
          Market Intelligence
        </p>
        <h3 className="mt-3 font-serif text-2xl text-neutral-900">
          Seasonal pricing across elite destinations
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
          Explore our marketplace to filter by season, rate, property type, and
          VIP amenities — with live map synchronization on every selection.
        </p>
      </section>
    </section>
  );
}
