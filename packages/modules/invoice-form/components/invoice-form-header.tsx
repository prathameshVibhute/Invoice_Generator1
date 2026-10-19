import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface InvoiceFormHeaderProps {
  title: string;
  id?: string;
}

export function InvoiceFormHeader({ title, id }: InvoiceFormHeaderProps) {
  return (
    <header className="relative mb-6 h-10 flex items-center justify-center gap-3">
      <Link
        href={id ? `/invoices/${id}` : "/invoices"}
        className="absolute left-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
      >
        <IconArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-center text-xl font-semibold">{title}</h1>
    </header>
  );
}
