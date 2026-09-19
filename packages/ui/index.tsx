"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFileInvoice, IconUsers } from "@tabler/icons-react";
export { PwaSetup } from "./pwa-setup";
export function BottomNav() { const pathname=usePathname(); if (pathname.startsWith("/login")||pathname.startsWith("/signup")) return null; const isInvoices=pathname.startsWith("/invoices"); return <nav className="nav"><Link href="/invoices" className={isInvoices?"selected":""}><IconFileInvoice className="w-5 h-5"/>Invoices</Link><Link href="/clients" className={pathname.startsWith("/clients")?"selected":""}><IconUsers className="w-5 h-5"/>Clients</Link></nav>; }
