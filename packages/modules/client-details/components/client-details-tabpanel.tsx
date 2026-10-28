"use client";

import { useState } from "react";
import type { InvoiceWithClientDetails } from "@invoice-generator/types";
import { InvoiceCard } from "../../invoice-list/components/invoice-card";
import { Tabs } from "@invoice-generator/ui/tabs";

interface ClientDetailsTabPanelProps {
  invoices: InvoiceWithClientDetails[];
}

export function ClientDetailsTabPanel({ invoices }: ClientDetailsTabPanelProps) {
  const [tab, setTab] = useState("All");
  const listed = invoices.filter((invoice) =>
    tab === "All" || tab === "Paid"
      ? tab === "All" || invoice.status === "paid"
      : invoice.status !== "paid",
  );

  return (
    <>
      <div className="mt-[18px]">
        <Tabs labels={["All", "Paid", "Unpaid"]} currentTab={tab} onTabChange={setTab} />
      </div>
      <div className="grid gap-3">
        {listed.length ? (
          listed.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} />)
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            {tab === "All"
              ? "No invoices found for this client."
              : `No ${tab.toLowerCase()} invoices found.`}
          </div>
        )}
      </div>
    </>
  );
}
