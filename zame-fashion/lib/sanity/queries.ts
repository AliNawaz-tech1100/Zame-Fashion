/**
 * GROQ queries for the storefront.
 * All queries run server-side; results are mapped to the app's Product/Category types.
 */

export const productFields = /* groq */ `
  _id,
  _createdAt,
  _updatedAt,
  name,
  slug,
  shortDescription,
  description,
  price,
  originalPrice,
  sku,
  subcategory,
  tags,
  sizes,
  stock,
  availability,
  featured,
  newArrival,
  bestSeller,
  specifications,
  materials,
  careInstructions,
  shippingInfo,
  returnPolicy,
  sizeGuide,
  modelInfo,
  rating,
  reviewCount,
  seo,
  colors[]{ name, hex },
  "categorySlug": category->slug.current,
  "categoryName": category->name,
  "collectionSlug": collection->slug.current,
  "images": images[]{ _key, asset, hotspot, alt },
  "gallery": gallery[]{ _key, asset, hotspot }
`;

export const allProductsQuery = /* groq */ `*[_type == "product"] | order(_createdAt desc) {${productFields}}`;

export const productBySlugQuery = /* groq */ `*[_type == "product" && slug.current == $slug][0]{${productFields}}`;

export const productsByIdsQuery = /* groq */ `*[_type == "product" && _id in $ids]{${productFields}}`;

export const featuredProductsQuery = /* groq */ `*[_type == "product" && featured == true] | order(_createdAt desc)[0...4]{${productFields}}`;

export const newArrivalsQuery = /* groq */ `*[_type == "product" && newArrival == true] | order(_createdAt desc)[0...4]{${productFields}}`;

export const bestSellersQuery = /* groq */ `*[_type == "product" && bestSeller == true] | order(_updatedAt desc)[0...4]{${productFields}}`;

export const relatedProductsQuery = /* groq */ `*[_type == "product" && _id != $id && (category->slug.current == $category || collection->slug.current == $collection)] | order(_createdAt desc)[0...4]{${productFields}}`;

export const productSlugsQuery = /* groq */ `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`;

export const categoriesQuery = /* groq */ `*[_type == "category"] | order(sortOrder asc, name asc){
  _id,
  name,
  slug,
  description,
  image,
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

export const collectionsQuery = /* groq */ `*[_type == "collection"] | order(name asc){
  _id,
  name,
  slug,
  description,
  image
}`;

/** Full order document from the private orders dataset (server-side only). */
export const orderByIdQuery = /* groq */ `*[_type == "order" && _id == $id][0]`;

export const ordersQuery = /* groq */ `*[_type == "order"
  && (!defined($status) || orderStatus == $status)
  && (!defined($from) || _createdAt >= $from)
  && (!defined($to) || _createdAt < $to)
  && (!defined($q) || orderNumber match $q + "*" || customer.name match $q + "*" || customer.phone match $q + "*")
] | order(_createdAt desc)[0...200]{
  _id,
  orderNumber,
  orderStatus,
  paymentStatus,
  paymentMethod,
  total,
  subtotal,
  deliveryCharge,
  discount,
  "customerName": customer.name,
  "customerPhone": customer.phone,
  "itemCount": count(items),
  "notificationStatus": notification.status,
  _createdAt,
  _updatedAt
}`;
