import type { Invoice, InvoiceItem } from "@invoice-generator/types";

export function isSameState(organizationState: string, clientState: string): boolean {
  const normalizedOrganizationState = organizationState.trim().toLocaleLowerCase();
  const normalizedClientState = clientState.trim().toLocaleLowerCase();

  return (
    normalizedOrganizationState !== "" &&
    normalizedClientState !== "" &&
    normalizedOrganizationState === normalizedClientState
  );
}

export function getGstBreakdown(
  items: Pick<InvoiceItem, "quantity" | "rate" | "gstPercentage">[],
  isGstInvoice: boolean,
  isIntraState: boolean,
): Array<{ label: string; amount: number }> {
  const taxableByRate = new Map<number, number>();
  for (const item of items) {
    const rate = item.gstPercentage ?? 0;
    taxableByRate.set(rate, (taxableByRate.get(rate) ?? 0) + getItemSubtotal(item));
  }

  const breakdown = [...taxableByRate.entries()]
    .filter(([rate]) => rate > 0)
    .sort(([firstRate], [secondRate]) => firstRate - secondRate)
    .flatMap(([rate, taxableAmount]) => {
      const taxAmount = isGstInvoice ? taxableAmount * (rate / 100) : 0;

      if (!isIntraState) {
        return [{ label: `IGST ${rate}%`, amount: taxAmount }];
      }

      return [
        { label: `CGST ${rate / 2}%`, amount: taxAmount / 2 },
        { label: `SGST ${rate / 2}%`, amount: taxAmount / 2 },
      ];
    });

  if (breakdown.length > 0) return breakdown;

  return isIntraState
    ? [
        { label: "CGST", amount: 0 },
        { label: "SGST", amount: 0 },
      ]
    : [{ label: "IGST", amount: 0 }];
}

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
