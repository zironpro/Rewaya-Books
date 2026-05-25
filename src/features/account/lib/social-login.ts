"use client";

import {
	AUTH_RETURN_TO_PARAM,
	LOGIN_CALLBACK_PATH,
	WIX_OAUTH_STORAGE_KEY,
} from "@/lib/constants";
import type { createBrowserAuthClient } from "@/lib/wix/auth-client";

type AuthClient = ReturnType<typeof createBrowserAuthClient>;

export type StoredOAuthContext = {
	oauthData: ReturnType<AuthClient["auth"]["generateOAuthData"]>;
	returnTo: string;
};

export function buildLoginCallbackUrl(siteUrl: string) {
	return `${siteUrl}${LOGIN_CALLBACK_PATH}`;
}

export function buildLoginPageUrl(siteUrl: string, returnTo: string) {
	const params = new URLSearchParams({ [AUTH_RETURN_TO_PARAM]: returnTo });
	return `${siteUrl}/login?${params.toString()}`;
}

export function storeOAuthContext(context: StoredOAuthContext) {
	sessionStorage.setItem(WIX_OAUTH_STORAGE_KEY, JSON.stringify(context));
}

export function readOAuthContext(): StoredOAuthContext | null {
	const raw = sessionStorage.getItem(WIX_OAUTH_STORAGE_KEY);
	if (!raw) return null;

	try {
		return JSON.parse(raw) as StoredOAuthContext;
	} catch {
		return null;
	}
}

export function clearOAuthContext() {
	sessionStorage.removeItem(WIX_OAUTH_STORAGE_KEY);
}

export async function startWixSocialLogin({
	client,
	siteUrl,
	returnTo,
}: {
	client: AuthClient;
	siteUrl: string;
	returnTo: string;
}) {
	const oauthData = client.auth.generateOAuthData(
		buildLoginCallbackUrl(siteUrl),
		buildLoginPageUrl(siteUrl, returnTo)
	);

	storeOAuthContext({ oauthData, returnTo });

	const { authUrl } = await client.auth.getAuthUrl(oauthData);
	window.location.assign(authUrl);
}
