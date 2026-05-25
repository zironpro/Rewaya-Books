"use server";

import { createClient, OAuthStrategy } from "@wix/sdk";

import { env } from "@/lib/env/server";

import type { AuthFormState } from "../types";

export async function forgotPassword(
	_prevState: AuthFormState,
	formData: FormData
): Promise<AuthFormState> {
	const email = String(formData.get("email") ?? "").trim();

	if (!email) {
		return { error: "Enter your email address." };
	}

	const client = createClient({
		auth: OAuthStrategy({
			clientId: env.WIX_CLIENT_ID,
		}),
	});

	try {
		await client.auth.sendPasswordResetEmail(email, `${env.SITE_URL}/login`);
		return {
			message:
				"If an account exists for that email, we sent password reset instructions.",
		};
	} catch {
		return {
			error: "Could not send the reset email. Check the address and try again.",
		};
	}
}
