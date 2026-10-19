import { InvoiceFormScreen } from "@invoice-generator/modules";
import { getClientsAction } from "../../../lib/firestore/clients/actions";
import { createInvoiceAction } from "../../../lib/firestore/invoices/actions";
import { getOrganizationByIdAction } from "../../../lib/firestore/organizations/actions";
import { ORGANIZATION_ID } from "../../../lib/constants";

export default async function Page() {
  const organization = await getOrganizationByIdAction(ORGANIZATION_ID);
  if (!organization) {
    throw new Error(`Organization not found: ${ORGANIZATION_ID}`);
  }

  return (
    <InvoiceFormScreen
      organization={organization}
      getClientsAction={getClientsAction}
      createInvoiceAction={createInvoiceAction}
    />
  );
}
