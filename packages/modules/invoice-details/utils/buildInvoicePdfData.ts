import type { InvoiceWithClientDetails, Organization } from "@invoice-generator/types";
import type { InvoicePdfData } from "@invoice-generator/types/invoicePdf";
import { calculateInvoiceTotals } from "../../invoice-form/utils/gstCalculator";

export type InvoicePdfBuilderInput = {
  invoice: InvoiceWithClientDetails;
  organization: Organization;
  logoDataUrl: string | null;
  stampDataUrl: string | null;
  signatureDataUrl: string | null;
  labels?: Record<string, string>;
};

const defaultLabels: Record<string, string> = {
  invoice: "Invoice",
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
  state: "State",
  country: "Country",
  signature: "Signature",
  cgst: "CGST",
  sgst: "SGST",
  igst: "IGST",
  intraStateSupply: "Intra-state supply: CGST + SGST",
  interStateSupply: "Inter-state supply: IGST",
  authorisedSignatory: "Authorised Signatory",
};

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function formatCurrency(value: number): string {
  return moneyFormatter.format(value);
}

function formatDate(value: string): string {
  const date = new Date(value);
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
  logoDataUrl,
  stampDataUrl,
  signatureDataUrl,
  labels,
}: InvoicePdfBuilderInput): InvoicePdfData {
  const client = invoice.clientDetails;
  const pdfLabels = { ...defaultLabels, ...(labels ?? {}) };
  const totals = calculateInvoiceTotals(invoice);
  const taxableByRate = new Map<number, number>();
  if (invoice.isGstInvoice) {
    for (const item of invoice.items) {
      const rate = item.gstPercentage ?? 0;
      if (rate > 0) {
        taxableByRate.set(rate, (taxableByRate.get(rate) ?? 0) + item.quantity * item.rate);
      }
    }
  }
  const taxBreakdown: InvoicePdfData["taxBreakdown"] = [];
  for (const [rate, taxableAmount] of [...taxableByRate.entries()].sort(
    ([firstRate], [secondRate]) => firstRate - secondRate,
  )) {
    if (invoice.gstSplitType === "cgst_sgst") {
      for (const taxType of ["CGST", "SGST"] as const) {
        taxBreakdown.push({
          taxType,
          rate: rate / 2,
          taxableAmount: formatCurrency(taxableAmount),
          amount: formatCurrency((taxableAmount * rate) / 200),
        });
      }
    } else if (invoice.gstSplitType === "igst") {
      taxBreakdown.push({
        taxType: "IGST",
        rate,
        taxableAmount: formatCurrency(taxableAmount),
        amount: formatCurrency((taxableAmount * rate) / 100),
      });
    }
  }

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.createdAt),
    isGstInvoice: invoice.isGstInvoice,
    gstSplitType: invoice.gstSplitType,
    placeOfSupply: client.state,
    organization: {
      name: organization.name,
      address: buildAddress(organization.address, organization.state, organization.country),
      state: organization.state,
      country: organization.country,
      gstNo: organization.gstNumber,
      contactDetails: compactValue(organization.contactDetails),
      email: compactValue(organization.email),
      logoDataUrl,
      stampDataUrl,
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
      description: item.description?.trim() ?? "",
      hsnSacCode: "-",
      quantity: String(item.quantity),
      rate: formatCurrency(item.rate),
      gstPercentage:
        item.gstPercentage == null || !invoice.isGstInvoice ? null : `${item.gstPercentage}%`,
      total: formatCurrency(item.quantity * item.rate),
    })),
    taxBreakdown,
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
