"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import type { OrderWithItems } from "@/types";
import type { PDFLabels } from "./OrderInvoicePDF";

interface Props {
  order: OrderWithItems;
}

export function PDFDownloadButton({ order }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useT();

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const [{ pdf }, { OrderInvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./OrderInvoicePDF"),
      ]);

      const isCancelled = order.status === "CANCELLED";
      const labels: PDFLabels = {
        invoice: t("invoice.title"),
        billTo:  t("invoice.billTo"),
        note:    t("label.note"),
        item:    t("label.item"),
        qty:     t("label.qty"),
        unitPrice: t("label.unitPrice"),
        amount:  t("label.amount"),
        subtotal: t("label.subtotal"),
        discount: t("label.discountLine"),
        total:   t("label.total"),
        thankYou: t("invoice.thankYou"),
        logoUrl: window.location.origin + "/Diva.jpg",
        ...(isCancelled && {
          cancelled: t("invoice.cancelled"),
          cancelledNote: t("invoice.cancelledNote"),
        }),
      };

      const blob = await pdf(<OrderInvoicePDF order={order} labels={labels} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${order.orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
      {isGenerating ? t("state.generating") : t("action.downloadPdf")}
    </Button>
  );
}
