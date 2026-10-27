import type { InvoiceStatus } from "@invoice-generator/types";

export function StatusChip({ status }: { status: InvoiceStatus }) {
  const statusClasses: Record<InvoiceStatus, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    active: "bg-red-100 text-red-700",
    draft: "bg-slate-100 text-slate-600",
    partially_paid: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}
    >
      {status === "partially_paid" ? "Partially paid" : status[0]!.toUpperCase() + status.slice(1)}
    </span>
  );
}

export function Calendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2.5">
        <span className="mb-3 font-bold">January 2025</span>
        <span className="text-sm text-slate-500">This month</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {days.map((day, index) => (
          <b className="text-slate-500" key={index}>
            {day}
          </b>
        ))}
        {Array.from({ length: 31 }, (_, index) => (
          <span
            className={`rounded-lg py-2 ${[5, 12, 18, 24].includes(index + 1) ? "bg-blue-100 font-bold text-blue-600" : "text-slate-500"}`}
            key={index}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </section>
  );
}
