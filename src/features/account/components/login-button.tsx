"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { env } from "@/lib/env/client";
import { createBrowserAuthClient } from "@/lib/wix/auth-client";

export const LoginButton = () => {
	const [isPending, startTransition] = useTransition();
	function handleLogin() {
		startTransition(async () => {
			const client = createBrowserAuthClient(env.NEXT_PUBLIC_WIX_CLIENT_ID);

			const loginRequest = client.auth.generateOAuthData(
				"http://localhost:3000"
			);
			localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequest));

			const { authUrl } = await client.auth.getAuthUrl(loginRequest);
			console.log("authUrl:", authUrl);

			const updatedUrl = authUrl.replace(
				"https://www.rewayabooks.com",
				"https://store.rewayabooks.com"
			);
			window.location.href = updatedUrl;
		});
	}

	return (
		<Button disabled={isPending} onClick={handleLogin}>
			Login Wix
		</Button>
	);
};
