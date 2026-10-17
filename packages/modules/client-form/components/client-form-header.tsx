"use client";
import { Button } from "@invoice-generator/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FormType } from "../constants";

interface ClientFormHeader {
  formType: FormType;
}

export function ClientFormHeader({ formType }: ClientFormHeader) {
  const t = useTranslations("clientForm");
  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      <Button
        routeUrl="/clients"
        icon={IconArrowLeft}
        className="flex items-center rounded-xl border border-slate-200 bg-white p-3"
      />
      <h1 className="text-2xl font-bold">{formType === FormType.Edit ? t("edit") : t("new")}</h1>
    </header>
  );
}
