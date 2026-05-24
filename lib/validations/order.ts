import { z } from "zod";

const paymentMethodSchema = z.enum(["KPAY", "KBZ_BANKING", "AYA_BANKING", "WAVE_MONEY", "CASH"]);

export const createOrderSchema = z.object({
  customerName: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
  discount: z.number().min(0).default(0),
  paymentMethod: paymentMethodSchema.default("CASH"),
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

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const updateOrderSchema = z.object({
  customerName: z.string().max(100).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  discount: z.number().min(0).optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
  paymentMethod: paymentMethodSchema.optional(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item").optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
