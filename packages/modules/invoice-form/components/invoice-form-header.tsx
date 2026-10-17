import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface InvoiceFormHeaderProps {
  title: string;
  id?: string;
}

export function InvoiceFormHeader({ title, id }: InvoiceFormHeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      <Link
        href={id ? `/invoices/${id}` : "/invoices"}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
      >
        <IconArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
