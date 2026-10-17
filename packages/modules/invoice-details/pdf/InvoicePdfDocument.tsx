import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoicePdfData } from "@invoice-generator/types/invoicePdf";
import { pdfTheme } from "./pdfTheme";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#ffffff",
    fontFamily: "NotoSans",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1 solid #dfe7f3",
  },
  companyBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: "55%",
  },
  companyRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 6,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 3,
  },
  detailText: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.4,
  },
  invoiceMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 160,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  invoiceMetaLine: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  section: {
    marginBottom: 18,
    border: "1 solid #dfe7f3",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  table: {
    marginTop: 2,
    border: "1 solid #dfe7f3",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottom: "1 solid #dfe7f3",
    minHeight: 28,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 28,
    borderBottom: "1 solid #dfe7f3",
    paddingTop: 8,
    paddingBottom: 8,
  },
  cell: {
    fontSize: 9,
    color: "#0f172a",
    paddingHorizontal: 8,
    flexShrink: 1,
  },
  headerCell: {
    fontSize: 9,
    color: "#0f172a",
    paddingHorizontal: 8,
    fontWeight: 700,
    flexShrink: 1,
  },
  serialCell: { width: 28 },
  itemCell: { flex: 2.2 },
  hsnCell: { width: 66 },
  qtyCell: { width: 48 },
  rateCell: { width: 62 },
  gstCell: { width: 52 },
  totalCell: { width: 72, textAlign: "right" },
  totalsWrap: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 16,
    width: "100%",
  },
  totalsTable: {
    width: 220,
    border: "1 solid #dfe7f3",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalsTotal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1 solid #dfe7f3",
    paddingTop: 8,
    marginTop: 8,
  },
  signatureSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 10,
  },
  signature: {
    width: 120,
    height: 40,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#475569",
  },
});

export function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <View style={styles.companyRow}>
              {data.organization.logoDataUrl ? (
                <Image style={styles.logo} src={data.organization.logoDataUrl} />
              ) : null}
              <Text style={styles.companyName}>{data.organization.name}</Text>
            </View>
            <Text style={styles.detailText}>{data.organization.address}</Text>
            {data.organization.gstNo ? (
              <Text style={styles.detailText}>{data.labels.gstNumber}: {data.organization.gstNo}</Text>
            ) : null}
            <Text style={styles.detailText}>{data.organization.contactDetails}</Text>
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>{data.labels.invoice}</Text>
            <Text style={styles.invoiceMetaLine}>{data.labels.invoiceNumber}: {data.invoiceNumber}</Text>
            <Text style={styles.invoiceMetaLine}>{data.labels.invoiceDate}: {data.invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{data.labels.billTo}</Text>
          <Text style={styles.clientName}>{data.client.name}</Text>
          <Text style={styles.detailText}>{data.client.address}</Text>
          {data.client.gstNo ? (
            <Text style={styles.detailText}>{data.labels.gstNumber}: {data.client.gstNo}</Text>
          ) : null}
          {data.client.contactDetails !== "—" ? (
            <Text style={styles.detailText}>{data.labels.contact}: {data.client.contactDetails}</Text>
          ) : null}
          {data.client.email !== "—" ? (
            <Text style={styles.detailText}>{data.labels.email}: {data.client.email}</Text>
          ) : null}
        </View>

        <View style={styles.table}>
          <View fixed style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.serialCell]}>{"#"}</Text>
            <Text style={[styles.headerCell, styles.itemCell]}>{data.labels.item}</Text>
            <Text style={[styles.headerCell, styles.hsnCell]}>{data.labels.hsnSac}</Text>
            <Text style={[styles.headerCell, styles.qtyCell]}>{data.labels.qty}</Text>
            <Text style={[styles.headerCell, styles.rateCell]}>{data.labels.rate}</Text>
            {data.isGstInvoice ? (
              <Text style={[styles.headerCell, styles.gstCell]}>{data.labels.gstPercent}</Text>
            ) : null}
            <Text style={[styles.headerCell, styles.totalCell]}>{data.labels.amount}</Text>
          </View>

          {data.items.map((item) => (
            <View key={`${item.serialNo}-${item.itemName}`} wrap={false} style={styles.tableRow}>
              <Text style={[styles.cell, styles.serialCell]}>{item.serialNo}</Text>
              <Text style={[styles.cell, styles.itemCell]}>{item.itemName}</Text>
              <Text style={[styles.cell, styles.hsnCell]}>{item.hsnSacCode}</Text>
              <Text style={[styles.cell, styles.qtyCell]}>{item.quantity}</Text>
              <Text style={[styles.cell, styles.rateCell]}>{item.rate}</Text>
              {data.isGstInvoice ? (
                <Text style={[styles.cell, styles.gstCell]}>{item.gstPercentage ?? "-"}</Text>
              ) : null}
              <Text style={[styles.cell, styles.totalCell]}>{item.total}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsWrap} wrap={false}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={pdfTheme.totalLabel}>{data.labels.subtotal}</Text>
              <Text style={pdfTheme.totalValue}>{data.totals.subtotal}</Text>
            </View>
            {data.gstSplitType === "cgst_sgst" && data.totals.cgst && data.totals.sgst ? (
              <>
                <View style={styles.totalsRow}>
                  <Text style={pdfTheme.totalLabel}>{data.labels.cgst}</Text>
                  <Text style={pdfTheme.totalValue}>{data.totals.cgst}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={pdfTheme.totalLabel}>{data.labels.sgst}</Text>
                  <Text style={pdfTheme.totalValue}>{data.totals.sgst}</Text>
                </View>
              </>
            ) : null}
            {data.gstSplitType === "igst" && data.totals.igst ? (
              <View style={styles.totalsRow}>
                <Text style={pdfTheme.totalLabel}>{data.labels.igst}</Text>
                <Text style={pdfTheme.totalValue}>{data.totals.igst}</Text>
              </View>
            ) : null}
            <View style={styles.totalsTotal}>
              <Text style={pdfTheme.totalLabel}>{data.labels.total}</Text>
              <Text style={pdfTheme.totalValueStrong}>{data.totals.total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection} wrap={false}>
          {data.organization.signatureDataUrl ? (
            <Image style={styles.signature} src={data.organization.signatureDataUrl} />
          ) : null}
          <Text style={styles.detailText}>{data.organization.name}</Text>
        </View>

        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${data.labels.page} ${pageNumber} ${data.labels.of} ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
