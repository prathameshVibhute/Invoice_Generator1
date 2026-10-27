"use server";

import type { Client } from "@invoice-generator/types";
import { ORGANIZATION_ID } from "../../constants";
import { addClient, getClientById, getClients } from "./queries";

type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">;
type ClientUpdates = Partial<Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">>;

export async function addClientAction(client: NewClient): Promise<Client> {
  return addClient(ORGANIZATION_ID, client);
}

export async function getClientsAction(searchValue?: string): Promise<Client[]> {
  return getClients(ORGANIZATION_ID, searchValue);
}

export async function getClientByIdAction(clientId: string): Promise<Client | null> {
  return getClientById(ORGANIZATION_ID, clientId);
}
