"use client";

import { useCallback, useState } from "react";
import type { Client, Invoice, Organization } from "@invoice-generator/types";
import { SearchSelect, type SearchSelectOption } from "@invoice-generator/ui/search-select";
import { Checkbox } from "@invoice-generator/ui/checkbox";

interface InvoiceFormClientDetailsProps {
  invoice?: Invoice;
  initialClient: Client | null;
  organization: Organization;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onClientChange: (client: Client | null) => void;
  gst: boolean;
  onGstChange: (gst: boolean) => void;
  getClientsAction: (clientName: string) => Promise<Client[]>;
}

export function InvoiceFormClientDetails({
  invoice,
  initialClient,
  organization,
  invoiceNumber,
  issueDate,
  dueDate,
  onIssueDateChange,
  onDueDateChange,
  onClientChange,
  gst,
  onGstChange,
  getClientsAction,
}: InvoiceFormClientDetailsProps) {
  const [includeSignature, setIncludeSignature] = useState(
    Boolean(invoice?.signatureUrl ?? organization.signatureUrl),
  );
  const [selectedClient, setSelectedClient] = useState<SearchSelectOption<Client> | null>(() => {
    return initialClient
      ? { value: initialClient.id, label: initialClient.clientName, data: initialClient }
      : null;
  });
  const client = selectedClient?.data;
  const searchClients = useCallback(
    async (query: string): Promise<SearchSelectOption<Client>[]> => {
      const normalizedQuery = query.trim();
      const filteredClients = await getClientsAction(normalizedQuery);

      return filteredClients.map((entry) => ({
        value: entry.id,
        label: entry.clientName,
        data: entry,
      }));
    },
    [getClientsAction],
  );

  return (
    <>
      <section aria-labelledby="client-details-heading" className="mb-5">
        <div className="mb-4 grid gap-2 text-sm font-semibold">
          <span>Client</span>
          <SearchSelect<Client>
            value={selectedClient}
            onChange={(option) => {
              setSelectedClient(option);
              onClientChange(option?.data ?? null);
            }}
            onSearch={searchClients}
            placeholder="Search client"
          />
        </div>
        {client && (
          <div className="grid grid-cols-2 gap-4 text-sm" aria-live="polite">
            <div className="min-w-0">
              <span className="mb-1 block text-sm text-slate-500">Address</span>
              <span className="block break-words">{client.address ?? "Not provided"}</span>
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-xs text-slate-500">GSTIN</span>
              <span className="block break-words">{client.gstNumber || "Not provided"}</span>
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-sm text-slate-500">Contact</span>
              <span className="block break-words">{client.contactDetails || "Not provided"}</span>
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-sm text-slate-500">Email</span>
              <span className="block break-words">{client.email || "Not provided"}</span>
            </div>
          </div>
        )}
      </section>
      <section aria-labelledby="invoice-number-heading" className="mb-5">
        <label className="mb-4 grid gap-2 text-sm font-semibold">
          Invoice number
          <input
            className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
            value={invoice?.invoiceNumber ?? invoiceNumber}
            disabled
            required
          />
        </label>
      </section>

      <section aria-labelledby="gst-heading" className="mb-5">
        <label className="mb-4 grid gap-2 text-sm font-semibold">
          <span className="flex cursor-pointer items-center gap-2 cursor-pointer">
            <Checkbox checked={gst} onChange={onGstChange} />
            Mark as GST Invoice
          </span>
        </label>
      </section>

      <section aria-labelledby="invoice-dates-heading" className="mb-5">
        <div className="grid grid-cols-2 items-start gap-3">
          <label className="mb-4 grid gap-2 text-sm font-semibold">
            Issue date
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              type="date"
              value={issueDate}
              onChange={(event) => onIssueDateChange(event.target.value)}
              disabled={!invoice}
              required
            />
          </label>
          <div>
            <label className="mb-2 grid gap-2 text-sm font-semibold">
              Due date
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
                type="date"
                value={dueDate}
                min={issueDate}
                onChange={(event) => onDueDateChange(event.target.value)}
                disabled={!invoice}
                required
              />
            </label>
            <div className="text-right text-xs text-slate-500">
              Defaults to three months after the issue date.
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="signature-heading" className="mb-5">
        <label className="mb-4 grid gap-2 text-sm font-semibold">
          <span className="flex cursor-pointer items-center gap-2">
            <Checkbox checked={includeSignature} onChange={setIncludeSignature} />
            Add signature to invoice
          </span>
        </label>
        {includeSignature && (
          <p className="text-slate-500">
            {organization.signatureUrl
              ? "Your organization signature will be included."
              : "Add a signature in organization settings to display it on the invoice."}
          </p>
        )}
      </section>
    </>
  );
}
