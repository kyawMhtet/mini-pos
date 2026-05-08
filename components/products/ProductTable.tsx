"use client";

import { useState } from "react";
import { Pencil, Trash2, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface ProductTableProps {
  products: ProductWithCategory[];
  onEdit: (product: ProductWithCategory) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { t } = useT();

  function handleDelete(id: number) {
    deleteProduct(id, { onSuccess: () => setConfirmId(null) });
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-gray-100">
          <PackageX className="size-6 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-700">{t("products.noProductsFound")}</p>
        <p className="mt-1 text-xs text-gray-400">{t("products.noProductsHint")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.product")}</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.sku")}</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.priceKyats")}</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.stock")}</th>
              <th className="w-24 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.status")}</th>
              <th className="w-24 px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-blue-50/40">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {[p.category?.name, p.size].filter(Boolean).join(" · ")}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <code className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-600">
                    {p.sku}
                  </code>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-gray-900">{formatCurrency(p.price)}</td>
                <td className="px-5 py-4 text-right">
                  <span className={
                    p.stock === 0
                      ? "inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-200"
                      : p.stock < 10
                      ? "inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-200"
                      : "text-sm font-medium text-gray-700"
                  }>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {p.isActive
                    ? <Badge variant="success">{t("state.active")}</Badge>
                    : <Badge variant="secondary">{t("state.inactive")}</Badge>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:bg-blue-50 hover:text-blue-600" onClick={() => onEdit(p)}>
                      <Pencil className="size-3.5" />
                      <span className="sr-only">{t("action.edit")}</span>
                    </Button>

                    {confirmId === p.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => handleDelete(p.id)} disabled={isDeleting}>
                          {isDeleting ? "…" : t("action.confirm")}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setConfirmId(null)}>
                          {t("action.cancel")}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:bg-red-50 hover:text-red-500" onClick={() => setConfirmId(p.id)}>
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">{t("action.delete")}</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
