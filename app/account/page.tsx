"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/sections/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, Package, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "orders" | "wishlist";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("wishlist");
  const { items: wishlistItems } = useWishlist();

  return (
    <div className="min-h-screen bg-cream py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-8">My Account</h1>
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <nav className="p-2">
                {[
                  { id: "profile" as Tab, label: "Profile", icon: User },
                  { id: "orders" as Tab, label: "Orders", icon: Package },
                  { id: "wishlist" as Tab, label: "Wishlist", icon: Heart, badge: wishlistItems.length },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors", activeTab === tab.id ? "bg-gold/10 text-gold font-medium" : "text-warm-gray hover:text-charcoal hover:bg-cream")}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                    {tab.badge ? <span className="ml-auto bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{tab.badge}</span> : null}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {activeTab === "wishlist" && (
              <div>
                <h2 className="font-display text-xl font-semibold text-charcoal mb-6">My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {wishlistItems.map((product) => (<ProductCard key={product.id} product={product} />))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Heart}
                    title="Your Wishlist is Empty"
                    description="Save your favorite items here for later"
                    action={{ label: "Explore Products", href: "/shop/" }}
                    className="bg-white rounded-card shadow-card"
                  />
                )}
              </div>
            )}
            {activeTab === "profile" && (
              <div className="bg-white rounded-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-6">Profile</h2>
                <div className="space-y-4">
                  <p className="font-body text-sm text-warm-gray">Account system ready for integration.</p>
                  <p className="font-body text-sm text-warm-gray">Connect your authentication provider (Auth.js, Clerk, Firebase, etc.) to enable login, registration, and profile management.</p>
                </div>
              </div>
            )}
            {activeTab === "orders" && (
              <div className="bg-white rounded-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-6">Order History</h2>
                <EmptyState
                  icon={ShoppingBag}
                  title="No Orders Yet"
                  description="Your order history will appear here after your first purchase."
                  action={{ label: "Start Shopping", href: "/shop/" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
