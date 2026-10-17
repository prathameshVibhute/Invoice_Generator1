import { InvoiceFormScreen } from "@invoice-generator/modules";
import { getClientsAction } from "../../../lib/firestore/clients/actions";
export default function Page() {
  return <InvoiceFormScreen getClientsAction={getClientsAction} />;
}
