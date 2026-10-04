import Link from "next/link";
import type { Invoice, InvoiceStatus } from "@invoice-generator/types";
import { getClient, money } from "./data";
export function StatusChip({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`chip ${status}`}>
      {status === "partially_paid" ? "Partially paid" : status[0]!.toUpperCase() + status.slice(1)}
    </span>
  );
}
export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const client = getClient(invoice.clientId);
  return (
    <Link className="card invoice-card" href={`/invoices/${invoice.id}`}>
      <div className="row">
        <div>
          <div className="invoice-title">{invoice.invoiceNumber}</div>
          <div className="muted">
            {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <StatusChip status={invoice.status} />
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <div>
          <strong>{client.clientName}</strong>
          <div className="muted">
            {invoice.isGstInvoice ? (client.gstNumber ?? "GST invoice") : "Non-GST invoice"}
          </div>
        </div>
        <strong>{money(invoice.total)}</strong>
      </div>
    </Link>
  );
}
export function Calendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <section className="card calendar">
      <div className="row">
        <span className="calendar-title">January 2025</span>
        <span className="muted">This month</span>
      </div>
      <div className="days">
        {days.map((day, index) => (
          <b className="muted" key={index}>
            {day}
          </b>
        ))}
        {Array.from({ length: 31 }, (_, index) => (
          <span className={[5, 12, 18, 24].includes(index + 1) ? "day marked" : "day"} key={index}>
            {index + 1}
          </span>
        ))}
      </div>
    </section>
  );
}
