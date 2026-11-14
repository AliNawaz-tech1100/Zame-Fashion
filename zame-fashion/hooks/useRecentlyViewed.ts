"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== product.id);
          const newItems = [product, ...filtered].slice(0, 8);
          return { items: newItems };
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "zame-recently-viewed" }
  )
);
