import { Category, CategoryResponse } from "@/types/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller/",
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    // GET /categories
    getCategories: builder.query<CategoryResponse<Category[]>, void>({
      query: () => "categories",
      providesTags: ["Categories"],
    }),

 
  }),
});


export const {
  useGetCategoriesQuery,
} = categoriesApi;
