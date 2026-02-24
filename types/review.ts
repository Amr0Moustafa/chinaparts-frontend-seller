import { PaginationMeta } from "./pagination";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  status: number;
  status_label: string;
  is_recommended: boolean;
  created_at: string;

  customer?: {
    id: number;
    name: string;
  };

  product?: {
    id: number;
    name: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  meta: PaginationMeta;
}