import type { ReactNode } from "react";

export type ChipColor = "purple" | "green" | "orange" | "red" | "blue";

interface ChipProps {
    label: string;
    color?: ChipColor;
    className?: string;
}

const colors: Record<ChipColor, { background: string; foreground: string }> = {
    purple: { background: "#eeecff", foreground: "#5145cd" },
    green: { background: "#e4f6f3", foreground: "#168b78" },
    orange: { background: "#fff0e3", foreground: "#c66b1d" },
    red: { background: "#ffe8ed", foreground: "#c13d5a" },
    blue: { background: "#e8f0ff", foreground: "#3563c8" },
};

export function Chip({ label, color = "purple", className = "" }: ChipProps) {
    const colorPair = colors[color];

    return (
        <span
            className={`px-4 py-2 rounded-2xl text-xs font-semibold uppercase h-8 flex items-center ${className}`.trim()}
            style={{ backgroundColor: colorPair.background, color: colorPair.foreground }}
        >
            {label}
        </span>
    );
}