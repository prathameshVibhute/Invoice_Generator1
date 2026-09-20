import { ClientFormScreen } from "@invoice-generator/modules";
export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientFormScreen id={clientId} />;
}
