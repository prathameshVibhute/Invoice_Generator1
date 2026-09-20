import Link from "next/link";
import { IconPlus, IconSettings } from "@tabler/icons-react";
import { clients, invoices } from "../data";
export function ClientListScreen() {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Clients</h1>
          <div className="org-switch">Acme Studio</div>
        </div>
        <div className="actions">
          <Link className="icon-button" href="/organization">
            <IconSettings className="w-5 h-5" />
          </Link>
          <Link className="button" href="/clients/new">
            <IconPlus className="w-5 h-5" />
            Add client
          </Link>
        </div>
      </header>
      <div className="list">
        {clients.map((client) => {
          const pending = invoices.filter(
            (invoice) => invoice.clientId === client.id && invoice.status !== "paid",
          ).length;
          return (
            <Link href={`/clients/${client.id}`} className="card" key={client.id}>
              <div className="row">
                <div>
                  <div className="invoice-title">{client.name}</div>
                  <div className="muted">{client.gstNo ?? "No GST number"}</div>
                </div>
                <span className="chip active">{pending} pending</span>
              </div>
              <div className="muted" style={{ marginTop: 15 }}>
                {client.address}
                <br />
                {client.contactDetails} · {client.email}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
