import { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/sanity/products";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse cute, pastel fashion accessories — hair clips, bows, keychains, headbands and more.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; collection?: string; new?: string; sale?: string; bestseller?: string; q?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <ShopContent
      products={products}
      categories={categories}
      categoryParam={searchParams.category || "all"}
      collectionParam={searchParams.collection || ""}
      searchQuery={searchParams.q || ""}
      newParam={searchParams.new === "true"}
      saleParam={searchParams.sale === "true"}
      bestsellerParam={searchParams.bestseller === "true"}
    />
  );
}
