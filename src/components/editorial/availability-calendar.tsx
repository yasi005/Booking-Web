"use client";

import { useTranslation } from "@/context/locale-context";
import { fetchListingCalendar, type CalendarDay } from "@/lib/backend-api";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type AvailabilityCalendarProps = {
  listingId: string;
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

function isToday(date: string): boolean {
  const now = new Date();
  return date === toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

export function AvailabilityCalendar({ listingId }: AvailabilityCalendarProps) {
  const { t, locale } = useTranslation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [daysByDate, setDaysByDate] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="mt-1 grid grid-cols-7 gap-1.5" aria-readonly="true">
            {cells.map((cell, index) => {
              if (!cell.date || cell.day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const past = isPastDate(cell.date);
              const todayCell = isToday(cell.date);
              const day = daysByDate[cell.date];
              const available = Boolean(day?.available) && !past;
              const unavailable = !past && day !== undefined && !day.available;

              return (
                <div
                  key={cell.date}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition",
                    past && "text-neutral-300",
                    available && "bg-[#ebf6ef] text-[#1f5c3a]",
                    unavailable && "bg-[#f6ecec] text-[#8a4a4a] line-through decoration-neutral-400/50",
                    !past && !day && "bg-neutral-50 text-neutral-400",
                    todayCell && "ring-1 ring-neutral-900/80 ring-offset-1 ring-offset-white",
                  )}
                >
                  <span className={cn("leading-none", available && "font-semibold")}>
                    {cell.day}
                  </span>
                  {available && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-[#2f8a55]" aria-hidden />
                  )}
                  {unavailable && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-[#c06a6a]" aria-hidden />
                  )}
                </div>
              );
            })}
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
