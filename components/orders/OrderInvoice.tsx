import { formatCurrency } from "@/lib/utils";
import type { OrderWithItems } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface OrderInvoiceProps {
  order: OrderWithItems;
}

export function OrderInvoice({ order }: OrderInvoiceProps) {
  const storeName    = process.env.NEXT_PUBLIC_STORE_NAME    ?? "Mini POS";
  const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "";
  const storePhone   = process.env.NEXT_PUBLIC_STORE_PHONE   ?? "";

  const subtotal = order.orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <div className="bg-white w-full max-w-2xl mx-auto print:max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{storeName}</h2>
          {storeAddress && <p className="mt-1 text-sm text-gray-500">{storeAddress}</p>}
          {storePhone   && <p className="text-sm text-gray-500">{storePhone}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Invoice</p>
          <p className="mt-1 text-sm font-semibold text-gray-900 font-mono">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Bill to */}
      {order.customerName && (
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Bill To</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{order.customerName}</p>
        </div>
      )}

      {/* Note */}
      {order.note && (
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Note</p>
          <p className="mt-1 text-sm text-gray-600">{order.note}</p>
        </div>
      )}

      {/* Items table */}
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-y-2 border-gray-900">
            <th className="py-2 text-left text-xs font-bold uppercase tracking-wide">Item</th>
            <th className="py-2 text-center text-xs font-bold uppercase tracking-wide w-12">Qty</th>
            <th className="py-2 text-right text-xs font-bold uppercase tracking-wide w-28">Unit Price</th>
            <th className="py-2 text-right text-xs font-bold uppercase tracking-wide w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-3">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-xs font-mono text-gray-400">{item.product.sku}</p>
              </td>
              <td className="py-3 text-center text-gray-700">{item.quantity}</td>
              <td className="py-3 text-right tabular-nums text-gray-700">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 text-right tabular-nums font-semibold text-gray-900">
                {formatCurrency(item.unitPrice * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-60 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="tabular-nums">− {formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-900 pt-2 mt-1">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
        Thank you for your business!
      </div>
    </div>
  );
}
