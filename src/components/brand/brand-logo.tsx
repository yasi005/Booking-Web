import { cn } from "@/lib/utils";
import Image from "next/image";

/** Replace `book/public/zeus-logo.webp` to update the site logo. */
export const BRAND_LOGO_SRC = "/zeus-logo.webp";

const SIZE_CLASS = {
  /** Mobile header / tight nav bars */
  compact: "h-7 w-auto sm:h-8",
  /** Main site header */
  header: "h-8 w-auto sm:h-10",
  /** Auth pages */
  auth: "h-9 w-auto sm:h-11",
} as const;

/** Source asset is white; `dark` maps it to near-black for light backgrounds. */
const TONE_CLASS = {
  light: "",
  dark: "brightness-0",
} as const;

type BrandLogoProps = {
  size?: keyof typeof SIZE_CLASS;
  /** `light` for dark/hero surfaces; `dark` for white headers/pages. */
  tone?: keyof typeof TONE_CLASS;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = "header",
  tone = "light",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt="ZEUS"
      width={96}
      height={128}
      priority={priority}
      className={cn(
        "w-auto shrink-0 object-contain object-left",
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        className,
      )}
    />
  );
}
