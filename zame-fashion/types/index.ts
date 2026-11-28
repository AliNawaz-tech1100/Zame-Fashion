export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSize {
  name: string;
  inStock: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  collection: string;
  tags: string[];
  colors?: ProductColor[];
  sizes?: string[];
  stock: number;
  specifications?: ProductSpecification[];
  materials?: string;
  careInstructions?: string[];
  shippingInfo?: string;
  returnPolicy?: string;
  sizeGuide?: { label: string; measurements: string }[];
  modelInfo?: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type NotificationStatus = "pending" | "sent" | "failed" | "skipped";

export interface Order {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    instructions?: string;
    notes?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "cod";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Checkout / Order API types ─────────────────────────────────────
export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrderCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  instructions?: string;
  notes?: string;
}

export interface CreateOrderInput {
  idempotencyKey: string;
  items: CreateOrderItemInput[];
  customer: CreateOrderCustomerInput;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
}

export interface CreateOrderResponse {
  ok: boolean;
  token?: string;
  orderNumber?: string;
  totals?: OrderTotals;
  notificationStatus?: NotificationStatus;
  duplicate?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/** Order summary shown on the admin orders list. */
export interface AdminOrderListItem {
  _id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "cod";
  total: number;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  customerName: string;
  customerPhone: string;
  itemCount: number;
  itemNames?: string[];
  notificationStatus?: NotificationStatus;
  _createdAt: string;
  _updatedAt: string;
}

/** Full order document as stored in the private Sanity orders dataset. */
export interface OrderDocument {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  orderNumber: string;
  idempotencyKey?: string;
  customer: CreateOrderCustomerInput;
  items: Array<{
    _key?: string;
    productName: string;
    productSlug?: string;
    productId?: string;
    sku?: string;
    image?: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: "cod";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  stockDeductionStatus?: "pending" | "done" | "failed";
  notification?: {
    status?: NotificationStatus;
    messageId?: string;
    error?: string;
    attempts?: number;
    lastAttemptAt?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  count: number;
}

export interface PromoBannerData {
  id: string;
  desktopImage: string;
  mobileImage: string;
  heading: string;
  description: string;
  cta: string;
  ctaLink: string;
  badge?: string;
  align: "left" | "center" | "right";
  overlay: "dark" | "light" | "none";
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  author: string;
  location?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
  avatar?: string;
}

export interface BrandValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}
