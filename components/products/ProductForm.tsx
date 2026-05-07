"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { ProductWithCategory, Category } from "@/types";

interface ProductFormProps {
  product?: ProductWithCategory;
  categories: Category[];
  isPending: boolean;
  onSubmit: (data: ProductInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProductForm({
  product,
  categories,
  isPending,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId ?? undefined,
          imageUrl: product.imageUrl ?? "",
          isActive: product.isActive,
        }
      : {
          name: "",
          sku: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: undefined,
          imageUrl: "",
          isActive: true,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Row 1: Name + SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="e.g. Insulated Bag M" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" placeholder="e.g. BAG-INS-M" {...register("sku")} />
          {errors.sku && (
            <p className="text-xs text-red-500">{errors.sku.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price (MMK) *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-xs text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Category + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            id="categoryId"
            {...register("categoryId", {
              setValueAs: (v) => (v === "" ? null : parseInt(v, 10) || null),
            })}
          >
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="isActive">Status</Label>
          <Select id="isActive" {...register("isActive", { setValueAs: (v) => v === "true" })}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Optional product description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://..."
          {...register("imageUrl")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
