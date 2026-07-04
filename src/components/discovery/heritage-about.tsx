"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeritageAbout() {
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
              src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial architectural interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200">
            <Image
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
              alt="Architectural detail"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200 md:mt-12">
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
              alt="Luxury estate exterior"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </motion.div>
      </div>

      <section id="market" className="mx-auto mt-24 max-w-[1400px] border-t border-neutral-200/80 px-8 pt-20 md:px-16">
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

      <footer className="mx-auto mt-20 max-w-[1400px] border-t border-neutral-200/80 px-8 py-12 md:px-16">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Premium Real Estate & Venue Experience Hub
        </p>
      </footer>
    </section>
  );
}
