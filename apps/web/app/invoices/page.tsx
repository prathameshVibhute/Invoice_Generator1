import { InvoiceListScreen } from "@invoice-generator/modules";
import { ORGANIZATION_ID } from "../../lib/constants";
import { getInvoicesAction } from "../../lib/firestore/invoices/actions";
import { getOrganizationByIdAction } from "../../lib/firestore/organizations/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [invoices, organization] = await Promise.all([
    getInvoicesAction(),
    getOrganizationByIdAction(ORGANIZATION_ID),
  ]);

  if (!organization) {
    throw new Error(`Organization not found: ${ORGANIZATION_ID}`);
  }

  return <InvoiceListScreen invoices={invoices} organizationName={organization.name} />;
}
