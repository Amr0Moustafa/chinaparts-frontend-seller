

export type ProductStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "inactive";


/* =======================
   CATEGORY
======================= */
export interface ProductCategory {
  id: number;
  name: string;
}

/* =======================
   brand
======================= */
export interface BrandCategory {
  id: number;
  name: string;
}


/* =======================
   SELLER
======================= */
export interface ProductSeller {
  id: number;
  name: string;
  shop_name: string | null;
  image:string;
  rating:string;
  total_reviews:number;
}

/* =======================
   DIMENSIONS
======================= */
export interface ProductDimensions {
  weight: string;
  height: string;
  width: string;
  length: string;
}

/* =======================
   RATING
======================= */
export interface ProductRating {
  average: number;
  total_reviews: number;
}

/* =======================
   VARIANT ATTRIBUTES
======================= */
export interface ProductVariantAttribute {
  id: number;
  attribute_id: number;
  attribute_name: string;
  attribute_type: string;
  value: string;
}

/* =======================
   PRODUCT VARIANT
======================= */
export interface ProductVariant {
  id: number;
  variant_name: string;
  selling_price: string;
  discount_price:string;
  final_price:string;
  discount: string;
  stock_quantity: number;
  is_in_stock:boolean;
  is_default: boolean;
  attributes: ProductVariantAttribute[];
}



/* =======================
   PRODUCT (API MODEL)
======================= */
export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  sku: string;

  manufacturer_name: string | null;
  details_info: string | null;
  shipping_info: string | null;
  return_info: string | null;

  category: ProductCategory;
  seller: ProductSeller;
  brand: BrandCategory;
  dimensions: ProductDimensions;
  is_fragile: boolean;
  stock_quantity: number;
  specifications: Record<string, string>;
  rating: ProductRating;

  main_image: string;
  images: string[];
  tags: string[];
  vehicles: any[];

  variants: ProductVariant[];
  // reviews:Review[];
 average_rating: number;
  total_reviews: number;

  meta: {
    title: string | null;
    description: string | null;
  };
}

/* =======================
   PRODUCT CARD (UI MODEL)
======================= */
export interface ProductCardProps {
  id: number;
  sku: string;
  name: string;
  main_image: string;
  average_rating: number;
  total_reviews: number;
  category?: ProductCategory;
  variants?: ProductVariant;
  selling_price?: string;
  final_price?: string;
}

/* =======================
   PRODUCT PRICE
======================= */
export interface ProductPrice {
  base: string;
  discount_percentage: string;
  final: string;
}

/* =======================
   FILTERS
======================= */
export type FilterType = "hierarchical" | "checkbox" | "range" | "radio";

export interface FilterValue {
  id: number | string;
  value?: string | number | boolean;
  label?: string;
  name?: string;
  count: number;
  selected?: boolean;
}

export interface HierarchicalFilterValue {
  id: number;
  name: string;
  count: number;
  selected: boolean;
  subcategories: HierarchicalFilterValue[];
}

export interface ProductFilter {
  key: string;
  name: string;
  type: FilterType;
  multiple: boolean;

  values?: FilterValue[] | HierarchicalFilterValue[];

  min?: number;
  max?: number;
  min_key?: string;
  max_key?: string;

  attribute_id?: number;
}

export type AppliedFilters = {
  [filterKey: string]: {
    [value: string]: string;
  };
};
/* =======================
   SEARCH PARAMS
======================= */
export interface ProductFilters {
  search?: string;
  category_id?: number |null;
  brand_id?: number[];
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
  vehicle_id?: number;
  tags?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
  limit?: number;
  [attributeSlug: string]: any;
}

export interface ProductSearchParams extends ProductFilters {
  page?: number;
  limit?: number;
}

/* =======================
   API RESPONSES
======================= */
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: PaginationMeta;
  
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

/* ===============================
   CREATE / UPDATE PAYLOADS
================================ */

export interface ProductCreatePayload {
  name: string;
  sku: string;
  description?: string;
  details_info?: string;
  category_id: number;
  subcategory_id?: number | null;
  price?: number;
  priority?: number;
}

export interface ProductUpdatePayload {
  name?: string;
  sku?: string;
  description?: string;
  details_info?: string;
  category_id?: number;
  subcategory_id?: number | null;
  price?: number;
  priority?: number;
  status?: ProductStatus;
}


/* ===============================
   ATTRIBUTES
================================ */

export type AttributeType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "boolean"
  | "date";

export interface ProductAttributeOption {
  id: number;
  label: string;
  value: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  type: AttributeType;
  required: boolean;
  options?: ProductAttributeOption[];
}

export interface ProductAttributesResponse {
  data: ProductAttribute[];
}


 export type SidebarFilterType =
  | "checkbox"
  | "range"
  | "rating"
  | "toggle"
  | "color_swatch";

export interface SubCategory {
  id: number;
  name: string;
  count: number;
  selected?: boolean;
  subcategories?: SubCategory[];
}

export interface SideFilterValue {
  id: number;
  value?: string | number | boolean;
  label?: string;
  name?: string;
  count: number;
  selected?: boolean;
  subcategories?: SubCategory[];
}

export interface FilterDataItem {
  key: string;
  name: string;
  type: SidebarFilterType;
  multiple: boolean;
  is_attribute: boolean;
  is_hierarchical?: boolean;

  attribute_id?: number;
  attribute_type?: string;

  min?: number;
  max?: number;
  min_key?: string;
  max_key?: string;

  values?: SideFilterValue[];
}


export interface FilterResponse {
  data: FilterDataItem[];
}



 export interface FilterItem {
  key: string;
  name: string;
  type: SidebarFilterType;
  min?: number;
  max?: number;
  values: SideFilterValue[];
}


