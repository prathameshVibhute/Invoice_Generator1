import type { Invoice } from "@invoice-generator/types";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  const invoicesQuery = query(collection(db, "invoices"), where("orgId", "==", orgId));
  const snapshot = await getDocs(invoicesQuery);

  return snapshot.docs
    .map((invoiceSnapshot) => ({ ...invoiceSnapshot.data(), id: invoiceSnapshot.id }) as Invoice)
    .filter((invoice) => !invoice.isDeleted)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function getInvoiceById(orgId: string, invoiceId: string): Promise<Invoice | null> {
  const snapshot = await getDoc(doc(db, "invoices", invoiceId));
  if (!snapshot.exists()) return null;

  const invoice = { ...snapshot.data(), id: snapshot.id } as Invoice;
  return invoice.orgId === orgId && !invoice.isDeleted ? invoice : null;
}

export async function getInvoicesByClient(orgId: string, clientId: string): Promise<Invoice[]> {
  const invoices = await getInvoices(orgId);
  return invoices.filter((invoice) => invoice.clientId === clientId);
}