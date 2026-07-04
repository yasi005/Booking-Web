"use client";

import { useAppPhase } from "@/context/app-phase-context";
import Image from "next/image";
import { Star } from "lucide-react";

export function HostValidationCard() {
  const { selectedProperty } = useAppPhase();
  const { host } = selectedProperty;

  return (
    <section className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
      <div className="flex gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={host.image}
            alt={host.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900">{host.name}</p>
          <p className="text-xs text-neutral-500">{host.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-700">
              ★ {host.rating.toFixed(2)}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500">
              {host.reviewCount} Reviews
            </span>
            <span className="flex gap-0.5 text-neutral-900">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-neutral-900 stroke-none"
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
