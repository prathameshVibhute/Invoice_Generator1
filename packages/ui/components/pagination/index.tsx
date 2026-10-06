"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useState } from "react";

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
    `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors active:bg-canvas active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-canvas"}`;

  const go = (nextPage: number) => {
    const safePage = Math.min(totalPages, Math.max(1, nextPage));
    setPage(safePage);
    onPageChange?.(safePage);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`card flex w-full items-center justify-between gap-1 bg-canvas p-2 sm:justify-center sm:gap-2 ${className}`.trim()}
      >
      <button
        type="button"
        aria-label="First page"
        disabled={firstDisabled}
        onClick={() => go(1)}
        className={buttonClass(firstDisabled)}
      >
        <IconChevronsLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Previous page"
        disabled={firstDisabled}
        onClick={() => go(currentPage - 1)}
        className={buttonClass(firstDisabled)}
      >
        <IconChevronLeft aria-hidden="true" />
      </button>
      <div
        className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1 text-sm font-medium text-muted sm:flex-none sm:min-w-32"
        aria-live="polite"
        aria-atomic="true"
      >
        <>
          <span className="hidden whitespace-nowrap sm:inline">Page {currentPage} of {totalPages}</span>
          <span className="whitespace-nowrap sm:hidden">{currentPage} / {totalPages}</span>
        </>
      </div>
      <button
        type="button"
        aria-label="Next page"
        disabled={lastDisabled}
        onClick={() => go(currentPage + 1)}
        className={buttonClass(lastDisabled)}
      >
        <IconChevronRight aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Last page"
        disabled={lastDisabled}
        onClick={() => go(totalPages)}
        className={buttonClass(lastDisabled)}
      >
        <IconChevronsRight aria-hidden="true" />
      </button>
    </nav>
  );
}
