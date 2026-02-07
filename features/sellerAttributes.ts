import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BrandListResponse,
  TagListResponse,
  VehicleTypeListResponse,
  VehicleModelListResponse,
  VehicleBodyTypeListResponse,
} from "@/types/vehicleattributes";

export const sellerAttributesApi = createApi({
  reducerPath: "sellerAttributesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller", // Next.js API routes
    credentials: "include", // cookies (seller_token)
  }),
  tagTypes: ["Brands", "Tags", "VehicleTypes", "VehicleModels", "VehicleBodyTypes"],
  endpoints: (builder) => ({
    /* =============================
       GET /brands
    ============================= */
    getBrands: builder.query<BrandListResponse, void>({
      query: () => ({
        url: "brands",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),

    /* =============================
       GET /tags
    ============================= */
    getTags: builder.query<TagListResponse, void>({
      query: () => ({
        url: "tags",
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    /* =============================
       GET /vehicle-attributes/types
    ============================= */
    getVehicleTypes: builder.query<VehicleTypeListResponse, void>({
      query: () => ({
        url: "vehicle-attributes/types",
        method: "GET",
      }),
      providesTags: ["VehicleTypes"],
    }),

    /* =============================
       GET /vehicle-attributes/models
    ============================= */
    getVehicleModels: builder.query<VehicleModelListResponse, void>({
      query: () => ({
        url: "vehicle-attributes/models",
        method: "GET",
      }),
      providesTags: ["VehicleModels"],
    }),

    /* =============================
       GET /vehicle-attributes/brands/{brand_id}/models
    ============================= */
    getVehicleModelsByBrand: builder.query<
      VehicleModelListResponse,
      number | string
    >({
      query: (brandId) => ({
        url: `vehicle-attributes/brands/${brandId}/models`,
        method: "GET",
      }),
      providesTags: (_r, _e, brandId) => [
        { type: "VehicleModels", id: brandId },
      ],
    }),

    /* =============================
       GET /vehicle-attributes/body-types
    ============================= */
    getVehicleBodyTypes: builder.query<VehicleBodyTypeListResponse, void>({
      query: () => ({
        url: "vehicle-attributes/body-types",
        method: "GET",
      }),
      providesTags: ["VehicleBodyTypes"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetTagsQuery,
  useGetVehicleTypesQuery,
  useGetVehicleModelsQuery,
  useGetVehicleModelsByBrandQuery,
  useGetVehicleBodyTypesQuery,
} = sellerAttributesApi;