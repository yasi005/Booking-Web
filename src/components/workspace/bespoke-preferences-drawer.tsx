"use client";

import { usePreferences } from "@/context/preferences-context";
import { useCryptoRate } from "@/context/preferences-context";
import { cn, formatPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 py-5">
      <div>
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-neutral-900" : "bg-neutral-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export function BespokePreferencesDrawer() {
  const {
    settingsOpen,
    messagesOpen,
    closeDrawers,
    cryptoMode,
    discretionMode,
    helipadAccess,
    helipadSpecs,
    toggleCrypto,
    toggleDiscretion,
    toggleHelipad,
    setHelipadSpecs,
  } = usePreferences();
  const btcRate = useCryptoRate();

  const isOpen = settingsOpen || messagesOpen;
  const isMessages = messagesOpen;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
            onClick={closeDrawers}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 z-[70] flex h-full w-[min(100%,420px)] flex-col border-l border-neutral-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                  {isMessages ? "Concierge" : "Bespoke Preferences"}
                </p>
                <h3 className="mt-1 font-serif text-xl text-neutral-900">
                  {isMessages ? "Private Inquiry" : "HNW Settings"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDrawers}
                aria-label="Close"
                className="text-neutral-400 transition hover:text-neutral-900"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {isMessages ? (
                <div className="py-6">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Your inquiry will be handled with complete discretion. A senior estate
                    advisor typically responds within two hours.
                  </p>
                  <textarea
                    className="mt-6 h-36 w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-700 outline-none focus:border-neutral-300"
                    placeholder="Describe your ideal stay, party size, and any bespoke requirements..."
                  />
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-neutral-900 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Send Secure Inquiry
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <Toggle
                    label="Cryptocurrency Valuation"
                    description="Display all rates in Bitcoin with a live mock asset transition."
                    checked={cryptoMode}
                    onChange={toggleCrypto}
                  />
                  <Toggle
                    label="Discretion Mode"
                    description="Blurs sensitive pricing and booking data — ideal for public lounges and airport lounges."
                    checked={discretionMode}
                    onChange={toggleDiscretion}
                  />
                  <Toggle
                    label="Private Helipad Access"
                    description="Elite addon with nested concierge intake for helicopter specifications."
                    checked={helipadAccess}
                    onChange={toggleHelipad}
                  />
                  <AnimatePresence>
                    {helipadAccess && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                            Helicopter Specs
                          </p>
                          <input
                            type="text"
                            value={helipadSpecs}
                            onChange={(e) => setHelipadSpecs(e.target.value)}
                            placeholder="Aircraft model, tail number, ETA..."
                            className="mt-3 w-full border-b border-neutral-200 bg-transparent py-2 text-sm text-neutral-700 outline-none"
                          />
                          <p className="mt-3 text-xs text-neutral-500">
                            Addon estimate:{" "}
                            <span className="font-medium text-neutral-800">
                              {formatPrice(2800, cryptoMode, btcRate)}
                            </span>
                            <span className="text-neutral-400"> / landing</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
