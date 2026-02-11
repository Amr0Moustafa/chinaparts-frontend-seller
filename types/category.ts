import { PaginationMeta } from "./pagination";

export interface Category {
  id: number;
  name: string;
  slug: string;
  attributes: CategoryAttribute[];
  sub_categories: Category[];
}

export interface CategoryAttribute {
  id: number;
  name: string;
  values: AttributeValue[];
}


export interface AttributeValue {
  id: number;
  value: string;
}


export interface CategoryResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?:PaginationMeta;
}