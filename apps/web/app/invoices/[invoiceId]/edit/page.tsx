import { InvoiceFormScreen } from "@invoice-generator/modules";
import { getClientsAction } from "../../../../lib/firestore/clients/actions";

export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  return <InvoiceFormScreen id={invoiceId} getClientsAction={getClientsAction} />;
}
