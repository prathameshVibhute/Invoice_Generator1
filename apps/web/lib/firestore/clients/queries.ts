import type { Client } from "@invoice-generator/types";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted" | "pendingInvoiceCount">;
type ClientUpdates = Partial<Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">>;

/**
 * 
 * @param orgId 
 * @param clientId 
 * @returns 
 */

export async function getClientById(orgId: string = "n4u3mv4HPuAhPxs3Dot7", clientId: string): Promise<Client | null> {
  const snapshot = await getDoc(doc(db, "invoice_generation_clients", clientId));
  if (!snapshot.exists()) return null;

  const client = { ...snapshot.data(), id: snapshot.id } as Client;
  return client.orgId === orgId && !client.isDeleted ? client : null;
}

export async function getClients(orgId: string = "n4u3mv4HPuAhPxs3Dot7"): Promise<Client[]> {
  const clientsQuery = query(collection(db, "invoice_generation_clients"), where("orgId", "==", orgId));
  const snapshot = await getDocs(clientsQuery);

  return snapshot.docs
    .map((clientSnapshot) => ({ ...clientSnapshot.data(), id: clientSnapshot.id }) as Client)
    .filter((client) => !client.isDeleted)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function addClient(orgId: string = "n4u3mv4HPuAhPxs3Dot7", client: NewClient): Promise<Client> {
  const normalizedName = client.clientName.trim().toLowerCase();
  const existingClients = await getClients(orgId);
  const alreadyExists = existingClients.some(
    (existingClient) => existingClient.clientName.trim().toLowerCase() === normalizedName,
  );

  if (alreadyExists) {
    throw new Error("A client with this organization name already exists.");
  }
  console.log("Added new client: ",client);
  return createClient(orgId, { ...client, clientName: client.clientName.trim() });
}

export async function createClient(orgId: string, client: NewClient): Promise<Client> {
  const reference = doc(collection(db, "invoice_generation_clients"));
  const createdClient: Client = {
    ...client,
    id: reference.id,
    orgId,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    pendingInvoiceCount: 0
  };

  await setDoc(reference, createdClient);
  return createdClient;
}

export async function updateClient(
  orgId: string,
  clientId: string,
  updates: ClientUpdates,
): Promise<void> {
  await updateDoc(doc(db, "invoice_generation_clients", clientId), { ...updates, orgId });
}

export async function deleteClient(orgId: string, clientId: string): Promise<void> {
  await updateDoc(doc(db, "invoice_generation_clients", clientId), { isDeleted: true, orgId });
}