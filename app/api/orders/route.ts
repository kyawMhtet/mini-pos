import type { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10)));

    const where: Prisma.OrderWhereInput = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        (where.createdAt as Prisma.DateTimeFilter).lte = toDate;
      }
    }

    const [items, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: { _count: { select: { orderItems: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, note, discount, paymentMethod, items } = createOrderSchema.parse(body);

    const order = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const dateKey = `${y}-${m}-${d}`;
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      // On first use each day, seed from the actual order count so existing orders aren't re-used
      const [counter] = await tx.$queryRaw<[{ value: bigint }]>`
        INSERT INTO "DailyCounter" (date, value)
        VALUES (
          ${dateKey},
          (SELECT COUNT(*) + 1 FROM "Order" WHERE "createdAt" >= ${todayStart})
        )
        ON CONFLICT (date) DO UPDATE SET value = "DailyCounter".value + 1
        RETURNING value
      `;
      const orderNumber = generateOrderNumber(Number(counter.value));

      // Validate stock
      for (const item of items) {
        const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
        if (!product.isActive) {
          throw new Error(`"${product.name}" is no longer available`);
        }
        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}" (available: ${product.stock})`
          );
        }
      }

      const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const total = Math.max(0, subtotal - discount);

      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName || null,
          note: note || null,
          discount,
          total,
          status: "COMPLETED",
          paymentMethod,
          orderItems: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
        },
        include: { orderItems: { include: { product: true } } },
      });

      // Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return Response.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[POST /api/orders]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
