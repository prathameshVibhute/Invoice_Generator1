"use client";

import Link from "next/link";
import { IconArrowLeft, IconEdit, IconCopy } from "@tabler/icons-react";
import { invoices, getClient, money, organization } from "../data";
import { StatusChip } from "../shared";
import { InvoiceDownloadButton } from "./components/InvoiceDownloadButton";

export function InvoiceDetailsScreen({ id }: { id: string }) {
  const invoice = invoices.find((entry) => entry.id === id) ?? invoices[0]!;
  const client = getClient(invoice.clientId);
  const canEdit = invoice.status !== "paid";

  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
          href="/invoices"
        >
          <IconArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex gap-2.5">
          <InvoiceDownloadButton invoice={invoice} organization={organization} client={client} />
          <Link
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
            href={`/invoices/${invoice.id}/edit`}
          >
            <IconEdit className="w-5 h-5" />
          </Link>
        </div>
      </header>
      <h1 className="text-2xl font-bold">Invoice details</h1>
      <section className="mt-[18px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <div className="font-bold">{invoice.invoiceNumber}</div>
            <div className="text-sm text-slate-500">
              Created {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
            </div>
          </div>
          <StatusChip status={invoice.status} />
        </div>
        <div className="mt-[22px] grid grid-cols-2 gap-4">
          <div>
            <span className="mb-1 block text-sm text-slate-500">Client</span>
            <strong>{client.clientName}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">GST number</span>
            <strong>{client.gstNumber ?? "—"}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">Invoice amount</span>
            <strong>{money(invoice.total)}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">GST treatment</span>
            <strong>
              {invoice.gstSplitType === "cgst_sgst"
                ? "CGST + SGST"
                : invoice.gstSplitType.toUpperCase()}
            </strong>
          </div>
        </div>
        <table className="mt-[18px] w-full border-collapse text-sm [&_td]:border-b [&_td]:border-slate-200 [&_td]:px-1 [&_td]:py-3 [&_th]:border-b [&_th]:border-slate-200 [&_th]:px-1 [&_th]:py-3 [&_th]:text-left [&_td:last-child]:text-right [&_th:last-child]:text-right">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{money(item.rate)}</td>
                <td>{money(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3.5 grid gap-2">
          <div>
            <span className="text-slate-500">Subtotal</span>
            <span>{money(invoice.subtotal)}</span>
          </div>
          <div>
            <strong>Total</strong>
            <strong>{money(invoice.total)}</strong>
          </div>
        </div>
      </section>
      <div className="mt-4 flex gap-2.5">
        {canEdit && (
          <Link
            className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-white px-3.5 py-3 font-bold text-blue-600"
            href={`/invoices/${invoice.id}/edit`}
          >
            <IconEdit className="w-5 h-5" />
            Edit invoice
          </Link>
        )}
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-white px-3.5 py-3 font-bold text-blue-600"
          href="/invoices/new"
        >
          <IconCopy className="w-5 h-5" />
          Copy invoice
        </Link>
      </div>
    </>
  );
}
