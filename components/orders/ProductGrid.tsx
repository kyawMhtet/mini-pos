"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAllActiveProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function ProductGrid() {
  const [search, setSearch] = useState("");
  const { t } = useT();
  const { data, isLoading } = useAllActiveProducts();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const products = useMemo(() => {
    const all = data?.items ?? [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [data?.items, search]);

  function getCartQty(productId: number) {
    return cartItems.find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder={t("productGrid.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          {t("productGrid.noProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((p) => {
            const qty = getCartQty(p.id);
            const outOfStock = p.stock === 0;
            return (
              <button
                key={p.id}
                onClick={() => !outOfStock && addItem(p)}
                disabled={outOfStock}
                className={[
                  "relative flex flex-col gap-1 rounded-xl border bg-white p-4 text-left transition-all",
                  outOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-blue-300 hover:shadow-md active:scale-[0.98]",
                  qty > 0 ? "border-blue-400 ring-1 ring-blue-300" : "border-gray-200",
                ].join(" ")}
              >
                {qty > 0 && (
                  <span className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {qty}
                  </span>
                )}
                <p className="pr-6 text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{p.name}</p>
                <p className="text-[11px] font-mono text-gray-400">{p.sku}</p>
                <p className="mt-auto pt-2 text-sm font-bold text-gray-900">{formatCurrency(p.price)}</p>
                <div>
                  {outOfStock ? (
                    <Badge variant="destructive">{t("productGrid.outOfStock")}</Badge>
                  ) : p.stock < 10 ? (
                    <Badge variant="warning">{t("productGrid.lowStock")}{p.stock}</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">{p.stock} {t("productGrid.inStock")}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
