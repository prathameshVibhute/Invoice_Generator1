import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoicePdfData } from "@invoice-generator/types/invoicePdf";

const colors = {
  primary: "#3152e7",
  text: "#1f2a4b",
  muted: "#6d7b96",
  border: "#e3e7ef",
  alternate: "#f4f6fa",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: colors.white,
    fontFamily: "Montserrat",
    color: colors.text,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 14,
    marginBottom: 16,
    borderBottom: `2 solid ${colors.primary}`,
  },
  headerTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 78,
  },
  companyBlock: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  companyRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "58%",
  },
  logo: {
    width: 245,
    height: 78,
    objectFit: "contain",
    objectPosition: "left top",
  },
  organizationDetails: {
    width: "100%",
    marginTop: 5,
  },
  organizationContactRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  organizationContactItem: {
    fontSize: 9,
    color: colors.muted,
    marginRight: 10,
    flexShrink: 1,
  },
  detailText: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.45,
    marginBottom: 3,
  },
  strongDetail: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 3,
  },
  invoiceMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    width: "38%",
    paddingTop: 2,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 10,
  },
  invoiceMetaLabel: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 8,
  },
  invoiceDate: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  parties: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 22,
  },
  clientBlock: {
    width: "62%",
  },
  supplyBlock: {
    width: "34%",
    alignItems: "flex-end",
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.muted,
    marginBottom: 5,
  },
  clientName: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  supplyState: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 5,
    textAlign: "right",
  },
  table: {
    width: "100%",
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 28,
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 30,
    paddingVertical: 9,
  },
  cell: {
    fontSize: 9,
    color: colors.text,
    paddingHorizontal: 7,
    flexShrink: 1,
  },
  headerCell: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.white,
    paddingHorizontal: 7,
    flexShrink: 1,
  },
  serialCell: { width: 28 },
  itemCell: { flex: 1, minWidth: 90 },
  itemName: { fontSize: 9, color: colors.text },
  itemDescription: { marginTop: 2, fontSize: 8, lineHeight: 1.3, color: colors.muted },
  hsnCell: { width: 52, color: colors.muted },
  qtyCell: { width: 48, textAlign: "center" },
  rateCell: { width: 64, textAlign: "right" },
  gstCell: { width: 44, textAlign: "center" },
  totalCell: { width: 92, textAlign: "right", fontWeight: 700 },
  rowDivider: {
    borderBottom: `1 solid ${colors.border}`,
  },
  totalsWrap: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
    marginTop: 10,
  },
  totalsTable: {
    width: 250,
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  totalsLabel: {
    flex: 1,
    fontSize: 9,
    color: colors.muted,
    paddingRight: 10,
  },
  subtotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  totalsValue: {
    fontSize: 9,
    color: colors.text,
    textAlign: "right",
  },
  subtotalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
    textAlign: "right",
  },
  subtotalRow: {
    borderBottom: `1 solid ${colors.border}`,
  },
  grandTotal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.primary,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.white,
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.white,
  },
  signatureSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-end",
    width: 150,
    marginTop: "auto",
    paddingTop: 30,
  },
  signatureFor: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 3,
    textAlign: "center",
  },
  stamp: {
    width: 180,
    height: 90,
    marginBottom: 3,
    objectFit: "contain",
  },
  signature: {
    width: 120,
    height: 38,
    marginBottom: 3,
    objectFit: "contain",
  },
  signatureRule: {
    width: "100%",
    borderBottom: `1 solid ${colors.border}`,
    marginTop: 2,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 9,
    color: colors.muted,
    textAlign: "center",
  },
});

export function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
  const invoiceTitle = data.isGstInvoice ? data.labels.invoice : "INVOICE";
  const organizationName = data.organization.name?.trim() || "Organization";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.companyRow}>
              {data.organization.logoDataUrl ? (
                <Image style={styles.logo} src={data.organization.logoDataUrl} />
              ) : null}
            </View>
            <View style={styles.invoiceMeta}>
              <Text style={styles.invoiceTitle}>{invoiceTitle}</Text>
              <Text style={styles.invoiceMetaLabel}>{data.labels.invoiceNumber}</Text>
              <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>
                {data.labels.invoiceDate}: {data.invoiceDate}
              </Text>
            </View>
          </View>
          <View style={[styles.companyBlock, styles.organizationDetails]}>
            <Text style={styles.detailText}>{data.organization.address}</Text>
            {data.organization.gstNo ||
            data.organization.contactDetails !== "—" ||
            data.organization.email !== "—" ? (
              <View style={styles.organizationContactRow}>
                {data.organization.gstNo ? (
                  <Text style={styles.organizationContactItem}>
                    {data.labels.gstNumber}: {data.organization.gstNo}
                  </Text>
                ) : null}
                {data.organization.contactDetails !== "—" ? (
                  <Text style={styles.organizationContactItem}>
                    {data.labels.contact}: {data.organization.contactDetails}
                  </Text>
                ) : null}
                {data.organization.email !== "—" ? (
                  <Text style={styles.organizationContactItem}>
                    {data.labels.email}: {data.organization.email}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.clientBlock}>
            <Text style={styles.sectionLabel}>
              {(data.labels.billTo ?? "Bill To").toUpperCase()}
            </Text>
            <Text style={styles.clientName}>{data.client.name}</Text>
            <Text style={styles.detailText}>{data.client.address}</Text>
            {data.client.gstNo ? (
              <Text style={styles.strongDetail}>
                {data.labels.gstNumber}: {data.client.gstNo}
              </Text>
            ) : null}
            {data.client.contactDetails !== "—" || data.client.email !== "—" ? (
              <Text style={styles.detailText}>
                {[data.client.contactDetails, data.client.email]
                  .filter((value) => value !== "—")
                  .join("  ·  ")}
              </Text>
            ) : null}
          </View>

          {data.isGstInvoice ? (
            <View style={styles.supplyBlock}>
              <Text style={styles.sectionLabel}>
                {(data.labels.placeOfSupply ?? "Place of Supply").toUpperCase()}
              </Text>
              <Text style={styles.supplyState}>{data.placeOfSupply}</Text>
              <Text style={styles.detailText}>
                {data.gstSplitType === "cgst_sgst"
                  ? data.labels.intraStateSupply
                  : data.gstSplitType === "igst"
                    ? data.labels.interStateSupply
                    : ""}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.table}>
          <View fixed style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.serialCell]}>#</Text>
            <Text style={[styles.headerCell, styles.itemCell]}>
              {(data.labels.item ?? "Item").toUpperCase()}
            </Text>
            <Text style={[styles.hsnCell, styles.headerCell]}>{data.labels.hsnSac}</Text>
            <Text style={[styles.headerCell, styles.qtyCell]}>
              {(data.labels.qty ?? "Qty").toUpperCase()}
            </Text>
            <Text style={[styles.headerCell, styles.rateCell]}>
              {(data.labels.rate ?? "Rate").toUpperCase()} (₹)
            </Text>
            {data.isGstInvoice ? (
              <Text style={[styles.headerCell, styles.gstCell]}>{data.labels.gstPercent}</Text>
            ) : null}
            <Text style={[styles.headerCell, styles.totalCell]}>
              {(data.labels.amount ?? "Amount").toUpperCase()} (₹)
            </Text>
          </View>

          {data.items.map((item, index) => (
            <View
              key={`${item.serialNo}-${item.itemName}`}
              wrap={false}
              style={[
                styles.tableRow,
                index % 2 === 1 ? { backgroundColor: colors.alternate } : {},
                index < data.items.length - 1 ? styles.rowDivider : {},
              ]}
            >
              <Text style={[styles.cell, styles.serialCell, { color: colors.muted }]}>
                {item.serialNo}
              </Text>
              <View style={[styles.cell, styles.itemCell]}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                {item.description ? (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                ) : null}
              </View>
              <Text style={[styles.cell, styles.hsnCell]}>{item.hsnSacCode}</Text>
              <Text style={[styles.cell, styles.qtyCell]}>{item.quantity}</Text>
              <Text style={[styles.cell, styles.rateCell]}>{item.rate}</Text>
              {data.isGstInvoice ? (
                <Text style={[styles.cell, styles.gstCell]}>{item.gstPercentage ?? "—"}</Text>
              ) : null}
              <Text style={[styles.cell, styles.totalCell]}>{item.total}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsWrap} wrap={false}>
          <View style={styles.totalsTable}>
            <View style={[styles.totalsRow, styles.subtotalRow]}>
              <Text style={styles.subtotalLabel}>{data.labels.subtotal}</Text>
              <Text style={styles.subtotalValue}>{data.totals.subtotal}</Text>
            </View>
            {data.taxBreakdown.map((tax, index) => (
              <View key={`${tax.taxType}-${tax.rate}-${index}`} style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  {tax.taxType} @ {tax.rate}%
                </Text>
                <Text style={styles.totalsValue}>{tax.amount}</Text>
              </View>
            ))}
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>
                {(data.labels.total ?? "Total").toUpperCase()}
              </Text>
              <Text style={styles.grandTotalValue}>{data.totals.total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection} wrap={false}>
          <Text style={styles.signatureFor}>For {organizationName.toUpperCase()}</Text>
          {data.organization.stampDataUrl ? (
            <Image style={styles.stamp} src={data.organization.stampDataUrl} />
          ) : null}
          {data.organization.signatureDataUrl ? (
            <Image style={styles.signature} src={data.organization.signatureDataUrl} />
          ) : (
            <View style={styles.signature} />
          )}
          <View style={styles.signatureRule} />
          <Text style={styles.signatureLabel}>{data.labels.authorisedSignatory}</Text>
        </View>
      </Page>
    </Document>
  );
}
