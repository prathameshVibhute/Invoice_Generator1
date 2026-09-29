"use client";
import { useCallback, type ReactNode } from "react";
import type { TablerIcon } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface ButtonProps {
    routeUrl?: string;
    className?: string;
    children?: ReactNode;
    icon?: TablerIcon;
    iconClassName?: string;
    label?: string;
    labelClassName?: string;
    type?: "button" | "submit";
}

export function Button({
    routeUrl = "#",
    className = "button",
    icon: Icon,
    iconClassName,
    label,
    labelClassName,
    type = "button"
}: ButtonProps) {
    const router = useRouter();

    const onButtonClick = useCallback(() => {
        router.push(routeUrl);
    }, [routeUrl])
    return (
        <button type={type} onClick={onButtonClick} className={className}>
            {Icon && <Icon className={`h-5 w-5 ${iconClassName ? ` ${iconClassName}` : ""}`} aria-hidden="true" />}
            {label && <span className={labelClassName}>{label}</span>}
        </button>
    );
}