"use client";

import { useState } from "react";
import type { Client } from "@invoice-generator/types";
import { Stepper, type StepperStep } from "@invoice-generator/ui/stepper";
import { Button } from "@invoice-generator/ui/button";
import { clients, invoices, organization } from "../data";
import { InvoiceFormClientDetails } from "./components/invoice-form-client-details";
import { InvoiceFormHeader } from "./components/invoice-form-header";
import { InvoiceFormItemDetails } from "./components/invoice-form-item-details";
import { InvoiceFormReview } from "./components/invoice-form-review";

export function InvoiceFormScreen({
  id,
  getClientsAction,
}: {
  id?: string;
  getClientsAction: (clientName: string) => Promise<Client[]>;
}) {
  const existing = id ? invoices.find((invoice) => invoice.id === id) : undefined;
  const [gst, setGst] = useState(existing?.isGstInvoice ?? true);
  const [items, setItems] = useState(existing?.items ?? []);
  const [clientId, setClientId] = useState(existing?.clientId ?? clients[0]?.id ?? "");
  const [clientState, setClientState] = useState(
    clients.find((entry) => entry.id === (existing?.clientId ?? clients[0]?.id))?.state ?? "",
  );
  const selectedClient = clients.find((entry) => entry.id === clientId);
  const invoiceNumber =
    existing?.invoiceNumber ??
    `${organization.invoiceNumberPrefix}${String(organization.invoiceNumberCurrentSeq + 1).padStart(4, "0")}`;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const title = existing ? "Edit invoice" : "New invoice";
  const steps: StepperStep[] = [
    {
      label: "Client details",
      content: ({ onNext }) => (
        <>
          <InvoiceFormClientDetails
            {...(existing ? { invoice: existing } : {})}
            clientId={clientId}
            onClientChange={setClientId}
            onClientStateChange={setClientState}
            gst={gst}
            onGstChange={setGst}
            getClientsAction={getClientsAction}
          />
          <div className="mt-4 flex justify-end gap-2.5">
            <Button
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
              type="button"
              onClick={() => onNext?.()}
            >
              Add items
            </Button>
          </div>
        </>
      ),
    },
    {
      label: "Items",
      content: ({ onPrevious, onNext }) => (
        <InvoiceFormItemDetails
          items={items}
          onItemsChange={setItems}
          gst={gst}
          clientState={clientState}
          onClientDetails={() => onPrevious?.()}
          onPreviewInvoice={() => onNext?.()}
        />
      ),
    },
    {
      label: "Invoice preview",
      content: ({ onPrevious }) => (
        <>
          <InvoiceFormReview
            invoiceNumber={invoiceNumber}
            {...(selectedClient ? { client: selectedClient } : {})}
            items={items}
            gst={gst}
            clientState={clientState}
          />
          <div className="mt-5 flex justify-between gap-3">
            <Button
              className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-3.5 py-3 font-bold text-blue-600"
              type="button"
              onClick={() => onPrevious?.()}
            >
              Edit items
            </Button>
            <Button
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
              type="submit"
            >
              {existing ? "Update invoice" : "Create invoice"}
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <InvoiceFormHeader title={title} {...(existing ? { id: existing.id } : {})} />
      <form onSubmit={(event) => event.preventDefault()}>
        <Stepper
          steps={steps}
          currentStepIndex={currentStepIndex}
          onNext={() => setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1))}
          onPrevious={() => setCurrentStepIndex((index) => Math.max(index - 1, 0))}
        />
      </form>
    </>
  );
}
