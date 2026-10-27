"use client";
import { useState } from "react";
import Link from "next/link";
import { IconPlus, IconSettings } from "@tabler/icons-react";
import type { InvoiceWithClientDetails } from "@invoice-generator/types";
import { InvoiceCard } from "./components/invoice-card";
import { Button } from "@invoice-generator/ui/button";
import { Tabs } from "@invoice-generator/ui/tabs";

export function InvoiceListScreen({
  invoices,
  organizationName,
}: {
  invoices: InvoiceWithClientDetails[];
  organizationName: string;
}) {
  const [tab, setTab] = useState("All");
  const listed = invoices.filter((invoice) =>
    tab === "All" || tab === "Paid"
      ? tab === "All" || invoice.status === "paid"
      : invoice.status !== "paid",
  );
  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <div className="text-xs text-slate-500">
            {organizationName} · <Link href="/organization">Settings</Link>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button
            icon={IconSettings}
            routeUrl="/organization"
            className="flex items-center rounded-xl border border-slate-200 bg-white p-3"
            type="button"
          />
          <Button
            icon={IconPlus}
            iconClassName="text-white"
            routeUrl="/invoices/new"
            className="flex items-center rounded-xl bg-blue-600 p-3 text-white"
            label="Add invoice"
            labelClassName="text-white"
            type="button"
          />
        </div>
      </header>
      <section className="my-4 grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <strong className="mb-1 block text-xl">{invoices.length}</strong>
          <span className="text-slate-500">Total invoices</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <strong className="mb-1 block text-xl">
            {invoices.filter((i) => i.status === "paid").length}
          </strong>
          <span className="text-slate-500">Paid</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <strong className="mb-1 block text-xl">
            {invoices.filter((i) => i.status !== "paid").length}
          </strong>
          <span className="text-slate-500">Unpaid</span>
        </div>
      </section>
      <Tabs labels={["All", "Paid", "Unpaid"]} currentTab={tab} onTabChange={setTab} />
      <div className="grid gap-3">
        {listed.length > 0 ? (
          listed.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} />)
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            {tab === "All" ? "No invoices found." : `No ${tab.toLowerCase()} invoices found.`}
          </div>
        )}
      </div>
    </>
  );
}
