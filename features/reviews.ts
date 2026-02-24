import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReviewsResponse } from "@/types/review";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller",
    credentials: "include",
  }),
  tagTypes: ["Reviews"],

  endpoints: (builder) => ({
    getReviews: builder.query<
      ReviewsResponse,
      {
        page?: number;
        per_page?: number;
        search?: string;
        product_id?: number;
        rating?: number;
        status?: number;
        is_recommended?: boolean;
        sort_by?: string;
        sort_order?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/reviews",
        params,
      }),
      providesTags: ["Reviews"],
    }),
  }),
});

export const { useGetReviewsQuery } = reviewsApi;