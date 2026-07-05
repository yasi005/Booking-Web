"use client";

import { UserAvatar } from "@/components/auth/user-avatar";
import { getUserProfileHref, useAuth } from "@/context/auth-context";
import { useTranslation } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

type HeaderAuthActionsProps = {
  onHero?: boolean;
};

export function HeaderAuthActions({ onHero = false }: HeaderAuthActionsProps) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <div className="h-10 w-20" aria-hidden />;
  }

  if (user) {
    return (
      <UserAvatar
        name={user.name}
        email={user.email}
        href={getUserProfileHref(user)}
        onHero={onHero}
      />
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={cn(
          "hidden text-[13px] tracking-wide transition-colors sm:inline",
          onHero ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-neutral-900",
        )}
      >
        {t.nav.login}
      </Link>
      <Link
        href="/signup"
        className={cn(
          "hidden rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition sm:inline",
          onHero
            ? "bg-white text-neutral-950 hover:bg-white/90"
            : "bg-neutral-950 text-white hover:bg-neutral-800",
        )}
      >
        {t.nav.signup}
      </Link>
    </>
  );
}
