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
    <header className="relative mb-6 h-10 flex items-center justify-center gap-3">
      <Button
        routeUrl="/clients"
        icon={IconArrowLeft}
        className="absolute left-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
      />
      <h1 className="text-center text-xl font-semibold">{formType === FormType.Edit ? t("edit") : t("new")}</h1>
    </header>
  );
}
