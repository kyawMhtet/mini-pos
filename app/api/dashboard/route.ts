import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    const daysToMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedOnly = (gte: Date) => ({
      createdAt: { gte },
      status: "COMPLETED" as const,
    });

    const [
      todayAgg, weekAgg, monthAgg,
      topProductsRaw, recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({ where: completedOnly(todayStart), _sum: { total: true }, _count: true }),
      prisma.order.aggregate({ where: completedOnly(weekStart),  _sum: { total: true }, _count: true }),
      prisma.order.aggregate({ where: completedOnly(monthStart), _sum: { total: true }, _count: true }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: { order: completedOnly(monthStart) },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { orderItems: true } } },
      }),
    ]);

    const productIds = topProductsRaw.map(
  (t: { productId: string }) => t.productId
);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
const nameById = Object.fromEntries(
  products.map((p: { id: string; name: string }) => [p.id, p.name])
);

const topProducts = topProductsRaw.map(
  (t: {
    productId: string;
    _sum: { quantity: number | null };
  }) => ({
    name: nameById[t.productId] ?? "Unknown",
    qtySold: t._sum.quantity ?? 0,
  })
);

    return Response.json({
      todayRevenue: todayAgg._sum.total ?? 0,
      todayOrders:  todayAgg._count,
      weekRevenue:  weekAgg._sum.total ?? 0,
      weekOrders:   weekAgg._count,
      monthRevenue: monthAgg._sum.total ?? 0,
      monthOrders:  monthAgg._count,
      topProducts,
      recentOrders,
    });
  } catch {
    return Response.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
