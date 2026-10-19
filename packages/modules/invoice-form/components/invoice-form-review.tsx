import type { Client, InvoiceItem } from "@invoice-generator/types";
import { Avatar } from "@invoice-generator/ui/avatar";
import { money } from "../../data";
import { getGstBreakdown, isSameState } from "../utils/gstCalculator";
import { formatInvoiceDate } from "../utils/invoiceDates";

interface InvoiceFormReviewProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  client?: Client;
  items: InvoiceItem[];
  gst: boolean;
  clientState: string;
  organizationState: string;
}

export function InvoiceFormReview({
  invoiceNumber,
  issueDate,
  dueDate,
  client,
  items,
  gst,
  clientState,
  organizationState,
}: InvoiceFormReviewProps) {
  const subtotal = items.reduce((total, item) => total + item.quantity * item.rate, 0);
  const gstTotal = gst
    ? items.reduce(
        (total, item) => total + item.quantity * item.rate * ((item.gstPercentage ?? 0) / 100),
        0,
      )
    : 0;
  const isIntraState = isSameState(organizationState, clientState);
  const gstBreakdown = getGstBreakdown(items, gst, isIntraState);
  const clientInitials =
    client?.clientName
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <section aria-labelledby="invoice-review-heading">
      <h2 id="invoice-review-heading" className="sr-only">
        Invoice review
      </h2>
      <div>
        <header>
          <p className="m-0 text-sm font-medium uppercase tracking-wide text-slate-500">Invoice</p>
          <p className="mb-0 mt-2 text-lg font-semibold text-slate-900">{invoiceNumber}</p>
        </header>

        <section aria-label="Client info" className="mt-6">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
            Client info
          </p>
          <div className="flex items-center gap-3">
            <Avatar label={clientInitials} />
            <div className="min-w-0 flex flex-col justify-start">
              <p className="m-0 font-semibold text-slate-900">
                {client?.clientName ?? "No client selected"}
              </p>
            </div>
          </div>
          {client && (
            <dl className="mt-4 grid gap-3 text-sm">
              {client?.address && (
                <div className="flex flex-row">
                  <dt className="text-slate-500">Address:</dt> &nbsp;
                  <dd className="m-0 break-words text-slate-900">{client.address}</dd>
                </div>
              )}
              {client.contactDetails && (
                <div className="flex flex-row">
                  <dt className="text-slate-500">Contact number:</dt> &nbsp;
                  <dd className="m-0 break-words text-slate-900">{client.contactDetails}</dd>
                </div>
              )}
              {client.email && (
                <div className="flex flex-row">
                  <dt className="text-slate-500">Email:</dt> &nbsp;
                  <dd className="m-0 break-all text-slate-900">{client.email}</dd>
                </div>
              )}
            </dl>
          )}
        </section>

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="m-0 text-sm text-slate-500">Issue date</p>
            <p className="mb-0 mt-2 font-medium text-slate-900">{formatInvoiceDate(issueDate)}</p>
          </div>
          <div>
            <p className="m-0 text-sm text-slate-500">Due date</p>
            <p className="mb-0 mt-2 font-medium text-slate-900">{formatInvoiceDate(dueDate)}</p>
          </div>
        </div>

        <section aria-label="Invoice items" className="mt-8">
          <h3 className="mb-2 px-3 text-sm font-medium uppercase tracking-wide text-slate-500">
            Items
          </h3>
          <div className="divide-y divide-slate-200">
            {items.map((item) => {
              const itemSubtotal = item.quantity * item.rate;

              return (
                <div className="flex items-start justify-between gap-3 py-5 px-3" key={item.id}>
                  <div>
                    <p className="m-0 font-medium text-slate-900">{item.itemName}</p>
                    <p className="mb-0 mt-2 text-slate-500">
                      {item.quantity} × {money(item.rate)}
                    </p>
                  </div>
                  <strong className="whitespace-nowrap font-medium text-slate-900">
                    {money(itemSubtotal)}
                  </strong>
                </div>
              );
            })}
            {items.length === 0 && (
              <p className="m-0 py-5 px-3 text-sm text-slate-500">No items added.</p>
            )}
          </div>
        </section>

        <div className="ml-auto mt-6 grid max-w-sm gap-3 border-t border-slate-200 pt-4">
          <div className="flex justify-between gap-3 text-slate-600">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          {gstBreakdown.map(({ label, amount }) => (
            <div className="flex justify-between gap-3" key={label}>
              <span>{label}</span>
              <span>{money(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{money(subtotal + gstTotal)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
