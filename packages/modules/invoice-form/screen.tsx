"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Client, Invoice, InvoicePayload, Organization } from "@invoice-generator/types";
import { Stepper, type StepperStep } from "@invoice-generator/ui/stepper";
import { Button } from "@invoice-generator/ui/button";
import { clients, invoices } from "../data";
import { InvoiceFormClientDetails } from "./components/invoice-form-client-details";
import { InvoiceFormHeader } from "./components/invoice-form-header";
import { InvoiceFormItemDetails } from "./components/invoice-form-item-details";
import { InvoiceFormReview } from "./components/invoice-form-review";
import { calculateInvoiceTotals, isSameState } from "./utils/gstCalculator";
import { getDefaultInvoiceDates } from "./utils/invoiceDates";

export function InvoiceFormScreen({
  id,
  organization,
  getClientsAction,
  createInvoiceAction,
}: {
  id?: string;
  organization: Organization;
  getClientsAction: (clientName: string) => Promise<Client[]>;
  createInvoiceAction?: (invoice: InvoicePayload) => Promise<Invoice>;
}) {
  const router = useRouter();
  const existing = id ? invoices.find((invoice) => invoice.id === id) : undefined;
  const [gst, setGst] = useState(existing?.isGstInvoice ?? true);
  const [items, setItems] = useState(existing?.items ?? []);
  const initialClient = clients.find((entry) => entry.id === existing?.clientId) ?? null;
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient);
  const [{ issueDate, dueDate }] = useState(getDefaultInvoiceDates);
  const clientState = selectedClient?.state ?? "";
  const invoiceNumber =
    existing?.invoiceNumber ?? `${organization?.invoicePrefix}${organization?.invoiceCount}`;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const title = existing ? "Edit invoice" : "New invoice";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClient) {
      console.error("Cannot create an invoice without a selected client.");
      return;
    }

    const gstSplitType = !gst
      ? "none"
      : isSameState(organization.state, clientState)
        ? "cgst_sgst"
        : "igst";
    const totals = calculateInvoiceTotals({ items, isGstInvoice: gst, gstSplitType });
    const invoice = {
      orgId: organization.id,
      invoiceNumber,
      issueDate,
      dueDate,
      clientId: selectedClient.id,
      clientDetails: {
        clientName: selectedClient.clientName,
        address: selectedClient.address,
        contactDetails: selectedClient.contactDetails,
        email: selectedClient.email,
        gstNumber: selectedClient.gstNumber,
        state: selectedClient.state,
        country: selectedClient.country,
      },
      isGstInvoice: gst,
      gstSplitType,
      items,
      ...totals,
    } satisfies InvoicePayload;

    if (!existing && createInvoiceAction) {
      await createInvoiceAction(invoice);
      router.push("/invoices");
      return;
    }

    console.log("Invoice payload:", invoice);
  }

  const steps: StepperStep[] = [
    {
      label: "Client details",
      content: ({ onNext }) => (
        <>
          <InvoiceFormClientDetails
            {...(existing ? { invoice: existing } : {})}
            initialClient={initialClient}
            organization={organization}
            invoiceNumber={invoiceNumber}
            issueDate={issueDate}
            dueDate={dueDate}
            onClientChange={setSelectedClient}
            gst={gst}
            onGstChange={setGst}
            getClientsAction={getClientsAction}
          />
          <div className="mt-4 flex justify-end gap-2.5">
            <Button
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-regular text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!selectedClient}
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
          organizationState={organization.state}
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
            issueDate={issueDate}
            dueDate={dueDate}
            {...(selectedClient ? { client: selectedClient } : {})}
            items={items}
            gst={gst}
            clientState={clientState}
            organizationState={organization.state}
          />
          <div className="mt-5 flex justify-between gap-3">
            <Button
              className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-3.5 py-3 font-regular text-blue-600"
              type="button"
              onClick={() => onPrevious?.()}
            >
              Edit items
            </Button>
            <Button
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3.5 py-3 font-regular text-white"
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
      <form onSubmit={handleSubmit}>
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
