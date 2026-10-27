import type { InvoiceWithClientDetails } from "@invoice-generator/types";
import Link from "next/link";
import { formatMoney } from "../../utils/formatMoney";
import { StatusChip } from "../../shared";

export function InvoiceCard({ invoice }: { invoice: InvoiceWithClientDetails }) {
  return (
    <Link
      className="block min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      href={`/invoices/${invoice.id}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold">{invoice.invoiceNumber}</div>
          <div className="text-sm text-slate-500">
            {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <StatusChip status={invoice.status} />
      </div>
      <div className="mt-3.5 flex min-w-0 items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <strong className="block truncate">{invoice.clientDetails.clientName}</strong>
          <div className="truncate text-sm text-slate-500">
            GST number: {invoice.clientDetails.gstNumber || "Not provided"}
          </div>
        </div>
        <strong className="block max-w-[45%] shrink-0 break-words text-right">
          {formatMoney(invoice.total)}
        </strong>
      </div>
    </Link>
  );
}
