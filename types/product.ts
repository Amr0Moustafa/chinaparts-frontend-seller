export interface TopSellingProduct {
  id: string;
  title: string;
  imageUrl: string;
  sold: number;
  price: number; // in cents or dollars depending on formatting strategy
  rating: number; // 0–5
}

export type ProductStatus = "Active" | "Inactive" | "Out of Stock";

export interface Product {
  name: string;
  sku: string;
  price: string;
  stock: string;
  coupon: string;
  offer: string;
  description: string;
  imageSrc: string;
  status: ProductStatus;
}

export interface ReturnsProduct {
  name: string;
  price: number;
  image?: string;
  sku: string;
  partNumber: string;
}
export interface ProductDetailsDialogProps {
  product: Product;
}

