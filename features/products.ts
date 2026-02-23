import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  ProductListResponse,
  ProductResponse,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductAttributesResponse,
  GetProductsParams,
} from "@/types/product";

export const sellerProductsApi = createApi({
  reducerPath: "sellerProductsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller",
    credentials: "include",
  }),
  tagTypes: ["Products", "Product", "Attributes"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, GetProductsParams>({
      query: (params) => ({
        url: "products",
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query<ProductResponse, number | string>({
      query: (id) => `products/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<ProductResponse, ProductCreatePayload | FormData>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
        ...(body instanceof FormData && { formData: true }),
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<  
      ProductResponse,
      { id: number | string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
        ...(data instanceof FormData && { formData: true }),
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        "Products",
      ],
    }),

    updateProductWithFiles: builder.mutation<  
      ProductResponse,
      { id: number | string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `products/${id}`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, number | string>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    updateProductStep: builder.mutation<  
      ProductResponse,
      { id: number | string; step: number }
    >({
      query: ({ id, step }) => ({
        url: `products/${id}/step`,
        method: "PATCH",
        body: { step },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
    }),

    updateProductStatus: builder.mutation<  
      ProductResponse,
      { id: number | string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `products/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
    }),

    getProductAttributes: builder.query<  
      ProductAttributesResponse,
      number | string
    >({
      query: (id) => `products/${id}/attributes`,
      providesTags: ["Attributes"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductWithFilesMutation,
  useDeleteProductMutation,
  useUpdateProductStepMutation,
  useUpdateProductStatusMutation,
  useGetProductAttributesQuery,
} = sellerProductsApi;