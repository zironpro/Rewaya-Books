import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,

  experimental:{
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true
  },
  
 images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default nextConfig;
