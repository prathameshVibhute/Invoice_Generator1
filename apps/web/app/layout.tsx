import "./globals.css";
import { BottomNav, PwaSetup } from "@invoice-generator/ui";
import { NextIntlClientProvider } from "next-intl";
import messages from "../messages/en.json";
export const metadata = {
  title: "InvoiceFlow",
  description: "Simple invoices for small businesses",
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="h-screen">
        <NextIntlClientProvider locale="en" messages={messages}>
          <PwaSetup />
          <div className="p-2 h-full">
            <main id="app-scroll-container" className="mx-auto h-full overflow-y-scroll w-full max-w-[430px] px-4 pb-32 pt-8 bg-surface rounded-2xl scrollbar-width:none]
              [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">{children}</main>
            <BottomNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
