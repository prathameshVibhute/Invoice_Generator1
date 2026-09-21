import Link from "next/link";
import type { ReactNode } from "react";
import type { TablerIcon } from "@tabler/icons-react";

interface ButtonProps {
    routeUrl?: string;
    className?: string;
    children?: ReactNode;
    icon?: TablerIcon;
    iconClassName?: string;
    label?: string;
    labelClassName?: string;
}

export function Button({
    routeUrl = "#",
    className = "button",
    icon: Icon,
    iconClassName,
    label,
    labelClassName,
}: ButtonProps) {
    return (
        <Link href={routeUrl} className={className}>
            {Icon && <Icon className={`h-5 w-5 ${iconClassName ? ` ${iconClassName}` : ""}`} aria-hidden="true" />}
            {label && <span className={labelClassName}>{label}</span>}
        </Link>
    );
}