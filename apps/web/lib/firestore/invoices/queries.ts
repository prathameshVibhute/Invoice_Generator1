import type { Invoice, InvoicePayload } from "@invoice-generator/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

type NewInvoice = Omit<InvoicePayload, "orgId">;

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  const invoicesQuery = query(
    collection(db, "invoice_generation_invoices"),
    where("orgId", "==", orgId),
  );
  const snapshot = await getDocs(invoicesQuery);

  return snapshot.docs
    .map((invoiceSnapshot) => ({ ...invoiceSnapshot.data(), id: invoiceSnapshot.id }) as Invoice)
    .filter((invoice) => !invoice.isDeleted)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function getInvoiceById(orgId: string, invoiceId: string): Promise<Invoice | null> {
  const snapshot = await getDoc(doc(db, "invoice_generation_invoices", invoiceId));
  if (!snapshot.exists()) return null;

  const invoice = { ...snapshot.data(), id: snapshot.id } as Invoice;
  return invoice.orgId === orgId && !invoice.isDeleted ? invoice : null;
}

export async function getInvoicesByClient(orgId: string, clientId: string): Promise<Invoice[]> {
  const invoices = await getInvoices(orgId);
  return invoices.filter((invoice) => invoice.clientId === clientId);
}

export async function createInvoice(orgId: string, invoice: NewInvoice): Promise<Invoice> {
  const invoiceReference = doc(collection(db, "invoice_generation_invoices"));
  const organizationReference = doc(db, "invoice_generation_organizations", orgId);
  const clientReference = doc(db, "invoice_generation_clients", invoice.clientId);
  const now = new Date().toISOString();
  const createdInvoice: Invoice = {
    ...invoice,
    id: invoiceReference.id,
    orgId,
    status: "draft",
    amountPaid: 0,
    signatureUrl: null,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await runTransaction(db, async (transaction) => {
    const [organizationSnapshot, clientSnapshot] = await Promise.all([
      transaction.get(organizationReference),
      transaction.get(clientReference),
    ]);

    if (!organizationSnapshot.exists()) {
      throw new Error(`Organization not found: ${orgId}`);
    }
    if (!clientSnapshot.exists()) {
      throw new Error(`Client not found: ${invoice.clientId}`);
    }

    const client = clientSnapshot.data();
    if (client.orgId !== orgId || client.isDeleted) {
      throw new Error(`Client does not belong to organization: ${invoice.clientId}`);
    }

    transaction.set(invoiceReference, createdInvoice);
    transaction.update(organizationReference, {
      invoiceCount: increment(1),
      "invoiceCountDetails.unpaidInvoiceCount": increment(1),
    });
    transaction.update(clientReference, { pendingInvoiceCount: increment(1) });
  });

  return createdInvoice;
}

export async function updateInvoice(
  orgId: string,
  invoiceId: string,
  updates: InvoicePayload,
): Promise<void> {
  if (updates.orgId !== orgId) {
    throw new Error("Invoice organization does not match the requested organization.");
  }

  const invoiceReference = doc(db, "invoice_generation_invoices", invoiceId);
  const clientReference = doc(db, "invoice_generation_clients", updates.clientId);

  await runTransaction(db, async (transaction) => {
    const [invoiceSnapshot, clientSnapshot] = await Promise.all([
      transaction.get(invoiceReference),
      transaction.get(clientReference),
    ]);

    if (!invoiceSnapshot.exists()) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }

    const existingInvoice = invoiceSnapshot.data();
    if (existingInvoice.orgId !== orgId || existingInvoice.isDeleted) {
      throw new Error(`Invoice does not belong to organization: ${invoiceId}`);
    }

    if (!clientSnapshot.exists()) {
      throw new Error(`Client not found: ${updates.clientId}`);
    }
    const client = clientSnapshot.data();
    if (client.orgId !== orgId || client.isDeleted) {
      throw new Error(`Client does not belong to organization: ${updates.clientId}`);
    }

    const clientChanged = existingInvoice.clientId !== updates.clientId;
    const shouldUpdatePendingCounts = clientChanged && existingInvoice.status !== "paid";
    const previousClientReference = shouldUpdatePendingCounts
      ? doc(db, "invoice_generation_clients", existingInvoice.clientId)
      : null;
    const previousClientSnapshot = previousClientReference
      ? await transaction.get(previousClientReference)
      : null;

    if (previousClientReference && !previousClientSnapshot?.exists()) {
      throw new Error(`Previous invoice client not found: ${existingInvoice.clientId}`);
    }

    transaction.update(invoiceReference, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (previousClientReference && previousClientSnapshot?.exists()) {
      transaction.update(previousClientReference, { pendingInvoiceCount: increment(-1) });
      transaction.update(clientReference, { pendingInvoiceCount: increment(1) });
    }
  });
}
