import "./globals.css";
import { BottomNav, PwaSetup } from "@invoice-generator/ui";
export const metadata = { title: "InvoiceFlow", description: "Simple invoices for small businesses", manifest: "/manifest.webmanifest" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><PwaSetup /><main className="shell">{children}</main><BottomNav /></body></html>; }
