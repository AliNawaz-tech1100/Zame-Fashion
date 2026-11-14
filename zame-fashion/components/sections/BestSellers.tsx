import Link from "next/link";
import { getBestSellers } from "@/lib/sanity/products";
import { ProductCard } from "@/components/sections/ProductCard";
import { ArrowRight, TrendingUp } from "lucide-react";

export async function BestSellers() {
  const bestsellers = await getBestSellers(4);

  if (bestsellers.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-blush/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-1 block">Trending Now</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">
                Best Sellers
              </h2>
              <p className="font-body text-sm text-warm-gray mt-1">Our most-loved pieces.</p>
            </div>
          </div>
          <Link href="/shop/?bestseller=true" className="hidden sm:flex items-center gap-1 font-body text-sm text-gold hover:text-gold-dark transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
