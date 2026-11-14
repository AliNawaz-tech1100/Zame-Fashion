"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProductTabs } from "@/components/ui/ProductTabs";
import { ProductReviews } from "@/components/ui/ProductReviews";
import { ProductCard } from "@/components/sections/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { formatPrice, cn } from "@/lib/utils";
import { Product } from "@/types";
import { Heart, Truck, Shield, RotateCcw, ChevronRight, ZoomIn, X, Banknote } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  related: Product[];
}

export function ProductDetails({ product, related }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  const addItem = useCart((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem: addRecentlyViewed } = useRecentlyViewed();
  const inWishlist = isInWishlist(product.id);

  useEffect(() => {
    addRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const hasSale = product.salePrice && product.salePrice < product.price;
  const discount = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;
  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 font-body text-sm text-warm-gray flex-wrap">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/shop/" className="hover:text-charcoal transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href={`/shop/?category=${product.category}`} className="hover:text-charcoal transition-colors capitalize">{product.category.replace("-", " ")}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-charcoal truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-card overflow-hidden shadow-card group">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <button onClick={() => setZoomOpen(true)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-card hover:bg-white">
                <ZoomIn className="w-5 h-5 text-charcoal" />
              </button>
              {hasSale && (
                <div className="absolute top-4 left-4 bg-gold text-white font-body text-xs font-bold px-3 py-1.5 rounded-pill">
                  -{discount}%
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={cn("w-20 h-20 rounded-image overflow-hidden border-2 transition-colors shrink-0", selectedImage === i ? "border-gold" : "border-transparent hover:border-champagne")}>
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-2">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {hasSale && <Badge variant="sale">-{discount}%</Badge>}
              {product.newArrival && <Badge variant="new">New</Badge>}
              {product.bestSeller && <Badge variant="bestseller">Best Seller</Badge>}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="default">Only {product.stock} left</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} size="md" showValue />
              <span className="font-body text-sm text-warm-gray">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              {hasSale ? (
                <>
                  <span className="font-display text-3xl font-bold text-charcoal">{formatPrice(product.salePrice!)}</span>
                  <span className="font-body text-lg text-warm-gray line-through">{formatPrice(product.price)}</span>
                  <span className="bg-soft-pink/30 text-charcoal font-body text-xs font-semibold px-2 py-1 rounded-pill">Save {formatPrice(product.price - product.salePrice!)}</span>
                </>
              ) : (
                <span className="font-display text-3xl font-bold text-charcoal">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="font-body text-sm text-warm-gray leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <label className="font-body text-sm font-medium text-charcoal mb-2 block">
                  Color: <span className="text-warm-gray font-normal">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => setSelectedColor(color.name)}
                      className={cn("w-9 h-9 rounded-full border-2 transition-all", selectedColor === color.name ? "border-gold scale-110 shadow-sm" : "border-champagne hover:border-gold")}
                      style={{ backgroundColor: color.hex }} title={color.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm font-medium text-charcoal">
                    Size: <span className="text-warm-gray font-normal">{selectedSize}</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={cn("px-5 py-2.5 rounded-input border font-body text-sm transition-all", selectedSize === size ? "border-gold bg-gold/10 text-gold font-medium" : "border-champagne text-charcoal hover:border-gold")}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(Math.max(product.stock, 1), 20)} />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button size="lg" className="flex-1 sm:flex-none" disabled={outOfStock} onClick={() => addItem(product, quantity, selectedSize, selectedColor)}>
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button size="lg" variant="secondary" className="flex-1 sm:flex-none" disabled={outOfStock} onClick={() => { addItem(product, quantity, selectedSize, selectedColor); window.location.href = "/checkout/"; }}>
                  Buy Now
                </Button>
                <button onClick={() => toggleItem(product)}
                  className={cn("w-12 h-12 rounded-input border-2 flex items-center justify-center transition-all shrink-0", inWishlist ? "border-soft-pink bg-soft-pink/10 text-red-500" : "border-champagne text-charcoal hover:border-gold")}>
                  <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
                </button>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-cream rounded-card p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 font-body text-xs text-warm-gray">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>Free shipping on orders over <strong className="text-charcoal">PKR 2,000</strong>. Delivery in 3–5 days.</span>
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-warm-gray">
                <Banknote className="w-4 h-4 text-gold shrink-0" />
                <span><strong className="text-charcoal">Cash on Delivery</strong> available nationwide.</span>
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-warm-gray">
                <RotateCcw className="w-4 h-4 text-gold shrink-0" />
                <span><strong className="text-charcoal">7-day</strong> hassle-free returns & exchanges.</span>
              </div>
            </div>

            {/* SKU & Stock */}
            <div className="pt-4 border-t border-champagne/50 space-y-1.5 font-body text-xs text-warm-gray">
              <div className="flex justify-between">
                <span>SKU</span>
                <span className="text-charcoal font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span>Availability</span>
                <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span className="text-charcoal font-medium capitalize">{product.category.replace("-", " ")}</span>
              </div>
              {product.collection && (
                <div className="flex justify-between">
                  <span>Collection</span>
                  <span className="text-charcoal font-medium capitalize">{product.collection}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Product Reviews */}
        <ProductReviews product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-charcoal">You May Also Like</h2>
                <p className="font-body text-sm text-warm-gray mt-1">Customers who viewed this also loved these</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <img src={product.images[selectedImage]} alt={product.name} className="max-w-full max-h-[85vh] object-contain rounded-card" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
