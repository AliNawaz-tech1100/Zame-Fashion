import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "ZAMÉ Journal — Hair Accessory Styling Guides & Gift Ideas | ZAMÉ Fashion",
  description:
    "Styling guides, honest buying advice, and gift ideas for hair bows, clips, headbands, hair ties, and crochet keychains in Pakistan — from ZAMÉ Fashion.",
};

const categories = [
  "Hair Styling Guides",
  "Buying Guides",
  "Gift Ideas",
  "Kids Accessories",
  "Wedding & Party Style",
  "Care & Tips",
];

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            The ZAMÉ Journal
          </h1>
          <p className="font-body text-white/60 max-w-2xl mx-auto">
            Style is in the details — and details are what we do.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <p className="font-body text-sm leading-relaxed text-warm-gray">
            Welcome to the ZAMÉ Journal, the blog of ZAMÉ Fashion. Here we publish the guides we
            wish existed when we started: how to actually style a satin bow so it stays put all
            day, which hair accessories are worth your money in Pakistan, safe and comfortable
            clips for little girls, and gift ideas that people genuinely keep.
          </p>
          <p className="font-body text-sm leading-relaxed text-warm-gray">
            Every guide is written around real products, real Pakistani occasions — university,
            office, mehndis, birthdays, Eid — and real budgets. Where we suggest a product we
            don&apos;t stock, we say so clearly and link to a trusted retailer (those are affiliate
            links — see our{" "}
            <Link href="/affiliate-disclosure/" className="text-gold underline underline-offset-2">
              Affiliate Disclosure
            </Link>
            ). Where our own ZAMÉ piece is the best option, we link straight to our shop.
          </p>
          <p className="font-body text-sm leading-relaxed text-warm-gray">
            New guides every week. Follow along on Instagram{" "}
            <a
              href="https://instagram.com/zame_fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-2"
            >
              @zame_fashion
            </a>{" "}
            for daily styling clips.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <span
              key={cat}
              className="font-body text-xs font-medium text-charcoal bg-white border border-champagne rounded-full px-4 py-2"
            >
              {cat}
            </span>
          ))}
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.slug}/`}
            className="block bg-white rounded-card shadow-card p-6 sm:p-8 mb-10 hover:shadow-lg transition-shadow"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-gold">
              Featured · {featured.category}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal mt-3 mb-3">
              {featured.title}
            </h2>
            <p className="font-body text-sm leading-relaxed text-warm-gray max-w-3xl mb-4">
              {featured.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 font-body text-sm font-medium text-charcoal">
              Read the guide <ArrowRight className="w-4 h-4 text-gold" />
              <span className="inline-flex items-center gap-1 text-warm-gray font-normal">
                <Clock className="w-4 h-4" /> {featured.readingTime} min read
              </span>
            </span>
          </Link>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="bg-white rounded-card shadow-card p-6 flex flex-col hover:shadow-lg transition-shadow"
            >
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-gold mb-3">
                {post.category}
              </span>
              <h2 className="font-display text-xl font-semibold text-charcoal mb-3">
                {post.title}
              </h2>
              <p className="font-body text-sm leading-relaxed text-warm-gray flex-1">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 font-body text-sm font-medium text-charcoal mt-5">
                Read more <ArrowRight className="w-4 h-4 text-gold" />
                <span className="inline-flex items-center gap-1 text-warm-gray font-normal">
                  <Clock className="w-4 h-4" /> {post.readingTime} min
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="bg-charcoal rounded-card p-6 sm:p-8 mt-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Shop Best Sellers
          </h2>
          <p className="font-body text-sm text-white/60 mb-5">
            Free delivery over PKR 2,000 · COD nationwide
          </p>
          <Link
            href="/shop/?collection=best-sellers"
            className="inline-block bg-gold text-white font-body text-sm font-semibold rounded-input px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
