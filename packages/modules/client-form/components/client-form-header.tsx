"use client";
import { Button } from "@invoice-generator/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FormType } from "../constants";

interface ClientFormHeader {
    formType: FormType
}

export function ClientFormHeader({formType }: ClientFormHeader) {
    const t = useTranslations("clientForm");
    return (
        <header className="page-head">
            <Button
            routeUrl="/clients"
            icon={IconArrowLeft}
            className="flex items-center rounded-xl border border-border bg-surface p-3"
            />
            <h1>{formType === FormType.Edit ? t("edit") : t("new")}</h1>
        </header>
    );
}