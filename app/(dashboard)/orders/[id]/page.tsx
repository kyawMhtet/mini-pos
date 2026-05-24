"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderInvoice } from "@/components/orders/OrderInvoice";
import { OrderEditForm } from "@/components/orders/OrderEditForm";
import { PDFDownloadButton } from "@/components/orders/PDFDownloadButton";
import { useOrder, useUpdateOrder } from "@/hooks/useOrders";
import { useT } from "@/lib/i18n";
import type { OrderStatus, UpdateOrderInput } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDateTime(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useT();
  if (status === "COMPLETED") return <Badge variant="success">{t("status.completed")}</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">{t("status.cancelled")}</Badge>;
  return <Badge variant="warning">{t("status.pending")}</Badge>;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = use(params);
  const orderId = Number(raw);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "1";
  const { t } = useT();

  const { data: order, isLoading, isError } = useOrder(orderId);
  const updateOrder = useUpdateOrder(orderId);
  const hasPrinted = useRef(false);
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (shouldPrint && order && !hasPrinted.current) {
      hasPrinted.current = true;
      setTimeout(() => window.print(), 300);
    }
  }, [shouldPrint, order]);

  async function handleSave(data: UpdateOrderInput) {
    setSaveError("");
    try {
      await updateOrder.mutateAsync(data);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-400">
        <Loader2 className="mr-2 size-4 animate-spin" />
        {t("orders.loadingOrder")}
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <p className="text-sm text-red-500">{t("orders.notFound")}</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/orders")}>
          <ArrowLeft className="size-3.5" />
          {t("action.backToOrders")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => {
            if (editing) setEditing(false);
            else router.push("/orders");
          }}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {!editing && (
            <>
              <PDFDownloadButton order={order} />
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="size-3.5" />
                {t("action.print")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setSaveError(""); setEditing(true); }}>
                <Pencil className="size-3.5" />
                {t("action.edit")}
              </Button>
            </>
          )}
        </div>
      </div>

      {saveError && <p className="text-sm text-red-500 print:hidden">{saveError}</p>}

      {editing ? (
        <OrderEditForm
          order={order}
          onSave={handleSave}
          onCancel={() => { setSaveError(""); setEditing(false); }}
          isSaving={updateOrder.isPending}
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none print:p-0">
          <OrderInvoice order={order} />
        </div>
      )}
    </div>
  );
}
