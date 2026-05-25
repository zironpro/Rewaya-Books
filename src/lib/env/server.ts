import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
	server: {
		WIX_CLIENT_ID: z.string().min(1),
		WIX_API_KEY: z.string().min(1),
		SITE_URL: z.string().min(1),
	},
	// If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
	// runtimeEnv: {
	//   WIX_CLIENT_ID: process.env.WIX_CLIENT_ID,
	//   WIX_API_KEY: process.env.WIX_API_KEY,
	//   SITE_URL: process.env.SITE_URL,
	// },
	// For Next.js >= 13.4.4, you can just reference process.env:
	experimental__runtimeEnv: process.env,
});
