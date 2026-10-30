import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/sanity/products";
import { ProductDetails } from "@/components/product/ProductDetails";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.slice(0, 60).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const description = product.shortDescription || product.description.slice(0, 160);
  return {
    title: product.name,
    description,
    keywords: product.tags,
    openGraph: {
      title: product.name,
      description,
      images: product.images.slice(0, 1),
      type: "website",
    },
    alternates: {
      canonical: `/product/${product.slug}/`,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return <ProductDetails product={product} related={related} />;
}
