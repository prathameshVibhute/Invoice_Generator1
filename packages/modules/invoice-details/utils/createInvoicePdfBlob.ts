import type { InvoiceWithClientDetails, Organization } from "@invoice-generator/types";
import { buildInvoicePdfData } from "./buildInvoicePdfData";
import { generateInvoicePdf } from "./generateInvoicePdf";
import { loadImageAsDataUrl } from "./loadImageAsDataUrl";

const pdfLabels = {
  invoice: "TAX INVOICE",
  billTo: "Bill To",
  invoiceNumber: "Invoice No.",
  invoiceDate: "Date",
  placeOfSupply: "Place of Supply",
  subtotal: "Subtotal (excl. GST)",
  total: "Total",
  hsnSac: "HSN/SAC",
  qty: "Qty",
  rate: "Rate",
  gstPercent: "GST %",
  item: "Item",
  amount: "Amount",
  contact: "Phone",
  email: "Email",
  gstNumber: "GST No.",
  cgst: "CGST",
  sgst: "SGST",
  igst: "IGST",
  intraStateSupply: "Intra-state supply: CGST + SGST",
  interStateSupply: "Inter-state supply: IGST",
  authorisedSignatory: "Authorised Signatory",
};

export async function createInvoicePdfBlob(
  invoice: InvoiceWithClientDetails,
  organization: Organization,
): Promise<Blob> {
  const [logoDataUrl, stampDataUrl, signatureDataUrl] = await Promise.all([
    loadImageAsDataUrl(organization.logoUrl),
    loadImageAsDataUrl(organization.stampUrl ?? null),
    loadImageAsDataUrl(organization.signatureUrl ?? invoice.signatureUrl),
  ]);

  const data = buildInvoicePdfData({
    invoice,
    organization,
    logoDataUrl,
    stampDataUrl,
    signatureDataUrl,
    labels: pdfLabels,
  });

  return generateInvoicePdf(data);
}
