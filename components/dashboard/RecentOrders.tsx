"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import type { OrderSummary, OrderStatus } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useT();
  if (status === "COMPLETED") return <Badge variant="success">{t("status.completed")}</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">{t("status.cancelled")}</Badge>;
  return <Badge variant="warning">{t("status.pending")}</Badge>;
}

interface Props {
  orders: OrderSummary[];
}

export function RecentOrders({ orders }: Props) {
  const { t, plural } = useT();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{t("dashboard.recentOrders")}</h2>
        <Link href="/orders" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          {t("action.viewAll")} <ArrowRight className="size-3" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-400">{t("dashboard.noOrdersYet")}</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-semibold text-gray-900">{o.orderNumber}</p>
                <p className="text-xs text-gray-400 truncate">
                  {o.customerName ?? "—"} · {plural(o._count.orderItems, "unit.item", "unit.items")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(o.total)}</p>
                <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
              </div>
              <StatusBadge status={o.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
