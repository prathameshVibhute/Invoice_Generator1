"use server";

import { invoicePayloadSchema, type Invoice, type InvoicePayload } from "@invoice-generator/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { createInvoice } from "./queries";

type InvoiceUpdates = Partial<
  Omit<Invoice, "id" | "orgId" | "createdAt" | "updatedAt" | "isDeleted">
>;

export async function createInvoiceAction(payload: InvoicePayload): Promise<Invoice> {
  const invoice = invoicePayloadSchema.parse(payload);
  const { orgId, ...newInvoice } = invoice;
  return createInvoice(orgId, newInvoice);
}

export async function updateInvoice(
  orgId: string,
  invoiceId: string,
  updates: InvoiceUpdates,
): Promise<void> {
  await updateDoc(doc(db, "invoice_generation_invoices", invoiceId), {
    ...updates,
    orgId,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteInvoice(orgId: string, invoiceId: string): Promise<void> {
  await updateDoc(doc(db, "invoice_generation_invoices", invoiceId), {
    isDeleted: true,
    orgId,
    updatedAt: new Date().toISOString(),
  });
}
