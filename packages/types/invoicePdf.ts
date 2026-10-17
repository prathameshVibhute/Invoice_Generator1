export type InvoicePdfGstSplitType = "none" | "cgst_sgst" | "igst";

export type InvoicePdfData = {
  invoiceNumber: string;
  invoiceDate: string;
  isGstInvoice: boolean;
  gstSplitType: InvoicePdfGstSplitType;
  organization: {
    name: string;
    address: string;
    state: string;
    country: string;
    gstNo: string | null;
    contactDetails: string;
    logoDataUrl: string | null;
    signatureDataUrl: string | null;
  };
  client: {
    name: string;
    address: string;
    state: string;
    country: string;
    gstNo: string | null;
    contactDetails: string;
    email: string;
  };
  items: Array<{
    serialNo: number;
    itemName: string;
    hsnSacCode: string;
    quantity: string;
    rate: string;
    gstPercentage: string | null;
    total: string;
  }>;
  totals: {
    subtotal: string;
    cgst: string | null;
    sgst: string | null;
    igst: string | null;
    total: string;
  };
  labels: Record<string, string>;
};
