import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { categoriesApi } from "@/features/category";
import { sellerProductsApi } from "@/features/products";
import { sellerAttributesApi } from "@/features/sellerAttributes";
import { sellerSubOrdersApi } from "@/features/sellerSubOrders";

export const store = configureStore({
  reducer: {
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [sellerProductsApi.reducerPath]: sellerProductsApi.reducer,
    [sellerAttributesApi.reducerPath]: sellerAttributesApi.reducer,
    [sellerSubOrdersApi.reducerPath]: sellerSubOrdersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      categoriesApi.middleware,
      sellerProductsApi.middleware,
      sellerAttributesApi.middleware,
      sellerSubOrdersApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
