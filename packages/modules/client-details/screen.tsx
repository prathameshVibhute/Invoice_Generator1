import Link from "next/link";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { clients, invoices } from "../data";
import { Calendar, InvoiceCard } from "../shared";
import { Button } from "@invoice-generator/ui/button";
export function ClientDetailsScreen({ id }: { id: string }) {
  const client = clients.find((item) => item.id === id) ?? clients[0]!;
  const clientInvoices = invoices.filter((invoice) => invoice.clientId === client.id);
  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
          href="/clients"
        >
          <IconArrowLeft className="w-5 h-5" />
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
          href={`/clients/${client.id}/edit`}
        >
          <IconEdit className="w-5 h-5" />
          Edit
        </Link>
      </header>
      <h1 className="text-2xl font-bold">{client.clientName}</h1>
      <section className="mt-[18px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="mb-1 block text-sm text-slate-500">GST number</span>
            <strong>{client.gstNumber ?? "—"}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">Pending invoices</span>
            <strong>{clientInvoices.filter((i) => i.status !== "paid").length}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">Address</span>
            <strong>{client.address}</strong>
          </div>
          <div>
            <span className="mb-1 block text-sm text-slate-500">Contact</span>
            <strong>
              {client.contactDetails}
              <br />
              {client.email}
            </strong>
          </div>
        </div>
      </section>
      <div className="mt-[18px]">
        <Calendar />
      </div>
      <div className="mt-[18px] mb-4 flex gap-5 border-b border-slate-200">
        <Button className="border-b-2 border-blue-600 bg-transparent px-0.5 py-3 font-bold text-blue-600">
          All ({clientInvoices.length})
        </Button>
        <Button className="border-b-2 border-transparent bg-transparent px-0.5 py-3 font-bold text-slate-500">
          Paid
        </Button>
        <Button className="border-b-2 border-transparent bg-transparent px-0.5 py-3 font-bold text-slate-500">
          Unpaid
        </Button>
      </div>
      <div className="grid gap-3">
        {clientInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
}
