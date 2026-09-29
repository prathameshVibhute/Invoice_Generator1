"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFileInvoice, IconUsers } from "@tabler/icons-react";
export { PwaSetup } from "../../pwa-setup";
export function BottomNav() {
  const items = [
    { href: `/invoices`, label: "Invoice", icon: IconFileInvoice },
    { href: `/clients`, label: "Clients", icon: IconUsers },
  ];

  const pathname = usePathname();
  const isInvoices = pathname === "/invoices";
  const isClients = pathname === "/clients";
  if (!isInvoices && !isClients) return null;
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-4 left-1/2 z-50 w-full max-w-[385px] -translate-x-1/2 rounded-3xl border border-border/80 bg-surface px-2 py-2 shadow-[0_-4px_24px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-center justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-28 flex-col items-center gap-1 rounded-2xl px-5 py-1.5 text-sm transition-colors ${
                isActive ? "font-bold text-text-primary" : "font-semibold text-slate-400"
              }`}
              href={href}
              key={href}
            >
              <Icon size={18} stroke={isActive ? 2.8 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
