"use client";

import { Package } from "lucide-react";
import { useT } from "@/lib/i18n";

interface Props {
  products: { name: string; qtySold: number }[];
}

export function TopProducts({ products }: Props) {
  const { t } = useT();
  const max = products[0]?.qtySold ?? 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{t("dashboard.topProducts")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t("dashboard.topProductsSubtitle")}</p>
      </div>

      {products.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-400">{t("dashboard.noSalesThisMonth")}</p>
      ) : (
        <div className="flex flex-col gap-0 divide-y divide-gray-100">
          {products.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 px-5 py-3.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(p.qtySold / max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Package className="size-3 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 tabular-nums">{p.qtySold}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
