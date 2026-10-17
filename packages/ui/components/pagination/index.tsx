"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../button";

export interface PaginationProps {
  /** Total number of records to paginate. */
  totalNumber: number;
  /** Number of records represented by each page. */
  pageSize?: number;
  onPageChange?: (page: number) => void;
  /** Hide the control when there is no page navigation to perform. */
  hideWhenSinglePage?: boolean;
  className?: string;
}

export function Pagination({
  totalNumber = 45,
  pageSize = 10,
  onPageChange,
  hideWhenSinglePage = true,
  className = "",
}: PaginationProps) {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safeTotalNumber = Math.max(0, Math.floor(totalNumber));
  const totalPages = Math.max(1, Math.ceil(safeTotalNumber / safePageSize));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(page, totalPages);

  if (hideWhenSinglePage && totalPages <= 1) return null;

  const firstDisabled = currentPage <= 1;
  const lastDisabled = currentPage >= totalPages;

  const buttonClass = (disabled: boolean) =>
    `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors active:scale-95 active:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-slate-100"}`;

  const go = (nextPage: number) => {
    const safePage = Math.min(totalPages, Math.max(1, nextPage));
    setPage(safePage);
    onPageChange?.(safePage);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`flex w-full items-center justify-between gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:justify-center sm:gap-2 ${className}`.trim()}
    >
      <Button
        type="button"
        aria-label="First page"
        disabled={firstDisabled}
        onClick={() => go(1)}
        className={buttonClass(firstDisabled)}
      >
        <IconChevronsLeft aria-hidden="true" />
      </Button>
      <Button
        type="button"
        aria-label="Previous page"
        disabled={firstDisabled}
        onClick={() => go(currentPage - 1)}
        className={buttonClass(firstDisabled)}
      >
        <IconChevronLeft aria-hidden="true" />
      </Button>
      <div
        className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1 text-sm font-medium text-slate-500 sm:min-w-32 sm:flex-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <>
          <span className="hidden whitespace-nowrap sm:inline">
            Page {currentPage} of {totalPages}
          </span>
          <span className="whitespace-nowrap sm:hidden">
            {currentPage} / {totalPages}
          </span>
        </>
      </div>
      <Button
        type="button"
        aria-label="Next page"
        disabled={lastDisabled}
        onClick={() => go(currentPage + 1)}
        className={buttonClass(lastDisabled)}
      >
        <IconChevronRight aria-hidden="true" />
      </Button>
      <Button
        type="button"
        aria-label="Last page"
        disabled={lastDisabled}
        onClick={() => go(totalPages)}
        className={buttonClass(lastDisabled)}
      >
        <IconChevronsRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
