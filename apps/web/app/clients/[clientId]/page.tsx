import { ClientDetailsScreen } from "@invoice-generator/modules";
import { notFound } from "next/navigation";
import { getClientByIdAction } from "../../../lib/firestore/clients/actions";
import { getInvoicesByClientAction } from "../../../lib/firestore/invoices/actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = await getClientByIdAction(clientId);
  if (!client) notFound();

  const invoices = await getInvoicesByClientAction(clientId);
  return <ClientDetailsScreen client={client} invoices={invoices} />;
}
