import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10)));

    const statusFilter =
      status === "inactive" ? { isActive: false }
      : status === "active" ? { isActive: true }
      : {};

    const searchFilter = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { sku: { contains: search, mode: "insensitive" as const } }] }
      : {};

    const where = { ...statusFilter, ...searchFilter };

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return Response.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true },
    });
    return Response.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[POST /api/products]", message);
    return Response.json({ error: "Failed to create product", detail: message }, { status: 500 });
  }
}
