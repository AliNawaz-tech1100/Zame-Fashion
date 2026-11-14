"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, selectedSize, selectedColor) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === selectedSize &&
              i.selectedColor === selectedColor
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity, selectedSize, selectedColor }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.product.id !== productId)
            : state.items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
              ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.product.salePrice || i.product.price) * i.quantity,
          0
        ),
    }),
    { name: "zame-cart" }
  )
);
