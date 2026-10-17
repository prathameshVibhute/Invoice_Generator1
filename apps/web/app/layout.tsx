import "./globals.css";
import { BottomNav, PwaSetup } from "@invoice-generator/ui";
import { NextIntlClientProvider } from "next-intl";
import { Montserrat } from "next/font/google";
import messages from "../messages/en.json";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "InvoiceFlow",
  description: "Simple invoices for small businesses",
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="m-0 h-screen bg-slate-100 font-sans text-slate-900">
        <NextIntlClientProvider locale="en" messages={messages}>
          <PwaSetup />
          <div className="h-full p-2">
            <main
              id="app-scroll-container"
              className="mx-auto h-full w-full max-w-[430px] overflow-y-scroll rounded-2xl bg-white px-4 pb-32 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {children}
            </main>
            <BottomNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
