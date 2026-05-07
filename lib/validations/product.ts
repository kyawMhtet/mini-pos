import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  sku: z.string().min(1, "SKU is required").max(50),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.number().int().positive().nullish(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;
