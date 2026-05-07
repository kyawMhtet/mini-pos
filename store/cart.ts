import { create } from "zustand";
import type { ProductWithCategory, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  discount: number;
  customerName: string;
  note: string;
  addItem: (product: ProductWithCategory) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  setDiscount: (amount: number) => void;
  setCustomerName: (name: string) => void;
  setNote: (note: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  discount: 0,
  customerName: "",
  note: "",

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1, unitPrice: product.price }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  updateQty: (productId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: qty } : i
            ),
    })),

  setDiscount: (amount) => set({ discount: amount }),
  setCustomerName: (name) => set({ customerName: name }),
  setNote: (note) => set({ note }),
  clearCart: () => set({ items: [], discount: 0, customerName: "", note: "" }),
}));
