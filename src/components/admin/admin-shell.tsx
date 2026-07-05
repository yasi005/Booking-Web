"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { useTranslation } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";

type AdminShellProps = {
  children: ReactNode;
  username?: string;
  onSync?: () => void;
  syncing?: boolean;
  notice?: string | null;
};

export function AdminShell({
  children,
  username,
  onSync,
  syncing = false,
  notice,
}: AdminShellProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/admin", label: t.admin.properties },
    { href: "/admin/users", label: t.admin.users },
    { href: "/admin/properties/new", label: t.admin.newProperty },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <GlassHeader variant="solid" />

      <div className="border-b border-neutral-200 bg-white pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[72px]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-16">
          <div>
            <p className="text-[10px] font-medium tracking-[0.24em] text-neutral-400 uppercase">
              {t.admin.title}
            </p>
            <h1 className="mt-1 font-serif text-2xl text-neutral-900 md:text-3xl">
              {t.admin.subtitle}
            </h1>
            {username && (
              <p className="mt-1 text-sm text-neutral-500">Signed in as {username}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              {t.admin.backToSite}
            </Link>
            {onSync && (
              <button
                type="button"
                onClick={onSync}
                disabled={syncing}
                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {syncing ? "…" : t.admin.syncHostaway}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                fetch("/backend/logout", { method: "POST", credentials: "include" }).finally(() => {
                  router.push("/staff");
                });
              }}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              {t.admin.logout}
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1600px] gap-2 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm whitespace-nowrap transition",
                pathname === item.href
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {notice && (
        <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:px-8 lg:px-16">
          {notice}
        </div>
      )}

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-16">{children}</main>
    </div>
  );
}
