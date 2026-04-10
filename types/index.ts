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