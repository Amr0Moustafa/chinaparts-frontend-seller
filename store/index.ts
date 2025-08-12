// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import authReducer from '@/features/auth/authSlice';
// import productReducer from '@/features/products/productSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch; 