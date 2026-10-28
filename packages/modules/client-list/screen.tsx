"use client";

import { ClientListHeader } from "./components/client-list-header";
import { ClientListContainer } from "./components/client-list-container";
import { Client } from "@invoice-generator/types";

interface ClientListScreenProps {
  getClientsAction: () => Promise<Client[]>;
  organizationName: string;
}

export function ClientListScreen({ getClientsAction, organizationName }: ClientListScreenProps) {
  return (
    <div className="flex flex-col">
      <ClientListHeader organizationName={organizationName} />
      <ClientListContainer getClientsAction={getClientsAction} />
    </div>
  );
}
