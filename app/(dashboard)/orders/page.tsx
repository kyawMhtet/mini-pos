"use client";

import { useState } from "react";
import { Search, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderTable } from "@/components/orders/OrderTable";
import { Pagination } from "@/components/ui/pagination";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useOrders({
    search: debouncedSearch,
    from: dateFrom,
    to: dateTo,
    page,
    pageSize: PAGE_SIZE,
  });

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleDateChange(field: "from" | "to", value: string) {
    field === "from" ? setDateFrom(value) : setDateTo(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isLoading ? "Loading…" : `${total} order${total !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search order # or customer…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="w-36 text-sm"
          />
          <span className="text-xs text-gray-400">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="w-36 text-sm"
          />
        </div>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading && (
        <div className="rounded-xl border bg-white">
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-white py-16">
          <p className="text-sm text-red-500">Failed to load orders.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          <OrderTable orders={orders} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
