import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // إعدادات الصور الحديثة (remotePatterns بدلاً من domains)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.chinaparts.com",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },

  // Turbopack: تحديد root directory لتجنب التحذيرات
  turbopack: {
    root: "./",
  },


};

export default nextConfig;
