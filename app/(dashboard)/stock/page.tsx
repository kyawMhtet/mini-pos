"use client";

import { useState, useRef } from "react";
import { AlertTriangle, Check, Loader2, PackagePlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { RestockAllDialog } from "@/components/stock/RestockAllDialog";
import { useStockList, useAdjustStock } from "@/hooks/useStock";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProductWithCategory } from "@/types";

const LOW_STOCK = 10;
const PAGE_SIZE = 15;

function StockCell({ product }: { product: ProductWithCategory }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: adjust, isPending } = useAdjustStock();

  function startEdit() {
    setValue(String(product.stock));
    setError("");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancel() {
    setEditing(false);
    setError("");
  }

  function save() {
    const newStock = parseInt(value, 10);
    if (isNaN(newStock) || newStock < 0) { setError("Invalid"); return; }
    const adjustment = newStock - product.stock;
    if (adjustment === 0) { setEditing(false); return; }

    adjust(
      { id: product.id, adjustment },
      {
        onSuccess: () => setEditing(false),
        onError: (err) => setError(err instanceof Error ? err.message : "Failed"),
      }
    );
  }

  const isLow = product.stock < LOW_STOCK;

  if (editing) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Input
          ref={inputRef}
          type="number"
          min={0}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          className={`h-7 w-20 text-sm text-right tabular-nums ${error ? "border-red-400" : ""}`}
        />
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-gray-400 shrink-0" />
        ) : (
          <>
            <button onClick={save} className="text-green-600 hover:text-green-700 shrink-0">
              <Check className="size-4" />
            </button>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X className="size-4" />
            </button>
          </>
        )}
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={startEdit}
      className={`tabular-nums font-semibold text-sm px-2 py-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer ${
        isLow ? "text-red-600" : "text-gray-900"
      }`}
      title="Click to adjust stock"
    >
      {product.stock}
    </button>
  );
}

export default function StockPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [restockOpen, setRestockOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useStockList(page, PAGE_SIZE, debouncedSearch);

  const products = data?.items ?? [];
  const lowStockProducts = products.filter((p) => p.stock < LOW_STOCK);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Stock</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? "Loading…" : `${data?.total ?? 0} product${(data?.total ?? 0) !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setRestockOpen(true)} disabled={isLoading || (data?.total ?? 0) === 0}>
          <PackagePlus className="size-4" />
          Restock All
        </Button>
      </div>

      {!isLoading && lowStockProducts.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">
              {lowStockProducts.length} product{lowStockProducts.length !== 1 ? "s" : ""} low on stock
            </span>
            <span className="text-amber-600">
              {" — "}
              {lowStockProducts.map((p) => p.name).join(", ")}
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {isError ? (
          <p className="px-5 py-8 text-center text-sm text-red-500">Failed to load stock data.</p>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-gray-300" />
          </div>
        ) : products.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            {search ? "No products match your search." : "No products found."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full min-w-120 text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      product.stock < LOW_STOCK ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-5 py-3 text-xs text-gray-400 tabular-nums">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {product.category?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {product.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StockCell product={product} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {(data?.totalPages ?? 1) > 1 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <Pagination
                  page={page}
                  totalPages={data!.totalPages}
                  total={data!.total}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <RestockAllDialog
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        products={products}
      />
    </div>
  );
}
