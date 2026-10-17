import type { Invoice, InvoiceItem } from "@invoice-generator/types";

export function getItemSubtotal(item: Pick<InvoiceItem, "quantity" | "rate">): number {
  return item.quantity * item.rate;
}

export function calculateItemTax(
  item: Pick<InvoiceItem, "quantity" | "rate" | "gstPercentage">,
  isGstInvoice: boolean,
): number {
  if (!isGstInvoice || item.gstPercentage == null) {
    return 0;
  }

  return getItemSubtotal(item) * (item.gstPercentage / 100);
}

export function calculateInvoiceTotals(
  invoice: Pick<Invoice, "items" | "isGstInvoice" | "gstSplitType">,
): {
  subtotal: number;
  gst: number;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  total: number;
} {
  const subtotal = invoice.items.reduce((total, item) => total + getItemSubtotal(item), 0);
  const gst = invoice.items.reduce(
    (total, item) => total + calculateItemTax(item, invoice.isGstInvoice),
    0,
  );
  const total = subtotal + gst;

  if (!invoice.isGstInvoice || invoice.gstSplitType === "none") {
    return {
      subtotal,
      gst: 0,
      cgst: null,
      sgst: null,
      igst: null,
      total,
    };
  }

  if (invoice.gstSplitType === "cgst_sgst") {
    const splitTax = gst / 2;
    return {
      subtotal,
      gst,
      cgst: splitTax,
      sgst: splitTax,
      igst: null,
      total,
    };
  }

  return {
    subtotal,
    gst,
    cgst: null,
    sgst: null,
    igst: gst,
    total,
  };
}
