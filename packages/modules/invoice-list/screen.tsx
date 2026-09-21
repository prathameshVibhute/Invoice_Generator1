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
      <header className="page-head">
        <div>
          <h1>Invoices</h1>
          <div className="org-switch">
            Acme Studio · <Link href="/organization">Settings</Link>
          </div>
        </div>
        <div className="actions">
          <Button
            icon={IconSettings}
            routeUrl="/organization"
            className="flex items-center rounded-xl border border-border bg-surface p-3"
          />
          <Button
            icon={IconPlus}
            iconClassName="text-surface"
            routeUrl="/invoices/new"
            className="flex items-center rounded-xl p-3 text-surface bg-primary"
            label="Add invoice"
            labelClassName="text-surface"
          />
        </div>
      </header>
      <Calendar />
      <section className="summary">
        <div className="card">
          <strong>{invoices.length}</strong>
          <span className="muted">Total invoices</span>
        </div>
        <div className="card">
          <strong>{invoices.filter((i) => i.status === "paid").length}</strong>
          <span className="muted">Paid</span>
        </div>
        <div className="card">
          <strong>{invoices.filter((i) => i.status !== "paid").length}</strong>
          <span className="muted">Unpaid</span>
        </div>
      </section>
      <div className="tabs">
        {["all", "paid", "unpaid"].map((name) => (
          <button
            onClick={() => setTab(name)}
            className={`tab ${tab === name ? "active" : ""}`}
            key={name}
          >
            {name[0]!.toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>
      <div className="list">
        {listed.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
}
