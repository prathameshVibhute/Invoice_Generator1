"use client";
import Link from "next/link";
import { IconMail, IconPhone, IconPlus, IconSettings } from "@tabler/icons-react";
import { clients, invoices } from "../data";
import { Button } from "@invoice-generator/ui/button";
import { Pagination } from "@invoice-generator/ui/pagination";
import { Avatar } from "@invoice-generator/ui/avatar";
import { Chip } from "@invoice-generator/ui/chip";

export function ClientListScreen() {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Clients</h1>
          <div className="org-switch">Acme Studio</div>
        </div>
        <div className="flex gap-2">
          <Button
            icon={IconSettings}
            routeUrl="/organization"
            className="flex items-center rounded-xl border border-border bg-surface p-3"
            type="button"
          />
          <Button
            icon={IconPlus}
            iconClassName="text-surface"
            routeUrl="/clients/new"
            className="flex items-center rounded-xl p-3 text-surface bg-primary"
            label="Add client"
            labelClassName="text-surface"
            type="button"
          />
        </div>
      </header>
      <div className="list">
        {clients.map((client) => {
          const pending = invoices.filter(
            (invoice) => invoice.clientId === client.id && invoice.status !== "paid",
          ).length;
          return (
            <Link href={`/clients/${client.id}`} className="p-4 flex flex-col rounded-xl gap-2 border border-border" key={client.id}>
              <div className="border-border flex flex-column justify-between">
                <div className="flex">
                  <Avatar label={"de"}/>
                  <div className="border-border ml-2">
                    <div className="font-semibold text-md">{client.name}</div>
                    <div className="font-regular text-xs text-muted">{client.gstNumber ?? "No GST number"}</div>
                  </div>
                </div>
                <Chip label={`${pending} pending`} color="orange" />
              </div>
              <hr className="w-full border-gray-200 my-2" />
              <div className="flex flex-col w-full gap-1">
                <div className="flex flex-row items-center justify-between w-full flex-wrap text-sm font-regular">
                  <div className="flex flex-row items-center gap-2">
                    <IconPhone className="h-5 w-5 text-muted" />
                    <span>{client.contactDetails}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2 text-sm">
                    <IconMail className="h-5 w-5 text-muted" />
                    <span>{client.email}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-2">
        <Pagination totalNumber={clients.length} />
      </div>
    </>
  );
}
