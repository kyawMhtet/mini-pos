import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductWithCategory, PaginatedProducts, Category } from "@/types";
import type { ProductInput } from "@/lib/validations/product";

const KEYS = {
  products: ["products"] as const,
  product: (id: number) => ["products", id] as const,
  categories: ["categories"] as const,
};

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type ProductStatusFilter = "active" | "inactive" | "all";

export function useProducts(status: ProductStatusFilter = "active", page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...KEYS.products, status, page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (status !== "all") params.set("status", status);
      return apiFetch<PaginatedProducts>(`/api/products?${params}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: KEYS.product(id),
    queryFn: () => apiFetch<ProductWithCategory>(`/api/products/${id}`),
    enabled: id > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: KEYS.categories,
    queryFn: () => apiFetch<Category[]>("/api/categories"),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInput) =>
      apiFetch<ProductWithCategory>("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductInput }) =>
      apiFetch<ProductWithCategory>(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.products });
      qc.invalidateQueries({ queryKey: KEYS.product(id) });
    },
  });
}

export function useAllActiveProducts() {
  return useQuery({
    queryKey: ["products", "active", "all"],
    queryFn: () =>
      apiFetch<PaginatedProducts>(`/api/products?status=active&page=1&pageSize=500`),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.products }),
  });
}
