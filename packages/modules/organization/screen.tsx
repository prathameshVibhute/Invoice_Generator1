"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import type { Organization } from "@invoice-generator/types";
import { STATE } from "@invoice-generator/types";
import { Button } from "@invoice-generator/ui/button";
import { Dropdown } from "@invoice-generator/ui/dropdown";

type OrganizationUpdates = Partial<Omit<Organization, "id" | "createdAt">>;

interface OrganizationScreenProps {
  organization: Organization;
  updateOrganizationAction: (organizationId: string, updates: OrganizationUpdates) => Promise<void>;
}

export function OrganizationScreen({
  organization,
  updateOrganizationAction,
}: OrganizationScreenProps) {
  const [values, setValues] = useState({
    name: organization.name,
    gstNumber: organization.gstNumber ?? "",
    address: organization.address,
    state: organization.state,
    country: organization.country,
    contactDetails: organization.contactDetails,
    invoicePrefix: organization.invoicePrefix,
    bankDetails: organization.bankDetails,
  });
  const [error, setError] = useState("");
  const stateOptions = STATE.map((state) => ({
    id: state.code,
    label: state.stateName,
    value: state.stateName,
  }));

  function updateField(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await updateOrganizationAction(organization.id, {
        ...values,
        gstNumber: values.gstNumber || null,
      });
    } catch (saveError) {
      console.error("Failed to update organization", saveError);
      setError("Unable to save organization changes. Please try again.");
    }
  }

  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
          href="/invoices"
        >
          <IconArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Organization</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Organization name
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              GST number
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.gstNumber}
                onChange={(event) => updateField("gstNumber", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Address
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.address}
                onChange={(event) => updateField("address", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              State
              <Dropdown
                options={stateOptions}
                value={values.state}
                onChange={(value) => updateField("state", value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Country
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.country}
                onChange={(event) => updateField("country", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Contact details
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.contactDetails}
                onChange={(event) => updateField("contactDetails", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Invoice prefix
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.invoicePrefix}
                onChange={(event) => updateField("invoicePrefix", event.target.value)}
              />
            </label>
            <label className="mb-4 grid gap-2 text-sm font-bold">
              Bank details
              <input
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"
                value={values.bankDetails}
                onChange={(event) => updateField("bankDetails", event.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-3">
            {[
              { label: "Organization logo", src: organization.logoUrl },
              { label: "Organization stamp", src: organization.stampUrl ?? null },
              { label: "Organization signature", src: organization.signatureUrl },
            ].map(({ label, src }) => (
              <div key={label} className="grid gap-2 text-sm font-bold">
                <span>{label}</span>
                <div className="flex h-24 items-center justify-center rounded-xl border border-dotted border-slate-300 p-2">
                  {src ? (
                    <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs font-normal text-slate-500">Not provided</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
          type="submit"
        >
          Save changes
        </Button>
      </form>
    </>
  );
}
