import type { Client, InvoiceWithClientDetails } from "@invoice-generator/types";
import { Avatar } from "@invoice-generator/ui/avatar";
import { ClientDetailsContainer } from "./components/client-details-container";
import { ClientDetailsHeader } from "./components/client-details-header";
import { ClientDetailsTabPanel } from "./components/client-details-tabpanel";

export function ClientDetailsScreen({
  client,
  invoices,
}: {
  client: Client;
  invoices: InvoiceWithClientDetails[];
}) {
  const clientInitials = client.clientName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("");

  return (
    <>
      <ClientDetailsHeader client={client} />
      <div className="flex items-center gap-3">
        <Avatar label={clientInitials} />
        <h1 className="text-xl font-semibold">{client.clientName}</h1>
      </div>
      <ClientDetailsContainer client={client} invoices={invoices} />
      {/* <div className="mt-[18px]">
        <Calendar />
      </div> */}
      <ClientDetailsTabPanel invoices={invoices} />
    </>
  );
}
