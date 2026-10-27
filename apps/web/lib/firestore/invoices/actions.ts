"use server";

import {
  invoicePayloadSchema,
  type Invoice,
  type InvoiceClientDetails,
  type InvoicePayload,
  type InvoiceWithClientDetails,
} from "@invoice-generator/types";
import { doc, updateDoc } from "firebase/firestore";
import { ORGANIZATION_ID } from "../../constants";
import { db } from "../../firebase";
import { getInvoiceClientById, getInvoiceClients } from "../clients/queries";
import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  getInvoicesByClient,
  updateInvoice as updateInvoiceRecord,
} from "./queries";

export async function createInvoiceAction(payload: InvoicePayload): Promise<Invoice> {
  const invoice = invoicePayloadSchema.parse(payload);
  const { orgId, ...newInvoice } = invoice;
  return createInvoice(orgId, newInvoice);
}

function toInvoiceClientDetails(client: {
  clientName: string;
  address: string;
  contactDetails: string;
  email: string;
  gstNumber: string | null;
  state: string;
  country: string;
}): InvoiceClientDetails {
  return {
    clientName: client.clientName,
    address: client.address,
    contactDetails: client.contactDetails,
    email: client.email,
    gstNumber: client.gstNumber,
    state: client.state,
    country: client.country,
  };
}

export async function getInvoicesAction(): Promise<InvoiceWithClientDetails[]> {
  const [invoices, clients] = await Promise.all([
    getInvoices(ORGANIZATION_ID),
    getInvoiceClients(ORGANIZATION_ID),
  ]);
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  return invoices.map((invoice) => {
    const client = clientsById.get(invoice.clientId);
    if (!client) {
      throw new Error(`Client not found for invoice ${invoice.id}: ${invoice.clientId}`);
    }
    return { ...invoice, clientDetails: toInvoiceClientDetails(client) };
  });
}

export async function getInvoicesByClientAction(
  clientId: string,
): Promise<InvoiceWithClientDetails[]> {
  const [invoices, client] = await Promise.all([
    getInvoicesByClient(ORGANIZATION_ID, clientId),
    getInvoiceClientById(ORGANIZATION_ID, clientId),
  ]);
  if (!client) {
    throw new Error(`Client not found for organization ${ORGANIZATION_ID}: ${clientId}`);
  }
  const clientDetails = toInvoiceClientDetails(client);

  return invoices
    .filter((invoice) => invoice.clientId === clientId)
    .map((invoice) => ({ ...invoice, clientDetails }));
}

export async function getInvoiceByIdAction(
  invoiceId: string,
): Promise<InvoiceWithClientDetails | null> {
  const invoice = await getInvoiceById(ORGANIZATION_ID, invoiceId);
  if (!invoice) return null;

  const client = await getInvoiceClientById(ORGANIZATION_ID, invoice.clientId);
  if (!client) {
    throw new Error(`Client not found for invoice ${invoice.id}: ${invoice.clientId}`);
  }
  return { ...invoice, clientDetails: toInvoiceClientDetails(client) };
}

export async function updateInvoiceAction(
  invoiceId: string,
  payload: InvoicePayload,
): Promise<void> {
  const invoice = invoicePayloadSchema.parse(payload);
  if (invoice.orgId !== ORGANIZATION_ID) {
    throw new Error("Invoice organization does not match the current organization.");
  }
  await updateInvoiceRecord(ORGANIZATION_ID, invoiceId, invoice);
}

export async function deleteInvoice(orgId: string, invoiceId: string): Promise<void> {
  await updateDoc(doc(db, "invoice_generation_invoices", invoiceId), {
    isDeleted: true,
    orgId,
    updatedAt: new Date().toISOString(),
  });
}
