import type { Invoice } from "@invoice-generator/types";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

type NewInvoice = Omit<Invoice, "id" | "orgId" | "createdAt" | "updatedAt" | "isDeleted">;
type InvoiceUpdates = Partial<
  Omit<Invoice, "id" | "orgId" | "createdAt" | "updatedAt" | "isDeleted">
>;

export async function createInvoice(orgId: string, invoice: NewInvoice): Promise<Invoice> {
  const reference = doc(collection(db, "invoices"));
  const now = new Date().toISOString();
  const createdInvoice: Invoice = {
    ...invoice,
    id: reference.id,
    orgId,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(reference, createdInvoice);
  return createdInvoice;
}

export async function updateInvoice(
  orgId: string,
  invoiceId: string,
  updates: InvoiceUpdates,
): Promise<void> {
  await updateDoc(doc(db, "invoices", invoiceId), {
    ...updates,
    orgId,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteInvoice(orgId: string, invoiceId: string): Promise<void> {
  await updateDoc(doc(db, "invoices", invoiceId), {
    isDeleted: true,
    orgId,
    updatedAt: new Date().toISOString(),
  });
}