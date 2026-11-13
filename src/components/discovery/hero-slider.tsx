"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Hero photos live in `public/hero/new/`. File names are case-sensitive on the
 * server (note "5.JPG"), so keep these paths exactly as the files are named. */
const HERO_IMAGES: { src: string; alt: string; durationMs?: number }[] = [
  // Opening shot: held longer so the Acropolis view sets the scene.
  {
    src: "/hero/new/1-10s.jpeg",
    alt: "The Acropolis above a forest of pines at golden hour",
    durationMs: 10_000,
  },
  { src: "/hero/new/2.jpeg", alt: "The Panathenaic Stadium lit at night under a full moon, Acropolis beyond" },
  { src: "/hero/new/3.jpeg", alt: "The Acropolis above a forest of pines at golden hour" },
  { src: "/hero/new/4.png", alt: "Bright suite with a turquoise bed, sofa, glass table and desk" },
  { src: "/hero/new/5.JPG", alt: "Suite with cherry-blossom wallpaper and a gold-framed glass partition" },
];

/** How long every other slide stays on screen. */
const SLIDE_MS = 5000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  // Each slide schedules the next one, so slides can have their own duration.
  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((current) => (current + 1) % HERO_IMAGES.length),
      HERO_IMAGES[index].durationMs ?? SLIDE_MS,
    );
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="absolute inset-0 bg-neutral-900">
      {HERO_IMAGES.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          // `priority` is deprecated in Next 16 — `preload` the first frame, eager-load the rest
          // so a slide is never mid-download when its turn comes around.
          preload={i === 0}
          loading="eager"
          quality={90}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
