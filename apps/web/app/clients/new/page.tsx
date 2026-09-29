"use client";

import { ClientFormScreen } from "@invoice-generator/modules";
import { addClientAction } from "../../../lib/firestore/clients/actions";
export default function Page() {
  return (
    <ClientFormScreen 
      addClientAction={addClientAction}
    />
  );
}
