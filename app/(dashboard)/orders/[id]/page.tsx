"use client";

import { use, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderInvoice } from "@/components/orders/OrderInvoice";
import { PDFDownloadButton } from "@/components/orders/PDFDownloadButton";
import { useOrder } from "@/hooks/useOrders";
import type { OrderStatus } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDateTime(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "COMPLETED") return <Badge variant="success">Completed</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">Cancelled</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = use(params);
  const orderId = Number(raw);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "1";

  const { data: order, isLoading, isError } = useOrder(orderId);
  const hasPrinted = useRef(false);

  useEffect(() => {
    if (shouldPrint && order && !hasPrinted.current) {
      hasPrinted.current = true;
      setTimeout(() => window.print(), 300);
    }
  }, [shouldPrint, order]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-400">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading order…
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <p className="text-sm text-red-500">Order not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/orders")}>
          <ArrowLeft className="size-3.5" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      {/* Action bar — screen only */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => router.push("/orders")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PDFDownloadButton order={order} />
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
        </div>
      </div>

      {/* Invoice — visible on screen and in print */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none print:p-0">
        <OrderInvoice order={order} />
      </div>
    </div>
  );
}
