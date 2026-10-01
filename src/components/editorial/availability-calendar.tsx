"use client";

import { useTranslation } from "@/context/locale-context";
import { fetchListingCalendar, type CalendarDay } from "@/lib/backend-api";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type DateRange = {
  checkIn: string;
  checkOut: string;
};

type AvailabilityCalendarProps = {
  listingId: string;
  /** When provided, days become clickable and pick a check-in / check-out range. */
  selection?: DateRange;
  onSelect?: (range: DateRange) => void;
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

/** Every night from checkIn up to (not including) checkOut. */
function nightsBetween(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return nights;
}

function isToday(date: string): boolean {
  const now = new Date();
  return date === toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

export function AvailabilityCalendar({ listingId, selection, onSelect }: AvailabilityCalendarProps) {
  const { t, locale } = useTranslation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [cache, setCache] = useState<{ listingId: string; days: Record<string, CalendarDay> }>({
    listingId,
    days: {},
  });
  const daysByDate = cache.listingId === listingId ? cache.days : {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeBlocked, setRangeBlocked] = useState(false);
  const selectable = Boolean(onSelect);
  const checkIn = selection?.checkIn ?? "";
  const checkOut = selection?.checkOut ?? "";

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
      // Keep earlier months so ranges spanning months can be validated.
      setCache((prev) => ({
        listingId,
        days: prev.listingId === listingId ? { ...prev.days, ...nextMap } : nextMap,
      }));
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

  const handleDayClick = (date: string) => {
    if (!onSelect || isPastDate(date)) return;
    const day = daysByDate[date];
    const nightFree = !day || day.available;

    if (checkIn && !checkOut && date > checkIn) {
      const blocked = nightsBetween(checkIn, date).some(
        (night) => daysByDate[night] && !daysByDate[night].available,
      );
      if (blocked) {
        setRangeBlocked(true);
        return;
      }
      setRangeBlocked(false);
      onSelect({ checkIn, checkOut: date });
      return;
    }

    if (!nightFree) return;
    setRangeBlocked(false);
    onSelect({ checkIn: date, checkOut: "" });
  };

  const clearSelection = () => {
    setRangeBlocked(false);
    onSelect?.({ checkIn: "", checkOut: "" });
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50/80 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3.5">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          aria-label={t.booking.calendarPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-base tracking-tight text-neutral-900 capitalize">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          aria-label={t.booking.calendarNext}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-4 pt-3 sm:px-4">
        <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-medium tracking-[0.14em] text-neutral-400 uppercase">
          {weekdayLabels.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="aspect-square animate-pulse rounded-xl bg-neutral-100/80"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-600">{error}</p>
        ) : (
          <div className="mt-1 grid grid-cols-7 gap-1.5" aria-readonly={!selectable}>
            {cells.map((cell, index) => {
              if (!cell.date || cell.day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const past = isPastDate(cell.date);
              const todayCell = isToday(cell.date);
              const day = daysByDate[cell.date];
              const available = Boolean(day?.available) && !past;
              const unavailable = !past && day !== undefined && !day.available;
              const isEndpoint = cell.date === checkIn || cell.date === checkOut;
              const inRange =
                Boolean(checkIn && checkOut) && cell.date > checkIn && cell.date < checkOut;
              // An unavailable day can still be a check-out (you leave that morning).
              const canPickAsCheckOut =
                Boolean(checkIn && !checkOut) && cell.date > checkIn && !past;
              const clickable = selectable && !past && (!unavailable || canPickAsCheckOut);

              return (
                <button
                  type="button"
                  key={cell.date}
                  disabled={!clickable}
                  onClick={() => handleDayClick(cell.date!)}
                  aria-pressed={selectable ? isEndpoint : undefined}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition disabled:cursor-default",
                    clickable && "cursor-pointer hover:ring-1 hover:ring-neutral-400",
                    past && "text-neutral-300",
                    available && "bg-[#ebf6ef] text-[#1f5c3a]",
                    unavailable && "bg-[#f6ecec] text-[#8a4a4a] line-through decoration-neutral-400/50",
                    !past && !day && "bg-neutral-50 text-neutral-400",
                    inRange && "bg-[#cfe9d8] text-[#1f5c3a]",
                    isEndpoint && "bg-neutral-950 text-white no-underline",
                    todayCell && "ring-1 ring-neutral-900/80 ring-offset-1 ring-offset-white",
                  )}
                >
                  <span className={cn("leading-none", (available || isEndpoint) && "font-semibold")}>
                    {cell.day}
                  </span>
                  {available && !isEndpoint && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-[#2f8a55]" aria-hidden />
                  )}
                  {unavailable && !isEndpoint && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-[#c06a6a]" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectable && !loading && !error && (
          <div className="mt-3 flex items-center justify-between gap-3 text-xs">
            <p className={cn(rangeBlocked ? "text-red-600" : "text-neutral-500")}>
              {rangeBlocked
                ? t.booking.calendarRangeBlocked
                : checkIn && !checkOut
                  ? t.booking.calendarPickCheckOut
                  : !checkIn
                    ? t.booking.calendarPickCheckIn
                    : null}
            </p>
            {checkIn && (
              <button
                type="button"
                onClick={clearSelection}
                className="shrink-0 text-neutral-500 underline hover:text-neutral-900"
              >
                {t.booking.calendarClear}
              </button>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 border-t border-neutral-100 pt-3.5 text-[11px] text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ebf6ef]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2f8a55]" />
            </span>
            {t.booking.calendarAvailable}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#f6ecec]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c06a6a]" />
            </span>
            {t.booking.calendarUnavailable}
          </span>
        </div>
      </div>
    </div>
  );
}
