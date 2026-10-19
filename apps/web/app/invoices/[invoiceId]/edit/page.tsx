import { InvoiceFormScreen } from "@invoice-generator/modules";
import { getClientsAction } from "../../../../lib/firestore/clients/actions";
import { getOrganizationByIdAction } from "../../../../lib/firestore/organizations/actions";
import { ORGANIZATION_ID } from "../../../../lib/constants";

export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const organization = await getOrganizationByIdAction(ORGANIZATION_ID);
  if (!organization) {
    throw new Error(`Organization not found: ${ORGANIZATION_ID}`);
  }

  return (
    <InvoiceFormScreen
      id={invoiceId}
      organization={organization}
      getClientsAction={getClientsAction}
    />
  );
}
