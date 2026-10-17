"use server";

import type { Organization } from "@invoice-generator/types";
import {
  addOrganization,
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from "./queries";

type NewOrganization = Omit<Organization, "id" | "createdAt">;
type OrganizationUpdates = Partial<Omit<Organization, "id" | "createdAt">>;

export async function addOrganizationAction(organization: NewOrganization): Promise<Organization> {
  return addOrganization(organization);
}

export async function updateOrganizationAction(
  organizationId: string,
  updates: OrganizationUpdates,
): Promise<void> {
  return updateOrganization(organizationId, updates);
}

export async function deleteOrganizationAction(organizationId: string): Promise<void> {
  return deleteOrganization(organizationId);
}

export async function getOrganizationByIdAction(
  organizationId: string,
): Promise<Organization | null> {
  return getOrganizationById(organizationId);
}
