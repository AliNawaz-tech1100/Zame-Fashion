import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowRight, ShoppingBag } from "lucide-react";
import { blogPosts, getBlogPost } from "@/data/blog";
import { SectionBlocks } from "@/components/content/SectionBlocks";

// TODO (Ali): Affiliate links — after Daraz Affiliate / Amazon Associates approval,
// add tracked affiliate links for the external products mentioned in each article
// (see the launch pack) and disclose them inline. Until then, articles link only
// to ZAMÉ's own shop via the "Shop similar styles" / product cards below.

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.seoTitle} | ZAMÉ Fashion`,
    description: post.metaDescription,
    keywords: [post.primaryKeyword],
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = post.relatedSlugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { "@type": "Organization", name: "ZAMÉ Fashion" },
  };

  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="bg-charcoal py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-wide text-gold">
            {post.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            {post.title}
          </h1>
          <p className="font-body text-white/60 max-w-2xl mx-auto mb-6">{post.excerpt}</p>
          <div className="flex items-center justify-center gap-6 font-body text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 28 November 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readingTime} min read
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="space-y-8">
          {post.sections.map((section) => (
            <section key={section.heading} className="bg-white rounded-card p-6 shadow-card">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-charcoal mb-4">
                {section.heading}
              </h2>
              <SectionBlocks blocks={section.blocks} />
            </section>
          ))}
        </div>

        <div className="bg-charcoal rounded-card p-6 sm:p-8 mt-10 text-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Shop the look: {post.productLink.label}
          </h2>
          <p className="font-body text-sm text-white/60 mb-5">
            Free delivery across Pakistan on orders over PKR 2,000 · COD available
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={post.productLink.href}
              className="inline-block bg-gold text-white font-body text-sm font-semibold rounded-input px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {post.productLink.label}
            </Link>
            <Link
              href="/shop/"
              className="inline-block bg-white/10 text-white font-body text-sm font-semibold rounded-input px-6 py-3 hover:bg-white/20 transition-colors"
            >
              Shop similar styles
            </Link>
          </div>
        </div>

        {post.faqs.length > 0 && (
          <section className="bg-white rounded-card p-6 shadow-card mt-10">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-charcoal mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-champagne pb-5 last:border-0 last:pb-0">
                  <h3 className="font-body text-sm font-semibold text-charcoal mb-2">
                    {faq.question}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-warm-gray">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
              Keep reading
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}/`}
                  className="bg-white rounded-card shadow-card p-6 block hover:shadow-lg transition-shadow"
                >
                  <span className="font-body text-xs font-semibold uppercase tracking-wide text-gold">
                    {rel.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-charcoal mt-2 mb-2">
                    {rel.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-warm-gray mb-4">
                    {rel.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 font-body text-sm font-medium text-charcoal">
                    Read more <ArrowRight className="w-4 h-4 text-gold" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="font-body text-xs text-warm-gray mt-10 text-center">
          Some links in our guides may be affiliate links — see our{" "}
          <Link href="/affiliate-disclosure/" className="text-gold underline underline-offset-2">
            Affiliate Disclosure
          </Link>{" "}
          and{" "}
          <Link href="/disclaimer/" className="text-gold underline underline-offset-2">
            Disclaimer
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
