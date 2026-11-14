import Link from "next/link";
import { getNewArrivals } from "@/lib/sanity/products";
import { ProductCard } from "@/components/sections/ProductCard";
import { ArrowRight } from "lucide-react";

export async function NewArrivals() {
  const newProducts = await getNewArrivals(4);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-2 block">Just Dropped</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">
              New Arrivals
            </h2>
            <p className="font-body text-sm text-warm-gray mt-1">Fresh styles, just added.</p>
          </div>
          <Link href="/shop/?new=true" className="hidden sm:flex items-center gap-1 font-body text-sm text-gold hover:text-gold-dark transition-colors">
            See All New <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
