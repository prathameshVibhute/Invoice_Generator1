import type { Client, InvoiceWithClientDetails } from "@invoice-generator/types";

interface ClientDetailsContainerProps {
  client: Client;
  invoices: InvoiceWithClientDetails[];
}

export function ClientDetailsContainer({ client, invoices }: ClientDetailsContainerProps) {
  const pendingInvoiceCount = invoices.filter((invoice) => invoice.status !== "paid").length;

  return (
    <section className="mt-[18px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="mb-1 block text-sm text-slate-500">GST number</span>
          <span className="text-xs">{client.gstNumber || "Not provided"}</span>
        </div>
        <div>
          <span className="mb-1 block text-sm text-slate-500">Pending invoices</span>
          <span className="text-xs">{pendingInvoiceCount}</span>
        </div>
        <div>
          <span className="mb-1 block text-sm text-slate-500">Address</span>
          <span className="text-xs">{client.address}</span>
        </div>
        <div className="min-w-0">
          <span className="mb-1 block text-sm text-slate-500">Contact</span>
          <span className="text-xs">
            {client.contactDetails}
            <br />
            <span className="break-all">{client.email}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
