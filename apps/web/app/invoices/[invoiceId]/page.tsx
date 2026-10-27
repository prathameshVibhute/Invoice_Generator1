import { InvoiceDetailsScreen } from "@invoice-generator/modules";
import { notFound } from "next/navigation";
import { ORGANIZATION_ID } from "../../../lib/constants";
import { getInvoiceByIdAction } from "../../../lib/firestore/invoices/actions";
import { getOrganizationByIdAction } from "../../../lib/firestore/organizations/actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = await getInvoiceByIdAction(invoiceId);
  if (!invoice) notFound();

  const organization = await getOrganizationByIdAction(ORGANIZATION_ID);
  if (!organization) notFound();

  return <InvoiceDetailsScreen invoice={invoice} organization={organization} />;
}
