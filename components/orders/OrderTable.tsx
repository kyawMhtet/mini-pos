"use client";

import Link from "next/link";
import { Eye, Printer, ClipboardX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { OrderSummary, OrderStatus } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(date: string | Date) {
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "COMPLETED") return <Badge variant="success">Completed</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">Cancelled</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

interface OrderTableProps {
  orders: OrderSummary[];
}

export function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-gray-100">
          <ClipboardX className="size-6 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-700">No orders found</p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Order #</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
            <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Items</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
            <th className="w-24 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
            <th className="w-24 px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => (
            <tr key={o.id} className="transition-colors hover:bg-blue-50/40">
              <td className="px-5 py-4">
                <span className="font-mono text-xs font-semibold text-gray-900">{o.orderNumber}</span>
              </td>
              <td className="px-5 py-4 text-gray-700">
                {o.customerName ?? <span className="text-gray-400 italic">—</span>}
              </td>
              <td className="px-5 py-4 text-center">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {o._count.orderItems}
                </span>
              </td>
              <td className="px-5 py-4 text-right font-semibold text-gray-900 tabular-nums">
                {formatCurrency(o.total)}
              </td>
              <td className="px-5 py-4">
                <p className="text-gray-700">{formatDate(o.createdAt)}</p>
                <p className="text-xs text-gray-400">{formatTime(o.createdAt)}</p>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/orders/${o.id}`}>
                    <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                      <Eye className="size-3.5" />
                      <span className="sr-only">View</span>
                    </Button>
                  </Link>
                  <Link href={`/orders/${o.id}?print=1`} target="_blank">
                    <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <Printer className="size-3.5" />
                      <span className="sr-only">Print</span>
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
