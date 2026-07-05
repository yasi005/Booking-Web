"use client";

import { getUserInitials } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  href: string;
  size?: "sm" | "md";
  onHero?: boolean;
  className?: string;
};

export function UserAvatar({
  name,
  email,
  href,
  size = "md",
  onHero = false,
  className,
}: UserAvatarProps) {
  const initials = getUserInitials(name, email);
  const dimension = size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm";

  return (
    <Link
      href={href}
      aria-label="My account"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium transition hover:ring-2 hover:ring-offset-2",
        dimension,
        onHero
          ? "bg-white/15 text-white ring-white/20 hover:ring-white/40 hover:ring-offset-black/20"
          : "bg-neutral-900 text-white ring-neutral-200 hover:ring-neutral-300 hover:ring-offset-white",
        className,
      )}
    >
      {initials}
    </Link>
  );
}
