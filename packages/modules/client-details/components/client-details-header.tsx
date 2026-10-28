"use client";

import { Client } from "@invoice-generator/types";
import { Button } from "@invoice-generator/ui/button";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";

export function ClientDetailsHeader({client}: {client: Client}) {
    return (<header className="mb-6 flex items-center justify-center gap-3">
        <Button
          icon={IconArrowLeft}
          routeUrl="/clients"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
        />
        <Button
          icon={IconEdit}
          routeUrl={`/clients/${client.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
        />
      </header>);
}