import { MetadataRoute } from "next";
import { getCategories, getProductSlugs } from "@/lib/sanity/products";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/shop/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/cart/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const [slugs, categories] = await Promise.all([getProductSlugs(), getCategories()]);

  const productPages = slugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/shop/?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
