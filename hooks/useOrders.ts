import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedOrders, OrderWithItems } from "@/types";
import type { UpdateOrderInput } from "@/lib/validations/order";

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface OrderFilters {
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export function useOrders(filters: OrderFilters = {}) {
  const { search = "", from = "", to = "", page = 1, pageSize = 10 } = filters;
  return useQuery({
    queryKey: ["orders", search, from, to, page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) params.set("search", search);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      return apiFetch<PaginatedOrders>(`/api/orders?${params}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => apiFetch<OrderWithItems>(`/api/orders/${id}`),
    enabled: id > 0,
  });
}

export function useUpdateOrder(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrderInput) =>
      apiFetch<OrderWithItems>(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (updated) => {
      qc.setQueryData(["orders", orderId], updated);
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
