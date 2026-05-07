import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: raw } = await params;
    const id = parseInt(raw, 10);
    if (isNaN(id)) return Response.json({ error: "Invalid ID" }, { status: 400 });

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
