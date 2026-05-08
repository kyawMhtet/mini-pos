"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductForm } from "@/components/products/ProductForm";
import { Pagination } from "@/components/ui/pagination";
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  type ProductStatusFilter,
} from "@/hooks/useProducts";
import type { ProductInput } from "@/lib/validations/product";
import type { ProductWithCategory } from "@/types";

const STATUS_FILTERS: { label: string; value: ProductStatusFilter }[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "All", value: "all" },
];

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductWithCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("active");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useProducts(statusFilter, page, PAGE_SIZE);
  const { data: categories = [] } = useCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  function handleStatusChange(value: ProductStatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleCreate(input: ProductInput) {
    createProduct(input, { onSuccess: () => setAddOpen(false) });
  }

  function handleUpdate(input: ProductInput) {
    if (!editProduct) return;
    updateProduct(
      { id: editProduct.id, data: input },
      { onSuccess: () => setEditProduct(null) }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isLoading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="flex flex-1 sm:flex-none rounded-lg border bg-white text-sm overflow-hidden shadow-sm">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusChange(f.value)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="rounded-xl border bg-white">
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-white py-16">
          <p className="text-sm text-red-500">Failed to load products.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          <ProductTable products={products} onEdit={setEditProduct} />
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

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new product to the catalogue.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 pt-4">
            <ProductForm
              categories={categories}
              isPending={isCreating}
              onSubmit={handleCreate}
              onCancel={() => setAddOpen(false)}
              submitLabel="Create Product"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editProduct} onOpenChange={(o) => !o && setEditProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>{editProduct?.sku}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 pt-4">
            <ProductForm
              product={editProduct ?? undefined}
              categories={categories}
              isPending={isUpdating}
              onSubmit={handleUpdate}
              onCancel={() => setEditProduct(null)}
              submitLabel="Save Changes"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
