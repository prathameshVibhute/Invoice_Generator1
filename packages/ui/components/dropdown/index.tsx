"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { Button } from "../button";

export interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  onChange,
  className = "",
  disabled = false,
}: DropdownProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSelect(option: DropdownOption) {
    if (value === undefined) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`.trim()}>
      <Button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-normal disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
      >
        <span
          className={`min-w-0 flex-1 break-words ${selectedOption ? "text-slate-900" : "text-slate-500"}`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <IconChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          aria-label="Dropdown options"
          className="absolute z-10 mt-2 max-h-60 w-full divide-y divide-slate-200 overflow-y-auto rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <Button
                type="button"
                role="option"
                aria-selected={isSelected}
                key={option.value}
                onClick={() => handleSelect(option)}
                className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-normal hover:bg-slate-50"
              >
                <span className="min-w-0 flex-1 break-words">{option.label}</span>
                {isSelected && <IconCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
