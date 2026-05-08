import type {
  Category,
  Product,
  Order,
  OrderItem,
  OrderStatus,
} from "@prisma/client";

export type { Category, Product, Order, OrderItem, OrderStatus };
export type { UpdateOrderInput } from "@/lib/validations/order";

export type ProductWithCategory = Product & {
  category: Category | null;
};

export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type OrderWithItems = Order & {
  orderItems: OrderItemWithProduct[];
};

export type CartItem = {
  product: ProductWithCategory;
  quantity: number;
  unitPrice: number;
};

export type PaginatedProducts = {
  items: ProductWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type OrderSummary = Order & {
  _count: { orderItems: number };
};

export type PaginatedOrders = {
  items: OrderSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
