import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface QualityType {
  id: number;
  name: string;
  slug: string;
  description: string;
  description_ar: string;
  sort_order: number;
  warranty_min_days: number;
  warranty_max_days: number;
}

export interface QualityTypeResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const qualityTypesApi = createApi({
  reducerPath: "qualityTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller/",
  }),
  tagTypes: ["QualityTypes"],
  endpoints: (builder) => ({
    // GET /quality-types
    getQualityTypes: builder.query<QualityTypeResponse<QualityType[]>, void>({
      query: () => "quality-types",
      providesTags: ["QualityTypes"],
    }),
  }),
});

export const { useGetQualityTypesQuery } = qualityTypesApi;