"use client";

import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import type { Client, Invoice, Organization } from "@invoice-generator/types";
import { Button } from "@invoice-generator/ui/button";
import { buildInvoicePdfData } from "../utils/buildInvoicePdfData";
import { downloadBlob } from "../utils/downloadBlob";
import { generateInvoicePdf } from "../utils/generateInvoicePdf";
import { loadImageAsDataUrl } from "../utils/loadImageAsDataUrl";

const pdfLabels = {
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
  cgst: "CGST",
  sgst: "SGST",
  igst: "IGST",
};

function sanitizeFilename(invoiceNumber: string): string {
  return `${invoiceNumber.replace(/[\\/]+/g, "-")}.pdf`;
}

export function InvoiceDownloadButton({
  invoice,
  organization,
  client,
}: {
  invoice: Invoice;
  organization: Organization;
  client: Client;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const [logoDataUrl, signatureDataUrl] = await Promise.all([
        loadImageAsDataUrl(organization.logoUrl),
        loadImageAsDataUrl(invoice.signatureUrl ?? organization.signatureUrl),
      ]);

      const data = buildInvoicePdfData({
        invoice,
        organization,
        client,
        logoDataUrl,
        signatureDataUrl,
        labels: pdfLabels,
      });

      const blob = await generateInvoicePdf(data);
      downloadBlob(blob, sanitizeFilename(invoice.invoiceNumber));
    } catch {
      setError("Unable to download invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        aria-label="Download invoice"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleDownload}
        disabled={isLoading}
      >
        <IconDownload className="h-5 w-5" />
        {isLoading ? "Preparing PDF…" : "Download"}
      </Button>
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
    </>
  );
}
