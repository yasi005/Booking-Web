"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

type CursorLabel = "EXPLORE" | "HOLD TO BOOK" | null;

export function MagneticCursor() {
  const [label, setLabel] = useState<CursorLabel>(null);
  const [visible, setVisible] = useState(false);
  const cursorX = useSpring(0, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 28 });
  const scale = useSpring(1, { stiffness: 500, damping: 30 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setVisible(true);
    document.body.classList.add("luxury-cursor");

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-magnetic]");
      if (!magnetic) {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        scale.set(1);
        setLabel(null);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-magnetic]") as HTMLElement | null;
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        cursorX.set(rect.left + rect.width / 2);
        cursorY.set(rect.top + rect.height / 2);
        scale.set(2.2);
        setLabel((magnetic.dataset.magnetic as CursorLabel) ?? "EXPLORE");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      document.body.classList.remove("luxury-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, scale]);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center"
      style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        style={{ scale }}
        className="flex h-3 w-3 items-center justify-center rounded-full border border-neutral-900/80 bg-white/90 backdrop-blur-sm"
      >
        {label && (
          <span className="absolute -bottom-6 whitespace-nowrap text-[9px] font-medium tracking-[0.2em] text-neutral-800">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
