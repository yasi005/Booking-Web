"use client";

import { CinematicPropertyCard } from "@/components/marketplace/cinematic-property-card";
import { buildEditorialLayout } from "@/lib/editorial-grid";
import type { Property } from "@/types/property";
import { LayoutGroup, motion } from "framer-motion";

type EditorialPropertyGridProps = {
  properties: Property[];
  revealFromIndex?: number;
};

const itemReveal = (delay: number) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  },
});

function revealDelay(index: number, revealFromIndex: number) {
  return index >= revealFromIndex ? (index - revealFromIndex) * 0.06 : 0;
}

export function EditorialPropertyGrid({
  properties,
  revealFromIndex = 0,
}: EditorialPropertyGridProps) {
  const { featured, rows } = buildEditorialLayout(properties);
  let propertyIndex = 0;

  return (
    <LayoutGroup>
      <div className="space-y-10 md:space-y-14 lg:space-y-16">
        {featured && (() => {
          const index = propertyIndex++;
          return (
            <motion.div
              key={featured.id}
              layout
              initial={index >= revealFromIndex ? "hidden" : false}
              animate="show"
              variants={itemReveal(revealDelay(index, revealFromIndex))}
              className="w-full px-4 sm:px-8 md:px-12 lg:px-16"
            >
              <CinematicPropertyCard property={featured} size="featured" />
            </motion.div>
          );
        })()}

        {rows.map((row) => (
          <div
            key={`row-${row.map((p) => p.id).join("-")}`}
            className="grid grid-cols-1 gap-x-4 gap-y-8 px-4 sm:grid-cols-2 sm:gap-x-6 sm:px-8 md:px-12 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 lg:px-16"
          >
            {row.map((property) => {
              const index = propertyIndex++;
              const shouldReveal = index >= revealFromIndex;

              return (
                <motion.div
                  key={property.id}
                  layout
                  initial={shouldReveal ? "hidden" : false}
                  animate="show"
                  variants={itemReveal(revealDelay(index, revealFromIndex))}
                  className="min-w-0"
                >
                  <CinematicPropertyCard property={property} size="standard" />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}
