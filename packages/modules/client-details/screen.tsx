import Link from "next/link";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { clients, invoices } from "../data";
import { Calendar, InvoiceCard } from "../shared";
export function ClientDetailsScreen({ id }: { id: string }) {
  const client = clients.find((item) => item.id === id) ?? clients[0]!;
  const clientInvoices = invoices.filter((invoice) => invoice.clientId === client.id);
  return (
    <>
      <header className="page-head">
        <Link className="icon-button" href="/clients">
          <IconArrowLeft className="w-5 h-5" />
        </Link>
        <Link className="button" href={`/clients/${client.id}/edit`}>
          <IconEdit className="w-5 h-5" />
          Edit
        </Link>
      </header>
      <h1>{client.name}</h1>
      <section className="card" style={{ marginTop: 18 }}>
        <div className="detail-grid">
          <div>
            <span>GST number</span>
            <strong>{client.gstNo ?? "—"}</strong>
          </div>
          <div>
            <span>Pending invoices</span>
            <strong>{clientInvoices.filter((i) => i.status !== "paid").length}</strong>
          </div>
          <div>
            <span>Address</span>
            <strong>{client.address}</strong>
          </div>
          <div>
            <span>Contact</span>
            <strong>
              {client.contactDetails}
              <br />
              {client.email}
            </strong>
          </div>
        </div>
      </section>
      <div style={{ marginTop: 18 }}>
        <Calendar />
      </div>
      <div className="tabs" style={{ marginTop: 18 }}>
        <button className="tab active">All ({clientInvoices.length})</button>
        <button className="tab">Paid</button>
        <button className="tab">Unpaid</button>
      </div>
      <div className="list">
        {clientInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
}
