import Link from "next/link";
import { IconMail, IconMailPlus, IconPhone, IconPhonePlus } from "@tabler/icons-react";
import { Avatar } from "@invoice-generator/ui/avatar";
import { Chip } from "@invoice-generator/ui/chip";
import type { Client } from "@invoice-generator/types";
import { useTranslations } from "next-intl";

interface ClientCardProps {
    client: Client
}

export function ClientCard({client}: ClientCardProps) {
    const t = useTranslations("clientList");
    const pending = client.pendingInvoiceCount;
    const avatarLabel = client.clientName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((namePart) => namePart[0])
        .join("");

    return (
        <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4" key={client.id}>
            <div className="flex items-center justify-between gap-3">
                <Link href={`/clients/${client.id}`} className="flex min-w-0 items-center gap-3">
                    <Avatar label={avatarLabel} />
                    <div className="min-w-0">
                        <div className="truncate font-semibold text-md">{client.clientName}</div>
                        <div className="text-sm text-muted">{client.gstNumber || t("noGstLabel")}</div>
                    </div>
                </Link>
                <Chip label={`${pending} ${t("pendingInvoiceCountChipLabel")}`} color="orange" />
            </div>
            <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
                {client.contactDetails ? (
                    <div className="flex items-center gap-2 text-muted">
                        <IconPhone className="h-5 w-5 shrink-0" />
                        <span>{client.contactDetails}</span>
                    </div>
                ) : (
                    <Link href={`/clients/${client.id}/edit`} className="flex items-center gap-2 font-regular">
                        <IconPhonePlus className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-primary">{t("addPhoneNumberLabel")}</span>
                    </Link>
                )}
                {client.email ? (
                    <div className="flex items-center gap-2 text-muted">
                        <IconMail className="h-5 w-5 shrink-0" />
                        <span>{client.email}</span>
                    </div>
                ) : (
                    <Link href={`/clients/${client.id}/edit`} className="flex items-center gap-2 font-regular text-primary">
                        <IconMailPlus className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-primary">{t("addEmailIdLabel")}</span>
                    </Link>
                )}
            </div>
        </article>
    );
}