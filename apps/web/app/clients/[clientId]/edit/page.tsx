import { ClientFormScreen } from "@invoice-generator/modules";
import { notFound } from "next/navigation";
import { getClientByIdAction, updateClientAction } from "../../../../lib/firestore/clients/actions";

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = await getClientByIdAction(clientId);
  if (!client) notFound();

  return <ClientFormScreen id={clientId} client={client} updateClientAction={updateClientAction} />;
}
