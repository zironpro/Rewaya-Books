import type { NextConfig } from "next";
import "./src/lib/env/server";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	cacheComponents: true,

	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackFileSystemCacheForDev: true,
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

	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
