import Link from "next/link";
import { getFeaturedProducts } from "@/lib/sanity/products";
import { ProductCard } from "@/components/sections/ProductCard";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
  const featured = await getFeaturedProducts(4);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-2 block">Handpicked</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-2">
              Featured Picks
            </h2>
            <p className="font-body text-warm-gray">
              Our most loved accessories, handpicked for you
            </p>
          </div>
          <Link href="/shop/" className="hidden sm:flex items-center gap-1 font-body text-sm text-gold hover:text-gold-dark transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop/" className="inline-flex items-center gap-1 font-body text-sm text-gold hover:text-gold-dark transition-colors">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
