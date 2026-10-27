"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type {
  Client,
  Invoice,
  InvoicePayload,
  InvoiceWithClientDetails,
  Organization,
} from "@invoice-generator/types";
import { Stepper, type StepperStep } from "@invoice-generator/ui/stepper";
import { Button } from "@invoice-generator/ui/button";
import { InvoiceFormClientDetails } from "./components/invoice-form-client-details";
import { InvoiceFormHeader } from "./components/invoice-form-header";
import { InvoiceFormItemDetails } from "./components/invoice-form-item-details";
import { InvoiceFormReview } from "./components/invoice-form-review";
import { calculateInvoiceTotals, isSameState } from "./utils/gstCalculator";
import { getDefaultInvoiceDates } from "./utils/invoiceDates";

export function InvoiceFormScreen({
  invoice,
  initialClient,
  organization,
  getClientsAction,
  createInvoiceAction,
  updateInvoiceAction,
}: {
  invoice?: InvoiceWithClientDetails;
  initialClient?: Client | null;
  organization: Organization;
  getClientsAction: (clientName: string) => Promise<Client[]>;
  createInvoiceAction?: (invoice: InvoicePayload) => Promise<Invoice>;
  updateInvoiceAction?: (invoiceId: string, invoice: InvoicePayload) => Promise<void>;
}) {
  const router = useRouter();
  const [gst, setGst] = useState(invoice?.isGstInvoice ?? true);
  const [items, setItems] = useState(invoice?.items ?? []);
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient ?? null);
  const [defaultDates] = useState(getDefaultInvoiceDates);
  const [issueDate, setIssueDate] = useState(invoice?.issueDate ?? defaultDates.issueDate);
  const [dueDate, setDueDate] = useState(invoice?.dueDate ?? defaultDates.dueDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const clientState = selectedClient?.state ?? "";
  const invoiceNumber =
    invoice?.invoiceNumber ?? `${organization.invoicePrefix}${organization.invoiceCount}`;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const title = invoice ? "Edit invoice" : "New invoice";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClient) {
      setSubmitError("Select a client before saving the invoice.");
      return;
    }

    const gstSplitType = !gst
      ? "none"
      : isSameState(organization.state, clientState)
        ? "cgst_sgst"
        : "igst";
    const totals = calculateInvoiceTotals({ items, isGstInvoice: gst, gstSplitType });
    const invoicePayload = {
      orgId: organization.id,
      invoiceNumber,
      issueDate,
      dueDate,
      clientId: selectedClient.id,
      clientName: selectedClient.clientName,
      gstNumber: selectedClient.gstNumber || "",
      isGstInvoice: gst,
      gstSplitType,
      items,
      ...totals,
    } satisfies InvoicePayload;

    try {
      setSubmitError(null);
      setIsSubmitting(true);
      if (invoice) {
        if (!updateInvoiceAction) {
          throw new Error("Invoice update is not available.");
        }
        await updateInvoiceAction(invoice.id, invoicePayload);
        router.push(`/invoices/${invoice.id}`);
      } else {
        if (!createInvoiceAction) {
          throw new Error("Invoice creation is not available.");
        }
        await createInvoiceAction(invoicePayload);
        router.push("/invoices");
      }
    } catch (error) {
      console.error("Unable to save invoice.", error);
      setSubmitError(error instanceof Error ? error.message : "Unable to save invoice.");
      setIsSubmitting(false);
    }
  }

  const steps: StepperStep[] = [
    {
      label: "Client details",
      content: ({ onNext }) => (
        <>
          <InvoiceFormClientDetails
            {...(invoice ? { invoice } : {})}
            initialClient={initialClient ?? null}
            organization={organization}
            invoiceNumber={invoiceNumber}
            issueDate={issueDate}
            dueDate={dueDate}
            onIssueDateChange={setIssueDate}
            onDueDateChange={setDueDate}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : invoice ? "Update invoice" : "Create invoice"}
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <InvoiceFormHeader title={title} {...(invoice ? { id: invoice.id } : {})} />
      <form onSubmit={handleSubmit}>
        {submitError ? (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {submitError}
          </p>
        ) : null}
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
