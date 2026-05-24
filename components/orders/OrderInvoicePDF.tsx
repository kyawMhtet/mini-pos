import { Document, Page, Text, View, StyleSheet, Image as PDFImage } from "@react-pdf/renderer";
import type { OrderWithItems } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtCurrency(amount: number) {
  return "MMK " + new Intl.NumberFormat("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(amount));
}

const s = StyleSheet.create({
  page:        { fontFamily: "Helvetica", fontSize: 10, padding: 48, color: "#111827", backgroundColor: "#ffffff" },
  header:      { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", borderBottomStyle: "solid" },
  storeName:   { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  storeInfo:   { fontSize: 9, color: "#6b7280", marginBottom: 2 },
  invoiceLabel:{ fontSize: 8, fontWeight: "bold", color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", textAlign: "right", marginBottom: 4 },
  invoiceNum:  { fontSize: 10, fontWeight: "bold", fontFamily: "Courier", color: "#111827", textAlign: "right" },
  invoiceDate: { fontSize: 9, color: "#6b7280", textAlign: "right" },
  section:     { marginBottom: 16 },
  label:       { fontSize: 8, fontWeight: "bold", color: "#9ca3af", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  value:       { fontSize: 10, color: "#111827" },
  tableHeader: { flexDirection: "row", borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: "#111827", borderStyle: "solid", paddingVertical: 5, marginBottom: 2 },
  thText:      { fontSize: 8, fontWeight: "bold", color: "#374151", textTransform: "uppercase", letterSpacing: 0.5 },
  row:         { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f3f4f6", borderBottomStyle: "solid" },
  colItem:     { flex: 1 },
  colQty:      { width: 36, textAlign: "center" },
  colPrice:    { width: 72, textAlign: "right" },
  colAmount:   { width: 80, textAlign: "right" },
  productName: { fontSize: 10, color: "#111827", marginBottom: 2 },
  productSku:  { fontSize: 8, fontFamily: "Courier", color: "#9ca3af" },
  totalsWrap:  { alignItems: "flex-end", marginTop: 12, marginBottom: 32 },
  totalsBox:   { width: 180 },
  totalRow:    { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  totalLabel:  { fontSize: 10, color: "#6b7280" },
  totalValue:  { fontSize: 10, color: "#6b7280" },
  discLabel:   { fontSize: 10, color: "#16a34a" },
  discValue:   { fontSize: 10, color: "#16a34a" },
  grandLine:   { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1.5, borderTopColor: "#111827", borderTopStyle: "solid", paddingTop: 6, marginTop: 4 },
  grandLabel:  { fontSize: 12, fontWeight: "bold", color: "#111827" },
  grandValue:  { fontSize: 12, fontWeight: "bold", color: "#111827" },
  footer:      { borderTopWidth: 1, borderTopColor: "#e5e7eb", borderTopStyle: "solid", paddingTop: 16, textAlign: "center", fontSize: 9, color: "#9ca3af" },
  cancelBanner:{ borderWidth: 1, borderColor: "#fecaca", borderStyle: "solid", backgroundColor: "#fef2f2", borderRadius: 4, paddingVertical: 6, marginBottom: 16, alignItems: "center" },
  cancelText:  { fontSize: 11, fontWeight: "bold", color: "#dc2626", letterSpacing: 2, textTransform: "uppercase" },
  logo:        { height: 48, objectFit: "contain" },
});

export type PDFLabels = {
  invoice: string;
  billTo: string;
  note: string;
  item: string;
  qty: string;
  unitPrice: string;
  amount: string;
  subtotal: string;
  discount: string;
  total: string;
  thankYou: string;
  cancelled?: string;
  cancelledNote?: string;
  logoUrl?: string;
};

interface Props {
  order: OrderWithItems;
  labels: PDFLabels;
}

export function OrderInvoicePDF({ order, labels }: Props) {
  const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "";
  const storePhone   = process.env.NEXT_PUBLIC_STORE_PHONE   ?? "";
  const subtotal = order.orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            {labels.logoUrl
              ? <PDFImage src={labels.logoUrl} style={s.logo} />
              : <Text style={s.storeName}>Diva Delivery Bag</Text>
            }
            {storeAddress ? <Text style={s.storeInfo}>{storeAddress}</Text> : null}
            {storePhone   ? <Text style={s.storeInfo}>{storePhone}</Text>   : null}
          </View>
          <View>
            <Text style={s.invoiceLabel}>{labels.invoice}</Text>
            <Text style={s.invoiceNum}>{order.orderNumber}</Text>
            <Text style={s.invoiceDate}>{fmtDate(order.createdAt)}</Text>
          </View>
        </View>

        {labels.cancelled ? (
          <View style={s.cancelBanner}>
            <Text style={s.cancelText}>{labels.cancelled}</Text>
          </View>
        ) : null}

        {order.customerName ? (
          <View style={s.section}>
            <Text style={s.label}>{labels.billTo}</Text>
            <Text style={s.value}>{order.customerName}</Text>
          </View>
        ) : null}

        {order.note ? (
          <View style={s.section}>
            <Text style={s.label}>{labels.note}</Text>
            <Text style={s.value}>{order.note}</Text>
          </View>
        ) : null}

        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colItem]}>{labels.item}</Text>
          <Text style={[s.thText, s.colQty]}>{labels.qty}</Text>
          <Text style={[s.thText, s.colPrice]}>{labels.unitPrice}</Text>
          <Text style={[s.thText, s.colAmount]}>{labels.amount}</Text>
        </View>

        {order.orderItems.map((item) => (
          <View key={item.id} style={s.row}>
            <View style={s.colItem}>
              <Text style={s.productName}>{item.product.name}</Text>
              <Text style={s.productSku}>{item.product.sku}</Text>
            </View>
            <Text style={[{ fontSize: 10, color: "#374151" }, s.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 10, color: "#374151" }, s.colPrice]}>{fmtCurrency(item.unitPrice)}</Text>
            <Text style={[{ fontSize: 10, fontWeight: "bold", color: "#111827" }, s.colAmount]}>
              {fmtCurrency(item.unitPrice * item.quantity)}
            </Text>
          </View>
        ))}

        <View style={s.totalsWrap}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>{labels.subtotal}</Text>
              <Text style={s.totalValue}>{fmtCurrency(subtotal)}</Text>
            </View>
            {order.discount > 0 ? (
              <View style={s.totalRow}>
                <Text style={s.discLabel}>{labels.discount}</Text>
                <Text style={s.discValue}>− {fmtCurrency(order.discount)}</Text>
              </View>
            ) : null}
            <View style={s.grandLine}>
              <Text style={s.grandLabel}>{labels.total}</Text>
              <Text style={s.grandValue}>{fmtCurrency(order.total)}</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text>{labels.cancelled ? labels.cancelledNote : labels.thankYou}</Text>
        </View>
      </Page>
    </Document>
  );
}
