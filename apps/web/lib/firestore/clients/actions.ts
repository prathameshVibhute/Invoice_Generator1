"use server";

import type { Client } from "@invoice-generator/types";
import { addClient, getClients } from "./queries";

type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">;
type ClientUpdates = Partial<Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">>;

export async function addClientAction(client: NewClient): Promise<Client> {
	return addClient("n4u3mv4HPuAhPxs3Dot7", client);
}

export async function getClientsAction(): Promise<Client[]> {
	return getClients();
}
