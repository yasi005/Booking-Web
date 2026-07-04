"use client";

import { motion } from "framer-motion";

type KineticTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function KineticText({ text, className, delay = 0 }: KineticTextProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${text}-${index}`}
          initial={{ opacity: 0, x: -3 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.22,
            delay: delay + index * 0.018,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
