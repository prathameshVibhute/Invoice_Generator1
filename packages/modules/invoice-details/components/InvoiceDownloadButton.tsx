"use client";

import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import type { InvoiceWithClientDetails, Organization } from "@invoice-generator/types";
import { Button } from "@invoice-generator/ui/button";
import { createInvoicePdfBlob } from "../utils/createInvoicePdfBlob";
import { downloadBlob } from "../utils/downloadBlob";

function sanitizeFilename(invoiceNumber: string): string {
  return `${invoiceNumber.replace(/[\\/]+/g, "-")}.pdf`;
}

export function InvoiceDownloadButton({
  invoice,
  organization,
}: {
  invoice: InvoiceWithClientDetails;
  organization: Organization;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const blob = await createInvoicePdfBlob(invoice, organization);
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
