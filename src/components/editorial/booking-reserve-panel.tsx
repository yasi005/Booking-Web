"use client";

import { AvailabilityCalendar } from "@/components/editorial/availability-calendar";
import { createBooking, fetchListingAvailability, fetchSession } from "@/lib/auth-api";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { useTranslation } from "@/context/locale-context";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import Link from "next/link";
import { useState } from "react";

type BookingReservePanelProps = {
  property: Property;
};

export function BookingReservePanel({ property }: BookingReservePanelProps) {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const session = await fetchSession();
      if (!session.authenticated || !session.user) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
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

      const name = session.user.name ?? "Guest";
      const [firstName, ...rest] = name.split(" ");

      await createBooking({
        listingId: Number(property.id),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestFirstName: firstName,
        guestLastName: rest.join(" ") || "Guest",
        guestEmail: session.user.email ?? "",
        guestPhone: "+30000000000",
        numberOfGuests: guests,
        totalPrice,
        currency: "USD",
      });

      setStatus(t.booking.confirmed);
    } catch (reserveError) {
      setError(getAuthErrorMessage(reserveError, t.auth.errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
      <h3 className="font-serif text-lg text-neutral-900">{t.booking.title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{t.booking.subtitle}</p>

      <AvailabilityCalendar
        listingId={property.id}
        checkIn={checkIn}
        checkOut={checkOut}
        onRangeChange={(nextCheckIn, nextCheckOut) => {
          setCheckIn(nextCheckIn);
          setCheckOut(nextCheckOut);
        }}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-neutral-500">
          {t.booking.checkIn}
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-neutral-500">
          {t.booking.checkOut}
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="mt-3 block text-xs text-neutral-500">
        {t.booking.guests}
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
        />
      </label>

      <p className="mt-3 text-sm text-neutral-600">
        {t.booking.from} {formatCurrency(property.rent)} {t.editorial.perNight}
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {status && <p className="mt-3 text-sm text-emerald-700">{status}</p>}

      <button
        type="button"
        disabled={loading || !checkIn || !checkOut}
        onClick={() => void handleReserve()}
        className="mt-4 w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "…" : t.booking.reserve}
      </button>

      <p className="mt-3 text-center text-xs text-neutral-400">
        <Link href="/signup" className="underline">
          {t.auth.signupSubmit}
        </Link>{" "}
        ·{" "}
        <Link href="/login" className="underline">
          {t.nav.login}
        </Link>
      </p>
    </div>
  );
}
