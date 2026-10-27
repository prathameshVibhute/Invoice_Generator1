import type { Organization } from "@invoice-generator/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

type NewOrganization = Omit<Organization, "id" | "createdAt">;
type OrganizationUpdates = Partial<Omit<Organization, "id" | "createdAt">>;

const organizationsCollection = "invoice_generation_organizations";

function toOrganizationString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  const snapshot = await getDoc(doc(db, organizationsCollection, organizationId));
  if (!snapshot.exists()) return null;

  const storedOrganization = snapshot.data();
  const gstNumber = toOrganizationString(
    storedOrganization.gstNo ??
      storedOrganization.gstNumber ??
      storedOrganization.orgGSTNumber ??
      storedOrganization.orgGST,
  );
  const email = toOrganizationString(storedOrganization.email ?? storedOrganization.orgEmail);
  return {
    ...storedOrganization,
    id: snapshot.id,
    name: storedOrganization.organizationName ?? storedOrganization.name,
    gstNumber: gstNumber || null,
    logoUrl: storedOrganization.orgIcon ?? storedOrganization.logoUrl ?? null,
    signatureUrl: storedOrganization.orgSignature ?? storedOrganization.signatureUrl ?? null,
    stampUrl: storedOrganization.orgStamp ?? storedOrganization.stampUrl ?? null,
    contactDetails: toOrganizationString(
      storedOrganization.phone ??
        storedOrganization.contactDetails ??
        storedOrganization.orgContactNumber ??
        storedOrganization.contactNumber,
    ),
    email: email || null,
  } as Organization;
}

export async function addOrganization(organization: NewOrganization): Promise<Organization> {
  const reference = doc(collection(db, organizationsCollection));
  const createdOrganization: Organization = {
    ...organization,
    id: reference.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(reference, createdOrganization);
  return createdOrganization;
}

export async function updateOrganization(
  organizationId: string,
  updates: OrganizationUpdates,
): Promise<void> {
  await updateDoc(doc(db, organizationsCollection, organizationId), updates);
}

export async function deleteOrganization(organizationId: string): Promise<void> {
  await deleteDoc(doc(db, organizationsCollection, organizationId));
}
