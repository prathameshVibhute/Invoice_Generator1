"use client";

import { useCallback, useMemo, useState } from "react";
import type { Client, Invoice } from "@invoice-generator/types";
import { SearchSelect, type SearchSelectOption } from "@invoice-generator/ui/search-select";
import { clients, organization } from "../../data";

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addCalendarMonths(dateValue: string, months: number): string {
  const parts = dateValue.split("-");
  if (parts.length !== 3) {
    throw new Error(`Invalid date value: ${dateValue}`);
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (
    ![year, month, day].every(Number.isInteger) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > new Date(year, month, 0).getDate()
  ) {
    throw new Error(`Invalid date value: ${dateValue}`);
  }

  const targetMonth = month - 1 + months;
  const lastDayOfTargetMonth = new Date(year, targetMonth + 1, 0).getDate();
  return toDateInputValue(new Date(year, targetMonth, Math.min(day, lastDayOfTargetMonth)));
}

interface InvoiceFormClientDetailsProps {
  invoice?: Invoice;
  clientId: string;
  onClientChange: (clientId: string) => void;
  onClientStateChange: (state: string) => void;
  gst: boolean;
  onGstChange: (gst: boolean) => void;
  getClientsAction: (clientName: string) => Promise<Client[]>;
}

export function InvoiceFormClientDetails({
  invoice,
  clientId,
  onClientChange,
  onClientStateChange,
  gst,
  onGstChange,
  getClientsAction,
}: InvoiceFormClientDetailsProps) {
  const [issueDate] = useState(() => toDateInputValue(new Date()));
  const dueDate = addCalendarMonths(issueDate, 3);
  const [includeSignature, setIncludeSignature] = useState(
    Boolean(invoice?.signatureUrl ?? organization.signatureUrl),
  );
  const client = clients.find((entry) => entry.id === clientId);
  const [selectedClient, setSelectedClient] = useState<SearchSelectOption<Client> | null>(() => {
    const initialClient = clients.find((entry) => entry.id === clientId);
    return initialClient
      ? { value: initialClient.id, label: initialClient.clientName, data: initialClient }
      : null;
  });
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
        <h2 id="client-details-heading" className="mb-3 text-lg font-semibold">
          Client details
        </h2>
        <div className="mb-4 grid gap-2 text-sm font-bold">
          <span>Client</span>
          <SearchSelect<Client>
            value={selectedClient}
            onChange={(option) => {
              setSelectedClient(option);
              onClientChange(option?.value ?? "");
              onClientStateChange(option?.data?.state ?? "");
            }}
            onSearch={searchClients}
            placeholder="Search client"
          />
        </div>
        {client && (
          <div className="grid grid-cols-2 gap-4" aria-live="polite">
            <div>
              <span className="mb-1 block text-sm text-slate-500">Address</span>
              <strong>{client.address}</strong>
            </div>
            <div>
              <span className="mb-1 block text-sm text-slate-500">GSTIN</span>
              <strong>{client.gstNumber || "Not provided"}</strong>
            </div>
            <div>
              <span className="mb-1 block text-sm text-slate-500">Contact</span>
              <strong>{client.contactDetails || "Not provided"}</strong>
            </div>
            <div>
              <span className="mb-1 block text-sm text-slate-500">Email</span>
              <strong>{client.email || "Not provided"}</strong>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="invoice-number-heading" className="mb-5">
        <h2 id="invoice-number-heading" className="mb-3 text-lg font-semibold">
          Invoice number
        </h2>
        <label className="mb-4 grid gap-2 text-sm font-bold">
          Invoice number
          <input
            className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
            defaultValue={
              invoice?.invoiceNumber ??
              `${organization.invoiceNumberPrefix}${String(organization.invoiceNumberCurrentSeq + 1).padStart(4, "0")}`
            }
            disabled
            required
          />
        </label>
      </section>

      <section aria-labelledby="gst-heading" className="mb-5">
        <h2 id="gst-heading" className="mb-3 text-lg font-semibold">
          Invoice tax
        </h2>
        <label className="mb-4 grid gap-2 text-sm font-bold">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gst}
              onChange={(event) => onGstChange(event.target.checked)}
            />
            This is a GST invoice
          </span>
        </label>
      </section>

      <section aria-labelledby="invoice-dates-heading" className="mb-5">
        <h2 id="invoice-dates-heading" className="mb-3 text-lg font-semibold">
          Invoice dates
        </h2>
        <div className="grid grid-cols-2 items-start gap-3">
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Issue date
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              type="date"
              value={issueDate}
              disabled
              required
            />
          </label>
          <div>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Due date
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
                type="date"
                value={dueDate}
                min={issueDate}
                disabled
                required
              />
            </label>
            <div className="text-right text-slate-500">
              Defaults to two months after the issue date.
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="signature-heading" className="mb-5">
        <h2 id="signature-heading" className="mb-3 text-lg font-semibold">
          Signature
        </h2>
        <label className="mb-4 grid gap-2 text-sm font-bold">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSignature}
              onChange={(event) => setIncludeSignature(event.target.checked)}
            />
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
