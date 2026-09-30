"use client";

import { AvailabilityCalendar } from "@/components/editorial/availability-calendar";
import {
  createBookingInquiry,
  fetchListingAvailability,
  fetchSession,
  type AuthUser,
} from "@/lib/auth-api";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { useTranslation } from "@/context/locale-context";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

type BookingReservePanelProps = {
  property: Property;
};

/** View-only availability calendar — place in the scrolling editorial column. */
export function BookingAvailabilitySection({ property }: BookingReservePanelProps) {
  const { t } = useTranslation();

  return (
    <section className="mt-8">
      <div>
        <h3 className="font-serif text-xl tracking-tight text-neutral-900">
          {t.booking.calendarTitle}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{t.booking.calendarSubtitle}</p>
      </div>
      <AvailabilityCalendar listingId={property.id} />
    </section>
  );
}

/**
 * Sticky Reserve bar at the bottom of the property panel.
 * Opens a form prefilled from the signed-in profile, then sends to WhatsApp.
 */
export function BookingReserveDock({ property }: BookingReservePanelProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      try {
        const session = await fetchSession();
        if (cancelled) return;
        if (!session.authenticated || !session.user) {
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
          return;
        }
        setUser(session.user);
        setName(session.user.name?.trim() || "");
        setPhone(session.user.phone?.trim() || "");
        setError(null);
        setStatus(null);
      } catch {
        if (!cancelled) setError(t.auth.errors.generic);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, t.auth.errors.generic]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const handleReserve = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!phone.trim()) {
        setError(t.booking.phoneMissing);
        return;
      }
      if (!checkIn || !checkOut) {
        setError(t.booking.datesRequired);
        return;
      }

      const availability = await fetchListingAvailability(property.id, checkIn, checkOut);
      if (!availability.available) {
        setError(t.booking.unavailable);
        return;
      }

      const nightly = property.rent;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
      const totalPrice = nightly * nights;

      const result = await createBookingInquiry({
        listingId: Number(property.id),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        listingTitle: property.name,
        totalPrice,
        currency: "EUR",
        guestName: name.trim() || undefined,
        guestPhone: phone.trim(),
        message: message.trim() || undefined,
      });

      if (result.waLink) {
        window.open(result.waLink, "_blank", "noopener,noreferrer");
      }

      setStatus(t.booking.confirmed);
    } catch (sendError) {
      setError(getAuthErrorMessage(sendError, t.auth.errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="shrink-0 border-t border-neutral-200 bg-white/95 px-6 py-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">{property.name}</p>
            <p className="text-xs text-neutral-500">
              {t.booking.from} {formatCurrency(property.rent)} {t.editorial.perNight}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="shrink-0 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white"
          >
            {t.booking.openReserve}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          role="presentation"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <h3 id={titleId} className="font-serif text-xl text-neutral-900">
                  {t.booking.formTitle}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">{t.booking.formSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
                aria-label={t.booking.closeForm}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <label className="block text-xs text-neutral-500">
                {t.auth.name}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900"
                />
              </label>

              <label className="block text-xs text-neutral-500">
                {t.auth.phone}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900"
                />
              </label>

              {user?.email && (
                <p className="text-xs text-neutral-400">
                  {t.auth.email}: {user.email}
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-neutral-500">
                  {t.booking.checkIn}
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                  />
                </label>
                <label className="text-xs text-neutral-500">
                  {t.booking.checkOut}
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                  />
                </label>
              </div>

              <label className="block text-xs text-neutral-500">
                {t.booking.guests}
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </label>

              <label className="block text-xs text-neutral-500">
                {t.booking.message}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder={t.booking.messagePlaceholder}
                  className="mt-1 w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {status && <p className="text-sm text-emerald-700">{status}</p>}

              <p className="text-center text-xs text-neutral-400">
                <Link href="/signup" className="underline">
                  {t.auth.signupSubmit}
                </Link>
                {" · "}
                <Link href="/login" className="underline">
                  {t.nav.login}
                </Link>
              </p>
            </div>

            <div className="border-t border-neutral-100 px-5 py-4">
              <button
                type="button"
                disabled={loading || Boolean(status)}
                onClick={() => void handleReserve()}
                className="w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading ? "…" : t.booking.reserve}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** @deprecated Prefer BookingAvailabilitySection + BookingReserveDock */
export function BookingReservePanel({ property }: BookingReservePanelProps) {
  return <BookingAvailabilitySection property={property} />;
}
