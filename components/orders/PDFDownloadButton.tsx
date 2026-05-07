"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderWithItems } from "@/types";

interface Props {
  order: OrderWithItems;
}

export function PDFDownloadButton({ order }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const [{ pdf }, { OrderInvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./OrderInvoicePDF"),
      ]);
      const blob = await pdf(<OrderInvoicePDF order={order} />).toBlob();
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
      {isGenerating ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Download className="size-3.5" />
      )}
      {isGenerating ? "Generating…" : "Download PDF"}
    </Button>
  );
}
