// These colors mirror the app's globals.css tokens and must be updated together.
export const pdfTheme = {
  colors: {
    primary: "#1d4ed8",
    text: "#0f172a",
    muted: "#475569",
    border: "#dfe7f3",
    lightBackground: "#f8fafc",
    white: "#ffffff",
    strong: "#111827",
  },
  page: {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily: "Montserrat",
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  body: {
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.5,
  },
  metaValue: {
    fontSize: 10,
    color: "#0f172a",
    marginTop: 2,
  },
  tableHeader: {
    fontSize: 9,
    fontWeight: 700,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  tableRow: {
    fontSize: 9,
    color: "#0f172a",
  },
  totalLabel: {
    fontSize: 10,
    color: "#475569",
  },
  totalValue: {
    fontSize: 10,
    color: "#0f172a",
    textAlign: "right",
  },
  totalValueStrong: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "right",
  },
} as const;
