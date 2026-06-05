import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_WIX_CLIENT_ID: z.string().min(1),
		NEXT_PUBLIC_DEBUG: z.string().optional(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_WIX_CLIENT_ID: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
		NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
	},
});
