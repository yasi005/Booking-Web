"use client";

import { useTranslation } from "@/context/locale-context";
import { buildPageList } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PropertyPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PropertyPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PropertyPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      aria-label={t.marketplace.pagination.label}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label={t.marketplace.pagination.previous}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-4 text-sm transition",
          currentPage <= 1
            ? "cursor-not-allowed border-neutral-100 text-neutral-300"
            : "border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 active:scale-[0.98]",
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">{t.marketplace.pagination.previous}</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-neutral-400"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={t.marketplace.pagination.page(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-full text-sm font-medium transition active:scale-[0.98]",
                page === currentPage
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label={t.marketplace.pagination.next}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-4 text-sm transition",
          currentPage >= totalPages
            ? "cursor-not-allowed border-neutral-100 text-neutral-300"
            : "border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 active:scale-[0.98]",
        )}
      >
        <span className="hidden sm:inline">{t.marketplace.pagination.next}</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
