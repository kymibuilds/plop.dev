import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // Security: remove X-Powered-By header
  reactStrictMode: true,  // Catch bugs early
  images: {
    formats: ['image/avif', 'image/webp'], // Better image optimization
  },
};

export default nextConfig;
