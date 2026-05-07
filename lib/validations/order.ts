import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
  discount: z.number().min(0).default(0),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, "Order must have at least one item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
