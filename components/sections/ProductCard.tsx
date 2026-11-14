"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discount = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div className={cn("group", className)}>
      <div className="relative bg-white rounded-card overflow-hidden shadow-card group-hover:shadow-hover transition-shadow duration-300">
        {/* Image */}
        <Link href={`/product/${product.slug}/`} className="block relative aspect-square overflow-hidden bg-cream">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasSale && <Badge variant="sale">-{discount}%</Badge>}
            {product.newArrival && !hasSale && <Badge variant="new">New</Badge>}
            {product.bestSeller && <Badge variant="bestseller">Best Seller</Badge>}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product);
            }}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
              inWishlist
                ? "bg-soft-pink text-red-500"
                : "bg-white/80 backdrop-blur-sm text-charcoal hover:bg-white"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
          </button>
          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-charcoal text-white py-2.5 rounded-input font-body text-sm font-medium flex items-center justify-center gap-2 hover:bg-charcoal/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Quick Add
            </button>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4">
          <Link href={`/product/${product.slug}/`}>
            <h3 className="font-body text-sm font-medium text-charcoal mb-1 line-clamp-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="font-body text-sm font-semibold text-charcoal">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="font-body text-xs text-warm-gray line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-body text-sm font-semibold text-charcoal">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-champagne/60"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-warm-gray font-body">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
