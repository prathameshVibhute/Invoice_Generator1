import { ClientListScreen } from "@invoice-generator/modules";
import { ORGANIZATION_ID } from "../../lib/constants";
import { getClientsAction } from "../../lib/firestore/clients/actions";
import { getOrganizationByIdAction } from "../../lib/firestore/organizations/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const organization = await getOrganizationByIdAction(ORGANIZATION_ID);
  if (!organization) {
    throw new Error(`Organization not found: ${ORGANIZATION_ID}`);
  }

  return (
    <ClientListScreen getClientsAction={getClientsAction} organizationName={organization.name} />
  );
}
