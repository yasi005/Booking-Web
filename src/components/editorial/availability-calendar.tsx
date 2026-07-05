"use client";

import { useTranslation } from "@/context/locale-context";
import { fetchListingCalendar, type CalendarDay } from "@/lib/backend-api";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type AvailabilityCalendarProps = {
  listingId: string;
  checkIn: string;
  checkOut: string;
  onRangeChange: (checkIn: string, checkOut: string) => void;
};

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthRange(year: number, month: number): { startDate: string; endDate: string } {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    startDate: toIsoDate(year, month, 1),
    endDate: toIsoDate(year, month, lastDay),
  };
}

function buildMonthCells(year: number, month: number) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: string | null; day: number | null }> = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ date: null, day: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: toIsoDate(year, month, day), day });
  }

  return cells;
}

function isPastDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${date}T00:00:00`) < today;
}

function isBetween(date: string, start: string, end: string): boolean {
  if (!start || !end) return false;
  return date >= start && date <= end;
}

export function AvailabilityCalendar({
  listingId,
  checkIn,
  checkOut,
  onRangeChange,
}: AvailabilityCalendarProps) {
  const { t, locale } = useTranslation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [daysByDate, setDaysByDate] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const loadMonth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = monthRange(viewYear, viewMonth);
      const payload = await fetchListingCalendar(listingId, startDate, endDate);
      const nextMap: Record<string, CalendarDay> = {};
      for (const day of payload.days) {
        nextMap[day.date] = day;
      }
      setDaysByDate(nextMap);
    } catch {
      setError(t.booking.calendarError);
    } finally {
      setLoading(false);
    }
  }, [listingId, viewYear, viewMonth, t.booking.calendarError]);

  useEffect(() => {
    void loadMonth();
  }, [loadMonth]);

  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    { month: "long", year: "numeric" },
  );

  const weekdayLabels =
    locale === "el"
      ? ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleDayClick = (date: string) => {
    const day = daysByDate[date];
    if (!day?.available || isPastDate(date)) return;

    if (!checkIn || selectingCheckOut === false) {
      onRangeChange(date, "");
      setSelectingCheckOut(true);
      return;
    }

    if (date <= checkIn) {
      onRangeChange(date, "");
      setSelectingCheckOut(true);
      return;
    }

    onRangeChange(checkIn, date);
    setSelectingCheckOut(false);
  };

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
          aria-label={t.booking.calendarPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium text-neutral-900">{monthLabel}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
          aria-label={t.booking.calendarNext}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium tracking-wide text-neutral-400 uppercase">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 text-center text-sm text-neutral-500">{t.booking.calendarLoading}</p>
      ) : error ? (
        <p className="mt-6 text-center text-sm text-red-600">{error}</p>
      ) : (
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.date || cell.day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const day = daysByDate[cell.date];
            const available = Boolean(day?.available) && !isPastDate(cell.date);
            const booked = day !== undefined && !available && !isPastDate(cell.date);
            const inRange =
              (checkIn && cell.date === checkIn) ||
              (checkOut && cell.date === checkOut) ||
              isBetween(cell.date, checkIn, checkOut);

            return (
              <button
                key={cell.date}
                type="button"
                disabled={!available}
                onClick={() => handleDayClick(cell.date!)}
                className={cn(
                  "aspect-square rounded-lg border text-xs font-medium transition",
                  isPastDate(cell.date) && "border-transparent bg-neutral-50 text-neutral-300",
                  available &&
                    !inRange &&
                    "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
                  booked && "border-red-200 bg-red-100 text-red-800",
                  inRange && available && "border-emerald-500 bg-emerald-500 text-white",
                  !day && !isPastDate(cell.date) && "border-neutral-100 bg-neutral-50 text-neutral-400",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-emerald-200 bg-emerald-100" />
          {t.booking.calendarAvailable}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-red-200 bg-red-100" />
          {t.booking.calendarBooked}
        </span>
      </div>
    </div>
  );
}
