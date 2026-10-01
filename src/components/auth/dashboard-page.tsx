"use client";

import { UserAvatar } from "@/components/auth/user-avatar";
import { GlassHeader } from "@/components/discovery/glass-header";
import { getUserProfileHref, useAuth } from "@/context/auth-context";
import { useTranslation } from "@/context/locale-context";
import {
  fetchMyBookings,
  fetchSession,
  logoutUser,
  type AuthUser,
  type MyBooking,
} from "@/lib/auth-api";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshAuth, clearAuth } = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const session = await fetchSession();
      if (!session.authenticated || !session.user) {
        router.replace("/login?next=/dashboard");
        return;
      }

      setUser(session.user);
      await refreshAuth();

      const myBookings = await fetchMyBookings();
      setBookings(myBookings.bookings);

      setLoading(false);
    }

    void load();
  }, [router, refreshAuth]);

  const handleLogout = async () => {
    await logoutUser();
    clearAuth();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <GlassHeader variant="solid" />
        <p className="px-8 pt-28 text-sm text-neutral-500">{t.dashboard.loading}</p>
      </div>
    );
  }

  const displayName = user.name || user.email || user.username;

  return (
    <div className="min-h-screen bg-neutral-50">
      <GlassHeader variant="solid" />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-8">
        <p className="text-[10px] tracking-[0.24em] text-neutral-400 uppercase">{t.dashboard.eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-neutral-900">{t.dashboard.welcome(displayName)}</h1>
        <p className="mt-2 text-sm text-neutral-500">{t.dashboard.subtitle}</p>

        <section className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <UserAvatar
              name={user.name}
              email={user.email}
              href={getUserProfileHref(user)}
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-medium text-neutral-900">{displayName}</h2>
              <p className="mt-1 truncate text-sm text-neutral-500">{user.email}</p>
              <div className="mt-3">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                  {t.dashboard.statusVerified}
                </span>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] tracking-[0.12em] text-neutral-400 uppercase">
                {t.dashboard.accountEmail}
              </dt>
              <dd className="mt-1 text-sm text-neutral-800">{user.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.12em] text-neutral-400 uppercase">
                {t.dashboard.accountStatus}
              </dt>
              <dd className="mt-1 text-sm text-neutral-800">{t.dashboard.statusVerified}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-6 text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            {t.dashboard.logout}
          </button>
        </section>

        <section className="mt-10">
            <h2 className="font-serif text-xl text-neutral-900">{t.dashboard.yourBookings}</h2>
            {bookings.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">{t.dashboard.noBookings}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {bookings.map((booking) => {
                  const status = (booking.booking_status || "pending").toLowerCase();
                  return (
                    <li
                      key={`${booking.kind}-${booking.id}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-900">
                          {booking.listing_title || `Listing #${booking.listing_id}`}
                        </p>
                        <p className="mt-0.5 text-neutral-500">
                          {booking.check_in_date} → {booking.check_out_date}
                          {booking.number_of_guests
                            ? ` · ${t.dashboard.guestsCount(booking.number_of_guests)}`
                            : ""}
                          {booking.total_price != null
                            ? ` · ${formatCurrency(booking.total_price)}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-xs",
                          status === "confirmed" && "bg-emerald-50 text-emerald-700",
                          status === "cancelled" && "bg-red-50 text-red-700",
                          status !== "confirmed" &&
                            status !== "cancelled" &&
                            "bg-amber-50 text-amber-700",
                        )}
                      >
                        {t.dashboard.bookingStatus[status] ?? status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link
              href="/"
              className="mt-6 inline-block text-sm text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              {t.dashboard.browseHomes}
            </Link>
          </section>
      </main>
    </div>
  );
}
