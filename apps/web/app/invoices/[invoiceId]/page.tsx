import { InvoiceDetailsScreen } from "@invoice-generator/modules";
export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  return <InvoiceDetailsScreen id={invoiceId} />;
}
