"use client";

import { type ClientFormValues } from "@invoice-generator/types";
import type { Client } from "@invoice-generator/types";
import { FormType } from "./constants";
import { ClientFormHeader } from "./components/client-form-header";
import { ClientFormContainer } from "./components/client-form-container";
type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">;

interface ClientFormScreen {
  id?: string;
  client?: Client;
  addClientAction?: (client: NewClient) => Promise<Client>;
  updateClientAction?: (clientId: string, updates: Partial<NewClient>) => Promise<void>;
}

export function ClientFormScreen({
  id,
  client,
  addClientAction,
  updateClientAction,
}: ClientFormScreen) {
  return (
    <>
      {/* Header section */}
      <ClientFormHeader formType={id ? FormType.Edit : FormType.New} />
      {/* Form Container */}
      <ClientFormContainer
        {...(id !== undefined ? { id } : {})}
        {...(client !== undefined ? { client } : {})}
        {...(addClientAction !== undefined ? { addClientAction } : {})}
        {...(updateClientAction !== undefined ? { updateClientAction } : {})}
      />
    </>
  );
}
