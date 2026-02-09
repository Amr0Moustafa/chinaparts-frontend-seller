// sellerSubOrdersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerSubOrdersApi = createApi({
  reducerPath: "sellerSubOrdersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller",
    credentials: "include",
  }),
  tagTypes: ["SubOrders", "SubOrder", "SalesReport"],
  endpoints: (builder) => ({
    /* =============================
       GET /sub-orders?page=1&per_page=10
    ============================= */
    getSubOrders: builder.query<any, { page?: number; per_page?: number } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.page) {
          searchParams.append('page', params.page.toString());
        }
        if (params?.per_page) {
          searchParams.append('per_page', params.per_page.toString());
        }
        
        const queryString = searchParams.toString();
        return `sub-orders${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ["SubOrders"],
    }),

    /* =============================
       GET /sub-orders/sales-report
    ============================= */
    getSubOrdersSalesReport: builder.query<any, void>({
      query: () => "sub-orders/sales-report",
      providesTags: ["SalesReport"],
    }),

    /* =============================
       GET /sub-orders/{id}
    ============================= */
    getSubOrderById: builder.query<any, string | number>({
      query: (id) => `sub-orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SubOrder", id }],
    }),

    /* =============================
       PATCH /sub-orders/{id}/status
       Updated to support optional notes field
    ============================= */
    updateSubOrderStatus: builder.mutation<
      any,
      { id: string | number; status: string; notes?: string }
    >({
      query: ({ id, status, notes }) => {
        const body: { status: string; notes?: string } = { status };
        
        // Only include notes if provided
        if (notes) {
          body.notes = notes;
        }

        return {
          url: `sub-orders/${id}/status`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [
        { type: "SubOrder", id },
        "SubOrders",
        "SalesReport",
      ],
    }),
  }),
});

export const {
  useGetSubOrdersQuery,
  useGetSubOrdersSalesReportQuery,
  useGetSubOrderByIdQuery,
  useUpdateSubOrderStatusMutation,
} = sellerSubOrdersApi;