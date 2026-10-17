import { createElement } from "react";
import type { InvoicePdfData } from "@invoice-generator/types/invoicePdf";

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Blob> {
  const [{ pdf }, { InvoicePdfDocument }, { registerPdfFonts }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../pdf/InvoicePdfDocument"),
    import("../pdf/registerPdfFonts"),
  ]);

  registerPdfFonts();
  const documentElement = createElement(
    InvoicePdfDocument as never,
    { data },
  ) as Parameters<typeof pdf>[0];
  return pdf(documentElement).toBlob();
}
