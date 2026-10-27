"use client";

import { useEffect, useState } from "react";
import type { InvoiceWithClientDetails, Organization } from "@invoice-generator/types";
import { createInvoicePdfBlob } from "../utils/createInvoicePdfBlob";

export function InvoicePdfPreview({
  invoice,
  organization,
}: {
  invoice: InvoiceWithClientDetails;
  organization: Organization;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function createPreview() {
      try {
        const blob = await createInvoicePdfBlob(invoice, organization);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (previewError) {
        console.error("Unable to generate invoice PDF preview.", previewError);
        if (!cancelled) setError("Unable to preview invoice. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void createPreview();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [invoice, organization]);

  return (
    <div className="mt-3">
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
          Preparing PDF preview…
        </div>
      ) : null}
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      {previewUrl ? (
        <iframe
          className="h-[75vh] w-full rounded-xl border border-slate-200"
          src={previewUrl}
          title={`PDF preview for invoice ${invoice.invoiceNumber}`}
        />
      ) : null}
    </div>
  );
}
