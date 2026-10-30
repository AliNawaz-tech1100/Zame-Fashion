import Link from "next/link";
import { getCategories } from "@/lib/sanity/products";
import { ArrowUpRight } from "lucide-react";

export async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">Browse</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
            Shop by Category
          </h2>
          <p className="font-body text-warm-gray max-w-md mx-auto">
            Find your perfect accessory from our carefully curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-card overflow-hidden bg-cream"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-blush" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-white mb-0.5">
                      {cat.name}
                    </h3>
                    <p className="font-body text-xs text-white/70">{cat.count} items</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
