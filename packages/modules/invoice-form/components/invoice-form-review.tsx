import type { Client, InvoiceItem } from "@invoice-generator/types";
import { money, organization } from "../../data";

interface InvoiceFormReviewProps {
  invoiceNumber: string;
  client?: Client;
  items: InvoiceItem[];
  gst: boolean;
  clientState: string;
}

export function InvoiceFormReview({
  invoiceNumber,
  client,
  items,
  gst,
  clientState,
}: InvoiceFormReviewProps) {
  const subtotal = items.reduce((total, item) => total + item.quantity * item.rate, 0);
  const gstTotal = gst
    ? items.reduce(
        (total, item) => total + item.quantity * item.rate * ((item.gstPercentage ?? 0) / 100),
        0,
      )
    : 0;

  return (
    <section aria-labelledby="invoice-preview-heading">
      <h2 id="invoice-preview-heading" className="mb-3 text-lg font-semibold">
        Invoice preview
      </h2>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="m-0 text-sm text-slate-500">Invoice number</p>
            <strong>{invoiceNumber}</strong>
          </div>
          <div className="text-right">
            <p className="m-0 text-sm text-slate-500">Client</p>
            <strong>{client?.clientName ?? "No client selected"}</strong>
          </div>
        </div>

        {client && (
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 py-4 text-sm">
            <div>
              <span className="mb-1 block text-slate-500">Address</span>
              <strong>{client.address}</strong>
            </div>
            <div>
              <span className="mb-1 block text-slate-500">GSTIN</span>
              <strong>{client.gstNumber || "Not provided"}</strong>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-200">
          {items.map((item) => {
            const itemSubtotal = item.quantity * item.rate;
            const itemTax = gst ? itemSubtotal * ((item.gstPercentage ?? 0) / 100) : 0;
            const gstLabel =
              (item.gstPercentage ?? 0) === 0
                ? "No GST (0%)"
                : clientState === organization.state
                  ? `CGST ${(item.gstPercentage ?? 0) / 2}% + SGST ${(item.gstPercentage ?? 0) / 2}%`
                  : `IGST ${item.gstPercentage}%`;

            return (
              <div className="flex items-start justify-between gap-3 py-4" key={item.id}>
                <div>
                  <strong>{item.itemName}</strong>
                  <p className="mb-1 mt-1 text-sm text-slate-500">
                    {item.quantity} × {money(item.rate)}
                  </p>
                  {gst && <p className="m-0 text-sm text-slate-500">{gstLabel}</p>}
                </div>
                <strong className="whitespace-nowrap">{money(itemSubtotal + itemTax)}</strong>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 border-t border-slate-200 pt-4">
          <div className="flex justify-between gap-3">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          {gst && (
            <div className="flex justify-between gap-3">
              <span>GST</span>
              <span>{money(gstTotal)}</span>
            </div>
          )}
          <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-lg font-semibold">
            <strong>Total</strong>
            <strong>{money(subtotal + gstTotal)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
