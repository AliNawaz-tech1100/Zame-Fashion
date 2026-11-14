export function generateProductMetadata(product: {
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
}) {
  return {
    title: `${product.name} | ZAMÉ Fashion`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images.slice(0, 1),
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images.slice(0, 1),
    },
    alternates: {
      canonical: `/product/${product.slug}/`,
    },
  };
}

export const siteConfig = {
  name: "ZAMÉ Fashion",
  description: "Premium imported fashion accessories — hair clips, bows, keychains & more. Shop cute, pastel, feminine accessories online in Pakistan.",
  url: "https://zamefashion.com",
  instagram: "@zame_fashion",
};
