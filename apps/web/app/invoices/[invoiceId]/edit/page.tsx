import { InvoiceFormScreen } from "@invoice-generator/modules";
import { notFound } from "next/navigation";
import { getClientByIdAction, getClientsAction } from "../../../../lib/firestore/clients/actions";
import {
  getInvoiceByIdAction,
  updateInvoiceAction,
} from "../../../../lib/firestore/invoices/actions";
import { getOrganizationByIdAction } from "../../../../lib/firestore/organizations/actions";
import { ORGANIZATION_ID } from "../../../../lib/constants";

export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const [invoice, organization] = await Promise.all([
    getInvoiceByIdAction(invoiceId),
    getOrganizationByIdAction(ORGANIZATION_ID),
  ]);
  if (!invoice) notFound();
  if (!organization) {
    throw new Error(`Organization not found: ${ORGANIZATION_ID}`);
  }
  const initialClient = await getClientByIdAction(invoice.clientId);
  if (!initialClient) {
    throw new Error(`Client not found for invoice ${invoice.id}: ${invoice.clientId}`);
  }

  return (
    <InvoiceFormScreen
      invoice={invoice}
      initialClient={initialClient}
      organization={organization}
      getClientsAction={getClientsAction}
      updateInvoiceAction={updateInvoiceAction}
    />
  );
}
