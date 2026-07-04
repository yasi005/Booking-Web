"use client";

import { usePreviewProperty } from "@/hooks/use-preview-property";
import { useSaves } from "@/context/saves-context";
import { formatCurrency } from "@/lib/utils";
import { getAnchorRate } from "@/lib/property-utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";

export function FavoritesDrawer() {
  const { savesDrawerOpen, closeSavesDrawer, savedProperties, isSaved, toggleSave } =
    useSaves();
  const previewProperty = usePreviewProperty();

  return (
    <AnimatePresence>
      {savesDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px]"
            onClick={closeSavesDrawer}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-[76px] z-[70] flex h-full w-[min(100%,360px)] flex-col border-r border-neutral-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                  Saved Listings
                </p>
                <h3 className="mt-1 font-serif text-xl text-neutral-900">
                  Your favorites
                </h3>
              </div>
              <button
                type="button"
                onClick={closeSavesDrawer}
                aria-label="Close"
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {savedProperties.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-neutral-500">
                  Tap the heart on any listing to save it here.
                </p>
              ) : (
                <ul className="space-y-3">
                  {savedProperties.map((property) => (
                    <li
                      key={property.id}
                      className="flex gap-3 rounded-xl border border-neutral-100 p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={property.previewImage ?? property.image}
                          alt={property.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {property.name}
                        </p>
                        <p className="text-xs text-neutral-500">{property.location}</p>
                        <p className="mt-1 text-xs font-medium text-neutral-800">
                          {formatCurrency(getAnchorRate(property))}
                          <span className="font-normal text-neutral-400"> / night</span>
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => previewProperty(property)}
                            className="text-[11px] font-medium text-neutral-900 underline-offset-2 hover:underline"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSave(property.id)}
                            className="text-neutral-400 hover:text-neutral-900"
                            aria-label="Remove save"
                          >
                            <Heart className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
