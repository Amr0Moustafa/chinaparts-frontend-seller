import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const variantsApi = createApi({
  reducerPath: "variantsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller/",
  }),
  tagTypes: ["Variants"],
  endpoints: (builder) => ({

    // GET variants
    getVariants: builder.query<
      any,
      { productId: string }
    >({
      query: ({ productId }) =>
        `products/${productId}/variants`,
      providesTags: ["Variants"],
    }),

    // GET single variant
    getVariant: builder.query<
     any,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) =>
        `products/${productId}/variants/${variantId}`,
    }),

    // CREATE
    createVariant: builder.mutation<
      any,
      { productId: string; data: any }
    >({
      query: ({ productId, data }) => ({
        url: `products/${productId}/variants`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Variants"],
    }),

    // UPDATE
    updateVariant: builder.mutation<
      any,
      { productId: string; variantId: string; data: any }
    >({
      query: ({ productId, variantId, data }) => ({
        url: `products/${productId}/variants/${variantId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Variants"],
    }),

    // DELETE
    deleteVariant: builder.mutation<
      any,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `products/${productId}/variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Variants"],
    }),

    // SET DEFAULT
    setDefaultVariant: builder.mutation<
      any,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `products/${productId}/variants/${variantId}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Variants"],
    }),

    // UPDATE STOCK
    updateVariantStock: builder.mutation<
      any,
      { productId: string; variantId: string; data: any }
    >({
      query: ({ productId, variantId, data }) => ({
        url: `products/${productId}/variants/${variantId}/stock`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Variants"],
    }),
  }),
});

export const {
  useGetVariantsQuery,
  useGetVariantQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useSetDefaultVariantMutation,
  useUpdateVariantStockMutation,
} = variantsApi;
