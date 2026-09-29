"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

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
}

export function Dropdown({
	options,
	value,
	defaultValue,
	placeholder = "Select an option",
	onChange,
	className = "",
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
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((open) => !open)}
				className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3 py-3 text-left"
			>
				<span className={selectedOption ? "text-text-primary" : "text-muted"}>
					{selectedOption?.label ?? placeholder}
				</span>
				<IconChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>

			{isOpen && (
				<div
					role="listbox"
					aria-label="Dropdown options"
					className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-surface py-1 px-2 shadow-lg divide-y divide-border"
				>
					{options.map((option) => {
						const isSelected = option.value === selectedValue;

						return (
							<button
								type="button"
								role="option"
								aria-selected={isSelected}
								key={option.value}
								onClick={() => handleSelect(option)}
								className="flex w-full items-center justify-between px-3 py-3 text-left hover:bg-canvas"
							>
								<span>{option.label}</span>
								{isSelected && <IconCheck className="h-5 w-5 text-primary" aria-hidden="true" />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}