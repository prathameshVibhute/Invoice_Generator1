"use client";

import { IconPlus, IconSettings } from "@tabler/icons-react";
import { Button } from "@invoice-generator/ui/button";

export function ClientListHeader() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <div className="text-xs text-slate-500">Acme Studio</div>
        </div>
        <div className="flex gap-2">
          <Button
            icon={IconSettings}
            routeUrl="/organization"
            className="flex items-center rounded-xl border border-slate-200 bg-white p-3"
            type="button"
          />
          <Button
            icon={IconPlus}
            iconClassName="text-white"
            routeUrl="/clients/new"
            className="flex items-center rounded-xl bg-blue-600 p-3 text-white"
            label="Add client"
            labelClassName="text-white"
            type="button"
          />
        </div>
      </header>
    </>
  );
}
