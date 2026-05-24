"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/orders/ProductGrid";
import { CartPanel } from "@/components/orders/CartPanel";
import { useCartStore } from "@/store/cart";
import { useT } from "@/lib/i18n";

export default function NewOrderPage() {
  const [tab, setTab] = useState<"products" | "cart">("products");
  const totalQty = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { t } = useT();

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden lg:flex gap-6 h-full overflow-hidden">
        <div className="flex-3 min-w-0 flex flex-col overflow-hidden">
          <div className="mb-5 shrink-0">
            <h1 className="text-2xl font-semibold text-gray-900">{t("newOrder.title")}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{t("newOrder.subtitle")}</p>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <ProductGrid />
          </div>
        </div>
        <div className="w-95 shrink-0 flex flex-col overflow-hidden">
          <CartPanel />
        </div>
      </div>

      {/* Mobile: tab switcher */}
      <div className="flex flex-col h-full lg:hidden overflow-hidden">
        <div className="shrink-0 mb-3">
          <h1 className="text-lg font-semibold text-gray-900">{t("newOrder.title")}</h1>
        </div>
        <div className="flex shrink-0 rounded-lg bg-gray-100 p-1 gap-1 mb-3">
          <button
            onClick={() => setTab("products")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${tab === "products" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            {t("newOrder.productsTab")}
          </button>
          <button
            onClick={() => setTab("cart")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === "cart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            {t("newOrder.cartTab")}
            {totalQty > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {totalQty}
              </span>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {tab === "products" ? <ProductGrid /> : <CartPanel />}
        </div>
      </div>
    </>
  );
}
