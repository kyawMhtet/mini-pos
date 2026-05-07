import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkSchema = z.object({
  items: z
    .array(z.object({ id: z.number().int().positive(), stock: z.number().int().min(0) }))
    .min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = bulkSchema.parse(body);

    await prisma.$transaction(
      items.map(({ id, stock }) => prisma.product.update({ where: { id }, data: { stock } }))
    );

    return Response.json({ updated: items.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed" }, { status: 400 });
    }
    return Response.json({ error: "Failed to bulk update stock" }, { status: 500 });
  }
}
