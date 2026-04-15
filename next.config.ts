import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stmhhvsqwaytilgvszey.storage.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", // ✅ Lebih spesifik
      },
      {
        protocol: "https",
        hostname: "stmhhvsqwaytilgvszey.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", // ✅ Lebih spesifik
      },
    ],
  },
};

export default nextConfig;
