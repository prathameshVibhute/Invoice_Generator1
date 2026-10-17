import type { Client, Invoice, Organization } from "@invoice-generator/types";
import type { InvoicePdfData } from "@invoice-generator/types/invoicePdf";
import { calculateInvoiceTotals } from "../../invoice-form/utils/gstCalculator";

export type InvoicePdfBuilderInput = {
  invoice: Invoice;
  organization: Organization;
  client: Client;
  logoDataUrl: string | null;
  signatureDataUrl: string | null;
  labels?: Record<string, string>;
};

const defaultLabels: Record<string, string> = {
  invoice: "Invoice",
  billTo: "Bill To",
  invoiceNumber: "Invoice No.",
  invoiceDate: "Date",
  subtotal: "Subtotal",
  total: "Total",
  hsnSac: "HSN/SAC",
  qty: "Qty",
  rate: "Rate",
  gstPercent: "GST %",
  item: "Item",
  amount: "Amount",
  page: "Page",
  of: "of",
  contact: "Contact",
  email: "Email",
  gstNumber: "GST No.",
  state: "State",
  country: "Country",
  signature: "Signature",
  cgst: "CGST",
  sgst: "SGST",
  igst: "IGST",
};

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatCurrency(value: number): string {
  return moneyFormatter.format(value);
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function compactValue(value: string | null | undefined): string {
  return value == null || value.trim() === "" ? "—" : value.trim();
}

function buildAddress(...parts: Array<string | null | undefined>): string {
  return parts.filter((part) => part != null && part.trim() !== "").join(", ");
}

export function buildInvoicePdfData({
  invoice,
  organization,
  client,
  logoDataUrl,
  signatureDataUrl,
  labels,
}: InvoicePdfBuilderInput): InvoicePdfData {
  const pdfLabels = { ...defaultLabels, ...(labels ?? {}) };
  const totals = calculateInvoiceTotals(invoice);

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.createdAt),
    isGstInvoice: invoice.isGstInvoice,
    gstSplitType: invoice.gstSplitType,
    organization: {
      name: organization.name,
      address: buildAddress(organization.address, organization.state, organization.country),
      state: organization.state,
      country: organization.country,
      gstNo: organization.gstNumber,
      contactDetails: compactValue(organization.contactDetails),
      logoDataUrl,
      signatureDataUrl,
    },
    client: {
      name: client.clientName,
      address: buildAddress(client.address, client.state, client.country),
      state: client.state,
      country: client.country,
      gstNo: client.gstNumber,
      contactDetails: compactValue(client.contactDetails),
      email: compactValue(client.email),
    },
    items: invoice.items.map((item, index) => ({
      serialNo: index + 1,
      itemName: item.itemName,
      hsnSacCode: "-",
      quantity: String(item.quantity),
      rate: formatCurrency(item.rate),
      gstPercentage:
        item.gstPercentage == null || !invoice.isGstInvoice ? null : `${item.gstPercentage}%`,
      total: formatCurrency(item.total),
    })),
    totals: {
      subtotal: formatCurrency(totals.subtotal),
      cgst:
        invoice.isGstInvoice && invoice.gstSplitType === "cgst_sgst" && totals.cgst != null
          ? formatCurrency(totals.cgst)
          : null,
      sgst:
        invoice.isGstInvoice && invoice.gstSplitType === "cgst_sgst" && totals.sgst != null
          ? formatCurrency(totals.sgst)
          : null,
      igst:
        invoice.isGstInvoice && invoice.gstSplitType === "igst" && totals.igst != null
          ? formatCurrency(totals.igst)
          : null,
      total: formatCurrency(invoice.total),
    },
    labels: pdfLabels,
  };
}
