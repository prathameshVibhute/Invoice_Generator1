import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InvoiceFlow",
    short_name: "InvoiceFlow",
    start_url: "/invoices",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#315cf6",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
