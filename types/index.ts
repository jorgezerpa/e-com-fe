import { COLOR_PRESETS } from "@/constants";

export type Category = {
  id: number;
  name: string;
  description: string;
  color: Color
};

export type ProductImage = {
  id: number;
  url: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  createdAt: string;
  updatedAt: string;
  stock: number;
  categories: Category[];
  images: ProductImage[];
  disabled?: boolean;
};


// 2. Derive the Color type from the keys of the preset
export type Color = keyof typeof COLOR_PRESETS;
// Color is now exactly: "BLUE" | "GREEN" | "PURPLE" | "ORANGE" | "RED" | "PINK"

// 3. (Optional) Enforce the interface shape
export type CategoryColorsPreset = Record<Color, string>;


///////////////////
// ORDERS
///////////////////
// --- Types (Based on Prisma Schema) ---
export enum OrderState {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  STUCK = 'STUCK',
  REFUNDED = 'REFUNDED',
}

export enum Currency {
  USD = 'USD',
  VES = 'VES',
}

export type OrderEvent = {
  id: number;
  state: OrderState;
  notes: string[]; // Format: [ISODateUTC]"reason"
  createdAt: string;
};

export type OrderItem = {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  currencyAtPurchase: Currency;
  nameAtPurchase: string;
  descriptionAtPurchase: string | null;
  skuAtPurchase: string | null;
};

export type Order = {
  id: number;
  state: OrderState;
  trackingToken: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;

  // Customer
  customer_firstName: string;
  customer_lastName: string;
  customer_whatsapp_number: string;
  customer_identification_number: string;
  customer_email: string | null;
  customer_address: string | null;

  // Shipping
  originFields: any | null;
  shipping_country: string;
  shipping_city: string;
  shipping_zipCode: string;
  shipping_name_at_purchase: string;
  shipping_description_at_purchase: string | null;
  shipping_provider_at_purchase: string;
  shipping_fields_at_purchase: any;
  shipping_fields_response: any;

  // Payment
  payment_name_at_purchase: string;
  payment_description_at_purchase: string | null;
  payment_provider_at_purchase: string;
  payment_fields_at_purchase: any;
  payment_fields_response: any;

  items: OrderItem[];
  orderEvents: OrderEvent[];
};
