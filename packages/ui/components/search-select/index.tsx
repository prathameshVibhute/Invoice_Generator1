"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconCheck, IconSearch } from "@tabler/icons-react";

export type SearchSelectOption<TData = unknown> = {
  value: string;
  label: string;
  data?: TData;
};

export type SearchSelectProps<TData = unknown> = {
  value: SearchSelectOption<TData> | null;
  onChange: (option: SearchSelectOption<TData> | null) => void;
  onSearch: (query: string) => Promise<SearchSelectOption<TData>[]>;
  placeholder?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  debounceMs?: number;
  disabled?: boolean;
};

export function SearchSelect<TData = unknown>({
  value,
  onChange,
  onSearch,
  placeholder = "Search",
  emptyMessage = "Search something to get records",
  noResultsMessage = "No record found",
  debounceMs = 300,
  disabled = false,
}: SearchSelectProps<TData>) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSelectOption<TData>[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value?.label, value?.value]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
        setInputValue(value?.label ?? "");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, value?.label]);

  useEffect(() => {
    if (!query) return;

    let activeRequestId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      const requestId = ++requestIdRef.current;
      activeRequestId = requestId;
      setLoading(true);
      setSearchFailed(false);

      Promise.resolve()
        .then(() => onSearch(query))
        .then((nextResults) => {
          if (requestId !== requestIdRef.current) return;
          setResults(nextResults);
          setHasSearched(true);
          setHighlightedIndex(-1);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setResults([]);
          setHasSearched(false);
          setSearchFailed(true);
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoading(false);
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (activeRequestId === requestIdRef.current) {
        requestIdRef.current += 1;
      }
    };
  }, [debounceMs, onSearch, query]);

  function closeAndRestoreSelection() {
    setIsOpen(false);
    setInputValue(value?.label ?? "");
  }

  function handleInputChange(nextValue: string) {
    setInputValue(nextValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    setResults([]);
    setHasSearched(false);
    setSearchFailed(false);
    requestIdRef.current += 1;

    if (!nextValue) {
      setQuery("");
      setLoading(false);
      onChange(null);
      return;
    }

    setLoading(true);
    setQuery(nextValue);
  }

  const selectOption = useCallback(
    (option: SearchSelectOption<TData>) => {
      setInputValue(option.label);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange(option);
    },
    [onChange],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndRestoreSelection();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!isOpen) {
        setIsOpen(true);
        if (results.length > 0) {
          setHighlightedIndex(event.key === "ArrowDown" ? 0 : results.length - 1);
        }
        return;
      }
      if (results.length === 0) return;

      event.preventDefault();
      setHighlightedIndex((currentIndex) => {
        if (event.key === "ArrowDown") {
          return currentIndex >= results.length - 1 ? 0 : currentIndex + 1;
        }
        return currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
      });
      return;
    }

    if (event.key === "Enter" && isOpen && highlightedIndex >= 0) {
      event.preventDefault();
      const option = results[highlightedIndex];
      if (option) selectOption(option);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative">
        <IconSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label={placeholder}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          autoComplete="off"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget)) {
              setIsOpen(false);
              setInputValue(value?.label ?? "");
            }
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10! pr-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {loading ? (
            <div role="status" className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
              />
              Searching...
            </div>
          ) : searchFailed ? (
            <div role="status" className="px-3 py-3 text-sm text-slate-500">
              Search failed. Please try again.
            </div>
          ) : !hasSearched ? (
            <div className="px-3 py-3 text-sm text-slate-500">{emptyMessage}</div>
          ) : results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">{noResultsMessage}</div>
          ) : (
            results.map((option, index) => {
              const isSelected = option.value === value?.value;
              const isHighlighted = index === highlightedIndex;

              return (
                <div
                  id={`${listboxId}-option-${index}`}
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onPointerDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-slate-900 ${
                    isHighlighted ? "bg-slate-100" : "hover:bg-slate-100"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <IconCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
