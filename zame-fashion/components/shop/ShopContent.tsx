"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/sections/ProductCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SlidersHorizontal, X, ChevronDown, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, Product } from "@/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "bestseller" },
  { label: "Top Rated", value: "rating" },
];

interface ShopContentProps {
  products: Product[];
  categories: Category[];
  categoryParam: string;
  collectionParam: string;
  searchQuery: string;
  newParam: boolean;
  saleParam: boolean;
  bestsellerParam: boolean;
}

export function ShopContent({
  products,
  categories,
  categoryParam,
  collectionParam,
  searchQuery,
  newParam,
  saleParam,
  bestsellerParam,
}: ShopContentProps) {
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const allCategories = useMemo(() => {
    const fromProducts = products.map((p) => p.category).filter(Boolean);
    const merged = Array.from(new Set([...categories.map((c) => c.slug), ...fromProducts]));
    return ["all", ...merged];
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) =>
        [p.name, p.sku, p.shortDescription, p.category, ...(p.tags || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }
    if (selectedCategory !== "all") result = result.filter((p) => p.category === selectedCategory);
    if (collectionParam) result = result.filter((p) => p.collection === collectionParam);
    if (newParam) result = result.filter((p) => p.newArrival);
    if (saleParam) result = result.filter((p) => p.salePrice && p.salePrice < p.price);
    if (bestsellerParam) result = result.filter((p) => p.bestSeller);
    result = result.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case "price-desc": result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case "bestseller": result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }
    return result;
  }, [products, selectedCategory, sortBy, newParam, saleParam, bestsellerParam, priceRange, collectionParam, searchQuery]);

  const activeFiltersCount = [
    selectedCategory !== "all", newParam, saleParam, bestsellerParam, collectionParam !== "",
    priceRange[0] > 0 || priceRange[1] < 2000,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const pageTitle = saleParam ? "Sale" : newParam ? "New Arrivals" : bestsellerParam ? "Best Sellers" : collectionParam ? `${collectionParam.charAt(0).toUpperCase() + collectionParam.slice(1)} Collection` : searchQuery ? `Search: “${searchQuery}”` : "Shop All";

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-2">{pageTitle}</h1>
          <p className="font-body text-warm-gray">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={cn("lg:w-64 shrink-0", mobileFiltersOpen ? "block" : "hidden lg:block")}>
            <div className="bg-white rounded-card p-5 shadow-card space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-display text-lg font-semibold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {allCategories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={cn("block w-full text-left font-body text-sm py-1.5 px-3 rounded-lg transition-colors",
                        selectedCategory === cat ? "bg-gold/10 text-gold font-medium" : "text-warm-gray hover:text-charcoal hover:bg-cream")}>
                      {cat === "all" ? "All Products" : cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold mb-3">Price Range</h3>
                <div className="px-2">
                  <input type="range" min="0" max="2000" step="50" value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-gold" />
                  <div className="flex justify-between mt-2 font-body text-xs text-warm-gray">
                    <span>PKR {priceRange[0]}</span><span>PKR {priceRange[1]}</span>
                  </div>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={() => { setSelectedCategory("all"); setPriceRange([0, 2000]); window.history.replaceState(null, "", "/shop/"); }}
                  className="w-full py-2 text-sm font-body text-gold hover:text-gold-dark transition-colors">Clear All Filters</button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-input shadow-card font-body text-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="font-body text-sm text-warm-gray hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-champagne rounded-input pl-4 pr-10 py-2 font-body text-sm focus:outline-none focus:border-gold cursor-pointer">
                    {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-warm-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
              </div>
            ) : (
              <EmptyState
                icon={SearchX}
                title="No products found"
                description="Try adjusting your filters or browse our full collection."
                action={{ label: "View All Products", href: "/shop/" }}
                className="bg-white rounded-card shadow-card"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
