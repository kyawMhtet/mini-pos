import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductWithCategory, PaginatedProducts } from "@/types";

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export function useStockList(page = 1, pageSize = 20, search = "") {
  return useQuery({
    queryKey: ["stock", page, pageSize, search],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) params.set("search", search);
      return apiFetch<PaginatedProducts>(`/api/products?${params}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adjustment, note }: { id: number; adjustment: number; note?: string }) =>
      apiFetch<ProductWithCategory>(`/api/products/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment, note }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stock"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useBulkRestock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: number; stock: number }[]) =>
      apiFetch<{ updated: number }>("/api/stock/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stock"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
