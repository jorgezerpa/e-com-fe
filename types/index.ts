// --- Types ---
export type Category = {
  id: number;
  name: string;
  colorClasses: string; // e.g., "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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
  isDisabled?: boolean;
};