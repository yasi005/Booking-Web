"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

function formatDisplayDate(iso: string) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${month}/${day}/${year}`;
}

function defaultRange() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);

  const toIso = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return { checkIn: toIso(checkIn), checkOut: toIso(checkOut) };
}

function FieldShell({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="relative block rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 transition hover:border-white/25 hover:bg-white/15">
      <span className="block text-[10px] tracking-[0.18em] text-white/55 uppercase">
        {label}
      </span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-[14px] text-white">{value}</span>
        <span className="shrink-0 text-white/45">{icon}</span>
      </span>
      {children}
    </label>
  );
}

export function HeroAvailabilityCard() {
  const { t } = useTranslation();
  const { enterMarketplace, setHomeSearchQuery } = useAppPhase();
  const initial = useMemo(() => defaultRange(), []);

  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const summary = [
      checkIn && `check-in ${formatDisplayDate(checkIn)}`,
      checkOut && `check-out ${formatDisplayDate(checkOut)}`,
      `${guests} guests`,
      `${rooms} room${rooms === 1 ? "" : "s"}`,
    ]
      .filter(Boolean)
      .join(" · ");
    setHomeSearchQuery(summary);
    enterMarketplace(summary);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[380px] rounded-[28px] border border-white/10 bg-white/10 px-6 py-7 text-left shadow-[0_28px_80px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-7 sm:py-8"
    >
      <p className="text-[10px] font-medium tracking-[0.28em] text-white/70 uppercase">
        {t.hero.availability.title}
      </p>
      <p className="mt-2 font-serif text-[22px] leading-snug tracking-tight text-white">
        {t.hero.availability.subtitle}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <FieldShell
          label={t.hero.availability.checkIn}
          value={formatDisplayDate(checkIn)}
          icon={<CalendarDays className="h-3.5 w-3.5" aria-hidden />}
        >
          <input
            type="date"
            value={checkIn}
            min={initial.checkIn}
            onChange={(e) => {
              const next = e.target.value;
              setCheckIn(next);
              if (checkOut && next >= checkOut) {
                const nextOut = new Date(next);
                nextOut.setDate(nextOut.getDate() + 2);
                const y = nextOut.getFullYear();
                const m = String(nextOut.getMonth() + 1).padStart(2, "0");
                const d = String(nextOut.getDate()).padStart(2, "0");
                setCheckOut(`${y}-${m}-${d}`);
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={t.hero.availability.checkIn}
          />
        </FieldShell>

        <FieldShell
          label={t.hero.availability.checkOut}
          value={formatDisplayDate(checkOut)}
          icon={<CalendarDays className="h-3.5 w-3.5" aria-hidden />}
        >
          <input
            type="date"
            value={checkOut}
            min={checkIn || initial.checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={t.hero.availability.checkOut}
          />
        </FieldShell>

        <FieldShell
          label={t.hero.availability.guests}
          value={t.hero.availability.adults(guests)}
          icon={<ChevronDown className="h-3.5 w-3.5" aria-hidden />}
        >
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={t.hero.availability.guests}
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {t.hero.availability.adults(n)}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          label={t.hero.availability.rooms}
          value={t.hero.availability.roomCount(rooms)}
          icon={<ChevronDown className="h-3.5 w-3.5" aria-hidden />}
        >
          <select
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={t.hero.availability.rooms}
          >
            {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {t.hero.availability.roomCount(n)}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-gradient-to-r from-[#e0c05a] via-[#d4af37] to-[#b8941f] px-5 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-white uppercase shadow-[0_8px_24px_-8px_rgba(212,175,55,0.65)] transition hover:brightness-105"
      >
        {t.hero.availability.cta}
      </button>
    </form>
  );
}
