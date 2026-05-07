"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import type { CreateOrderInput } from "@/lib/validations/order";
import type { Order } from "@/types";

export function CartPanel() {
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState("");

  const {
    items, discount, customerName, note,
    removeItem, updateQty, setDiscount, setCustomerName, setNote, clearCart,
  } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Failed to create order");
      }
      return res.json() as Promise<Order>;
    },
    onSuccess: (order) => {
      clearCart();
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      router.push(`/orders/${order.id}`);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create order");
    },
  });

  function handleComplete() {
    if (items.length === 0) return;
    setError("");
    createOrder({
      customerName: customerName || undefined,
      note: note || undefined,
      discount,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-gray-600" />
          <span className="font-semibold text-gray-900">Cart</span>
          {totalQty > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {totalQty}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="size-8 text-gray-200" />
            <p className="mt-3 text-sm text-gray-400">Cart is empty</p>
            <p className="text-xs text-gray-300">Click a product to add it</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice)} each</p>
                </div>
                {/* Qty stepper */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="flex size-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="flex size-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                {/* Subtotal */}
                <p className="w-20 text-right text-sm font-semibold text-gray-900 tabular-nums">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50/60 px-4 py-4 flex flex-col gap-3">
        {/* Customer + Note */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="customerName" className="text-xs text-gray-500">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Optional"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="discount" className="text-xs text-gray-500">Discount (Kyats)</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              value={discount || ""}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-1 h-8 text-sm text-right tabular-nums"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="note" className="text-xs text-gray-500">Note</Label>
          <Textarea
            id="note"
            placeholder="Optional"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 text-sm resize-none"
          />
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1.5 border-t pt-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="tabular-nums">− {formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2 mt-0.5">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0 || isPending}
          onClick={handleComplete}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Processing…" : "Complete Order"}
        </Button>
      </div>
    </div>
  );
}
