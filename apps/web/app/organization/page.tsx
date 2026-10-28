import { OrganizationScreen } from "@invoice-generator/modules";
import { ORGANIZATION_ID } from "../../lib/constants";
import {
  getOrganizationByIdAction,
  updateOrganizationAction,
} from "../../lib/firestore/organizations/actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const organization = await getOrganizationByIdAction(ORGANIZATION_ID);
  if (!organization) notFound();

  return (
    <OrganizationScreen
      organization={organization}
      updateOrganizationAction={updateOrganizationAction}
    />
  );
}
