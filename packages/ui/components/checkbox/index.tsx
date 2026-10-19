"use client";

import type { InputHTMLAttributes } from "react";
import { IconCheck } from "@tabler/icons-react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "onChange"
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange, className = "", ...inputProps }: CheckboxProps) {
  return (
    <span
      className={`relative inline-flex h-4 w-4 shrink-0 items-center justify-center ${className}`.trim()}
    >
      <input
        {...inputProps}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="absolute inset-0 m-0 h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 bg-white checked:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      />
      {checked && (
        <IconCheck
          aria-hidden="true"
          className="pointer-events-none relative h-4 w-4 text-blue-600"
        />
      )}
    </span>
  );
}
