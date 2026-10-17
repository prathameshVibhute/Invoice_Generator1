import Link from "next/link";
import { IconMail, IconMailPlus, IconPhone, IconPhonePlus } from "@tabler/icons-react";
import { Avatar } from "@invoice-generator/ui/avatar";
import { Chip } from "@invoice-generator/ui/chip";
import type { Client } from "@invoice-generator/types";
import { useTranslations } from "next-intl";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  const t = useTranslations("clientList");
  const pending = client.pendingInvoiceCount;
  const avatarLabel = client.clientName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("");

  return (
    <article
      className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
      key={client.id}
    >
      <div className="flex items-start justify-between gap-3">
        <Link href={`/clients/${client.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar label={avatarLabel} />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{client.clientName}</div>
            <div className="truncate text-sm text-slate-500">
              {client.gstNumber || t("noGstLabel")}
            </div>
          </div>
        </Link>
        <Chip
          label={`${pending} ${t("pendingInvoiceCountChipLabel")}`}
          color="orange"
          className="max-w-[45%] shrink-0 whitespace-normal text-center leading-tight"
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm">
        {client.contactDetails ? (
          <div className="flex min-w-0 items-center gap-2 text-slate-500">
            <IconPhone className="h-5 w-5 shrink-0" />
            <span className="min-w-0 break-all">{client.contactDetails}</span>
          </div>
        ) : (
          <Link href={`/clients/${client.id}/edit`} className="flex items-center gap-2 font-normal">
            <IconPhonePlus className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-blue-600">{t("addPhoneNumberLabel")}</span>
          </Link>
        )}
        {client.email ? (
          <div className="flex min-w-0 items-center gap-2 text-slate-500">
            <IconMail className="h-5 w-5 shrink-0" />
            <span className="min-w-0 break-all">{client.email}</span>
          </div>
        ) : (
          <Link
            href={`/clients/${client.id}/edit`}
            className="flex items-center gap-2 font-normal text-blue-600"
          >
            <IconMailPlus className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="text-blue-600">{t("addEmailIdLabel")}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
