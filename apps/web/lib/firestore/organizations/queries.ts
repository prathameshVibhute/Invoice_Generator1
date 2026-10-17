import type { Organization } from "@invoice-generator/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

type NewOrganization = Omit<Organization, "id" | "createdAt">;
type OrganizationUpdates = Partial<Omit<Organization, "id" | "createdAt">>;

const organizationsCollection = "invoice_generation_organizations";

export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  const snapshot = await getDoc(doc(db, organizationsCollection, organizationId));
  if (!snapshot.exists()) return null;

  return { ...snapshot.data(), id: snapshot.id } as Organization;
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
