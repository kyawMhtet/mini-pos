"use client";

import { ProductGrid } from "@/components/orders/ProductGrid";
import { CartPanel } from "@/components/orders/CartPanel";

export default function NewOrderPage() {
  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left: Product Grid — scrolls independently */}
      <div className="flex-3 min-w-0 flex flex-col overflow-hidden">
        <div className="mb-5 shrink-0">
          <h1 className="text-2xl font-semibold text-gray-900">New Order</h1>
          <p className="mt-0.5 text-sm text-gray-500">Select products to add to the cart</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <ProductGrid />
        </div>
      </div>

      {/* Right: Cart — fills height, scrolls independently */}
      <div className="w-95 shrink-0 flex flex-col overflow-hidden">
        <CartPanel />
      </div>
    </div>
  );
}
