// import axios from 'axios';
// import { getToken } from '@/features/auth/authSlice';

// const baseURL = process.env.NEXT_PUBLIC_API_URL;

// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       // You might want to redirect to login or refresh token
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance; 