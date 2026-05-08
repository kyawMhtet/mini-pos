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
import { useT } from "@/lib/i18n";
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
  submitLabel,
}: ProductFormProps) {
  const { t } = useT();
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
      : { name: "", sku: "", description: "", price: 0, stock: 0, categoryId: undefined, imageUrl: "", isActive: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t("products.nameLabel")}</Label>
          <Input id="name" placeholder={t("products.namePlaceholder")} {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sku">{t("products.skuLabel")}</Label>
          <Input id="sku" placeholder={t("products.skuPlaceholder")} {...register("sku")} />
          {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">{t("products.priceLabel")}</Label>
          <Input id="price" type="number" min={0} step={0.01} placeholder="0" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">{t("products.stockLabel")}</Label>
          <Input id="stock" type="number" min={0} step={1} placeholder="0" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">{t("products.categoryLabel")}</Label>
          <Select id="categoryId" {...register("categoryId", { setValueAs: (v) => (v === "" ? null : parseInt(v, 10) || null) })}>
            <option value="">{t("products.noCategory")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="isActive">{t("label.status")}</Label>
          <Select id="isActive" {...register("isActive", { setValueAs: (v) => v === "true" })}>
            <option value="true">{t("state.active")}</option>
            <option value="false">{t("state.inactive")}</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">{t("products.descriptionLabel")}</Label>
        <Textarea id="description" rows={3} placeholder={t("products.descriptionPlaceholder")} {...register("description")} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">{t("products.imageUrlLabel")}</Label>
        <Input id="imageUrl" type="url" placeholder={t("products.imageUrlPlaceholder")} {...register("imageUrl")} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {t("action.cancel")}
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel ?? t("action.save")}
        </Button>
      </div>
    </form>
  );
}
