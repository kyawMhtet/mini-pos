"use client";

import { useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useAllActiveProducts } from "@/hooks/useProducts";
import { useT } from "@/lib/i18n";
import type { OrderWithItems, OrderStatus, PaymentMethod } from "@/types";
import type { UpdateOrderInput } from "@/lib/validations/order";

type EditItem = {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
};

interface Props {
  order: OrderWithItems;
  onSave: (data: UpdateOrderInput) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function OrderEditForm({ order, onSave, onCancel, isSaving }: Props) {
  const { t } = useT();
  const [customerName, setCustomerName] = useState(order.customerName ?? "");
  const [note, setNote] = useState(order.note ?? "");
  const [discount, setDiscount] = useState(String(order.discount));
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(order.paymentMethod);
  const [items, setItems] = useState<EditItem[]>(
    order.orderItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      sku: i.product.sku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }))
  );
  const [addProductId, setAddProductId] = useState("");
  const [error, setError] = useState("");

  const { data: productsData } = useAllActiveProducts();
  const allProducts = productsData?.items ?? [];

  const discountNum = Math.max(0, parseFloat(discount) || 0);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = Math.max(0, subtotal - discountNum);

  function updateQty(idx: number, raw: string) {
    const qty = Math.max(1, parseInt(raw, 10) || 1);
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: qty } : it)));
  }

  function updatePrice(idx: number, raw: string) {
    const price = Math.max(0, parseFloat(raw) || 0);
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, unitPrice: price } : it)));
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function addProduct() {
    if (!addProductId) return;
    const product = allProducts.find((p) => p.id === Number(addProductId));
    if (!product) return;

    const existing = items.findIndex((i) => i.productId === product.id);
    if (existing >= 0) {
      setItems((prev) => prev.map((it, i) => (i === existing ? { ...it, quantity: it.quantity + 1 } : it)));
    } else {
      setItems((prev) => [...prev, { productId: product.id, productName: product.name, sku: product.sku, quantity: 1, unitPrice: product.price }]);
    }
    setAddProductId("");
  }

  function handleSubmit() {
    setError("");
    if (items.length === 0) { setError(t("orders.mustHaveItem")); return; }
    onSave({
      customerName: customerName.trim() || null,
      note: note.trim() || null,
      discount: discountNum,
      status,
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
    });
  }

  const availableToAdd = allProducts.filter((p) => !items.some((i) => i.productId === p.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{t("orders.orderDetailsSection")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">{t("label.customerName")}</Label>
            <Input id="customerName" placeholder={t("state.optional")} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">{t("label.status")}</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
              <option value="PENDING">{t("status.pending")}</option>
              <option value="COMPLETED">{t("status.completed")}</option>
              <option value="CANCELLED">{t("status.cancelled")}</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount">{t("label.discount")}</Label>
            <Input id="discount" type="number" min="0" step="1" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="paymentMethod">{t("payment.label")}</Label>
            <Select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
              <option value="CASH">{t("payment.cash")}</option>
              <option value="KPAY">{t("payment.kpay")}</option>
              <option value="KBZ_BANKING">{t("payment.kbzBanking")}</option>
              <option value="AYA_BANKING">{t("payment.ayaBanking")}</option>
              <option value="WAVE_MONEY">{t("payment.waveMoney")}</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <Label htmlFor="note">{t("label.note")}</Label>
            <Textarea id="note" placeholder={t("state.optional")} rows={1} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{t("orders.itemsSection")}</h2>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-y-2 border-gray-900">
              <th className="py-2 text-left text-xs font-bold uppercase tracking-wide">{t("table.product")}</th>
              <th className="py-2 text-center text-xs font-bold uppercase tracking-wide w-28">{t("label.qty")}</th>
              <th className="py-2 text-right text-xs font-bold uppercase tracking-wide w-32">{t("label.unitPrice")}</th>
              <th className="py-2 text-right text-xs font-bold uppercase tracking-wide w-28">{t("label.amount")}</th>
              <th className="py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.productId} className="border-b border-gray-100">
                <td className="py-2">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs font-mono text-gray-400">{item.sku}</p>
                </td>
                <td className="py-2 text-center">
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(idx, e.target.value)} className="w-20 mx-auto text-center h-8 text-sm" />
                </td>
                <td className="py-2 text-right">
                  <Input type="number" min="0" step="1" value={item.unitPrice} onChange={(e) => updatePrice(idx, e.target.value)} className="w-28 ml-auto text-right h-8 text-sm" />
                </td>
                <td className="py-2 text-right tabular-nums font-semibold text-gray-900">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </td>
                <td className="py-2 text-right">
                  <Button variant="ghost" size="icon" className="size-7 text-gray-400 hover:text-red-500" onClick={() => removeItem(idx)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Select value={addProductId} onChange={(e) => setAddProductId(e.target.value)} className="flex-1 h-8 text-sm">
            <option value="">{t("orders.addProductPlaceholder")}</option>
            {availableToAdd.map((p) => (
              <option key={p.id} value={String(p.id)}>{p.name} — {formatCurrency(p.price)}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm" className="h-8" onClick={addProduct} disabled={!addProductId}>
            <Plus className="size-3.5" />
            {t("action.add")}
          </Button>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-56 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>{t("label.subtotal")}</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discountNum > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t("label.discountLine")}</span>
                <span className="tabular-nums">− {formatCurrency(discountNum)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-900 pt-2 mt-1">
              <span>{t("label.total")}</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>{t("action.cancel")}</Button>
        <Button onClick={handleSubmit} disabled={isSaving || items.length === 0}>
          {isSaving && <Loader2 className="size-3.5 animate-spin" />}
          {t("action.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
