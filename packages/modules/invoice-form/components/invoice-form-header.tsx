import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@invoice-generator/ui/button";

interface InvoiceFormHeaderProps {
  title: string;
  id?: string;
}

export function InvoiceFormHeader({ title, id }: InvoiceFormHeaderProps) {
  return (
    <header className="relative mb-6 h-10 flex items-center justify-center gap-3">
      <Button
        routeUrl={id ? `/invoices/${id}` : "/invoices"}
        icon={IconArrowLeft}
        className="absolute left-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
      />
      <h1 className="text-center text-xl font-semibold">{title}</h1>
    </header>
  );
}
