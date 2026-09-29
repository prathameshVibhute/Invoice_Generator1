"use client";

import { type ClientFormValues } from "@invoice-generator/types";
import type { Client } from "@invoice-generator/types";
import { FormType } from "./constants";
import { ClientFormHeader } from "./components/client-form-header";
import { ClientFormContainer } from "./components/client-form-container";
type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">;

interface ClientFormScreen {
  id?: string;
  addClientAction: (client: NewClient) => Promise<Client>;
}

export function ClientFormScreen({ id, addClientAction }: ClientFormScreen) {

  return (
    <>
      {/* Header section */}
      <ClientFormHeader formType={id ? FormType.Edit : FormType.New } />
      {/* Form Container */}
      <ClientFormContainer addClientAction={addClientAction} />
    </>      
  );
}
