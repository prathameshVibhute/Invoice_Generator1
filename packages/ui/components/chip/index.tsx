export type ChipColor = "purple" | "green" | "orange" | "red" | "blue";

interface ChipProps {
  label: string;
  color?: ChipColor;
  className?: string;
}

const colors: Record<ChipColor, string> = {
  purple: "bg-violet-100 text-violet-700",
  green: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-rose-100 text-rose-700",
  blue: "bg-blue-100 text-blue-700",
};

export function Chip({ label, color = "purple", className = "" }: ChipProps) {
  return (
    <span
      className={`flex min-h-8 items-center rounded-2xl px-3 py-2 text-xs font-semibold uppercase ${colors[color]} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
