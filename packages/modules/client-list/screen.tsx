"use client";

import { ClientListHeader } from "./components/client-list-header";
import { ClientListContainer } from "./components/client-list-container";
import { Client } from "@invoice-generator/types";

interface ClientListScreenProps {
  getClientsAction: () => Promise<Client[]>;
}

export function ClientListScreen({getClientsAction}: ClientListScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <ClientListHeader />
      <ClientListContainer getClientsAction={getClientsAction} />
    </div>
  );
}
