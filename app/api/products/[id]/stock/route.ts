import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const adjustSchema = z.object({
  adjustment: z.number().int(),
  note: z.string().max(200).optional(),
});

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id: raw } = await params;
  const id = parseId(raw);
  if (!id) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    const body = await request.json();
    const { adjustment } = adjustSchema.parse(body);

    if (adjustment === 0) {
      return Response.json({ error: "Adjustment must be non-zero" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id }, select: { stock: true } });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });

    const newStock = product.stock + adjustment;
    if (newStock < 0) {
      return Response.json({ error: "Stock cannot go below zero" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: { category: true },
    });
    return Response.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
    }
    return Response.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
