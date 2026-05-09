import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: raw } = await params;
  const id = parseId(raw);
  if (!id) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    return Response.json(product);
  } catch {
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id: raw } = await params;
  const id = parseId(raw);
  if (!id) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description ?? null,
        buyingPrice: data.buyingPrice,
        price: data.price,
        stock: data.stock,
        size: data.size || null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true },
    });
    return Response.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }
      if (error.code === "P2002") {
        return Response.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id: raw } = await params;
  const id = parseId(raw);
  if (!id) return Response.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
