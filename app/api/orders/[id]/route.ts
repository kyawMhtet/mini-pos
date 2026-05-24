import type { NextRequest } from "next/server";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { updateOrderSchema } from "@/lib/validations/order";

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = parseId((await params).id);
    if (!id) return Response.json({ error: "Invalid ID" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
      },
    });

    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
    return Response.json(order);
  } catch {
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const id = parseId((await params).id);
  if (!id) return Response.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await request.json();
    const data = updateOrderSchema.parse(body);

    // Read existing order outside the transaction to reduce time spent inside it
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!existing) return Response.json({ error: "Order not found" }, { status: 404 });

    const wasActive = existing.status !== "CANCELLED";
    const newStatus = data.status ?? existing.status;
    const willBeActive = newStatus !== "CANCELLED";

    const finalItems = data.items ?? existing.orderItems.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));

    const oldDeductions = new Map<number, number>();
    if (wasActive) {
      for (const item of existing.orderItems) {
        oldDeductions.set(item.productId, (oldDeductions.get(item.productId) ?? 0) + item.quantity);
      }
    }

    const newDeductions = new Map<number, number>();
    if (willBeActive) {
      for (const item of finalItems) {
        newDeductions.set(item.productId, (newDeductions.get(item.productId) ?? 0) + item.quantity);
      }
    }

    const allProductIds = new Set([...oldDeductions.keys(), ...newDeductions.keys()]);
    const deltas = new Map<number, number>();
    for (const productId of allProductIds) {
      const delta = (oldDeductions.get(productId) ?? 0) - (newDeductions.get(productId) ?? 0);
      if (delta !== 0) deltas.set(productId, delta);
    }

    // Validate stock for products that need more than they currently have
    const productIdsNeedingMore = [...deltas.entries()]
      .filter(([, delta]) => delta < 0)
      .map(([id]) => id);

    if (productIdsNeedingMore.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIdsNeedingMore } },
        select: { id: true, name: true, stock: true },
      });
      for (const product of products) {
        const delta = deltas.get(product.id)!;
        if (product.stock < -delta) {
          return Response.json(
            { error: `Insufficient stock for "${product.name}" (available: ${product.stock}, need ${-delta} more)` },
            { status: 422 }
          );
        }
      }
    }

    const discount = data.discount ?? existing.discount;
    const subtotal = finalItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total = Math.max(0, subtotal - discount);

    const order = await prisma.$transaction(async (tx) => {
      // Apply stock deltas
      for (const [productId, delta] of deltas) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { increment: delta } },
        });
      }

      if (data.items) {
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: data.items.map((i) => ({
            orderId: id,
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        });
      }

      return tx.order.update({
        where: { id },
        data: {
          ...(data.customerName !== undefined && { customerName: data.customerName || null }),
          ...(data.note !== undefined && { note: data.note || null }),
          ...(data.discount !== undefined && { discount: data.discount }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
          total,
        },
        include: {
          orderItems: {
            include: { product: { select: { id: true, name: true, sku: true } } },
          },
        },
      });
    });

    return Response.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[PUT /api/orders/:id]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
