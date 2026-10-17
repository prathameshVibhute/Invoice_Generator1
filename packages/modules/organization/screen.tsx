import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { organization } from "../data";
import { Button } from "@invoice-generator/ui/button";
export function OrganizationScreen() {
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
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Organization name
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.name}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            GST number
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.gstNumber ?? ""}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Address
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.address}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            State
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.state}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Country
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.country}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Contact details
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.contactDetails}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Invoice prefix
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.invoiceNumberPrefix}
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Bank details
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              defaultValue={organization.bankDetails}
            />
          </label>
        </div>
      </section>
      <Button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white">
        Save changes
      </Button>
    </>
  );
}
