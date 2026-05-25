"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { env } from "@/lib/env/server";
import { clearSessionTokens, getAuthWixClient } from "@/lib/wix/members";

export async function logout() {
	const client = await getAuthWixClient();
	try {
		await client.auth.logout(`${env.SITE_URL}/login`);
	} catch {
		// Continue with local session clear even if Wix logout URL fails
	}
	await clearSessionTokens();
	redirect("/login" as Route);
}
