"use client";

import { members } from "@wix/members";
import { createClient, OAuthStrategy } from "@wix/sdk";

export function createBrowserAuthClient(clientId: string) {
	return createClient({
		modules: { members },
		auth: OAuthStrategy({
			clientId,
		}),
	});
}
