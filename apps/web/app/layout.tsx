import "./globals.css";
import { BottomNav, PwaSetup } from "@invoice-generator/ui";
export const metadata = {
  title: "InvoiceFlow",
  description: "Simple invoices for small businesses",
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaSetup />
        <div className="p-2">
          <main className="mx-auto w-full h-screen overflow-y-scroll max-w-[430px] px-4 pb-32 pt-8 bg-surface rounded-2xl">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
