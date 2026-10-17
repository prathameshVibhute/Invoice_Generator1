"use client";
import { useState } from "react";
import Link from "next/link";
import { IconPlus, IconSettings } from "@tabler/icons-react";
import { invoices } from "../data";
import { Calendar, InvoiceCard } from "../shared";
import { Button } from "@invoice-generator/ui/button";

export function InvoiceListScreen() {
  const [tab, setTab] = useState("all");
  const listed = invoices.filter((invoice) =>
    tab === "all" || tab === "paid"
      ? tab === "all" || invoice.status === "paid"
      : invoice.status !== "paid",
  );
  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <div className="text-xs text-slate-500">
            Acme Studio · <Link href="/organization">Settings</Link>
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
      <Calendar />
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
      <div className="mb-4 flex gap-5 border-b border-slate-200">
        {["all", "paid", "unpaid"].map((name) => (
          <Button
            onClick={() => setTab(name)}
            className={`border-0 border-b-2 bg-transparent px-0.5 py-3 font-bold ${tab === name ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}
            key={name}
            type="button"
          >
            {name[0]!.toUpperCase() + name.slice(1)}
          </Button>
        ))}
      </div>
      <div className="grid gap-3">
        {listed.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
}
