import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface WalletTransactionFilters {
  type?: string;
  bucket?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}


export interface WalletReserveFilters {
  status?: string;
  per_page?: number;
  page?: number;
}

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/seller/",
  }),
  tagTypes: ["Wallet", "Transactions", "Reserves"],
  endpoints: (builder) => ({
    
    // GET /wallet
    getWallet: builder.query<any, void>({
      query: () => "wallet",
      providesTags: ["Wallet"],
    }),

    // GET /wallet/transactions
    getWalletTransactions: builder.query<any, WalletTransactionFilters>({
      query: (params) => ({
        url: "wallet/transactions",
        params,
      }),
      providesTags: ["Transactions"],
    }),
   
    // GET /wallet/reserves
   
    getWalletReserves: builder.query<any, WalletReserveFilters>({
      query: (params) => ({
        url: "wallet/reserves",
        params,
      }),
      providesTags: ["Reserves"],
    }),

    // POST /wallet/withdraw
    withdrawWallet: builder.mutation<any, { amount: number; note?: string }>({
      query: (body) => ({
        url: "wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Transactions"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useGetWalletReservesQuery,
  useWithdrawWalletMutation,
} = walletApi;