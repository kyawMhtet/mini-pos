import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  sku: z.string().min(1, "SKU is required").max(50),
  description: z.string().max(500).optional(),
  buyingPrice: z.number().min(0, "Buying price cannot be negative"),
  price: z.number().positive("Sell price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.number().int().positive().nullish(),
  size: z.string().max(50).optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;
