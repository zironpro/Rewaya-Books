"use client";

import { useEffect, useState } from "react";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { createBrowserAuthClient } from "@/lib/wix/auth-client";

import { persistSession } from "../actions/persist-session";
import { clearOAuthContext, readOAuthContext } from "../lib/social-login";

interface LoginCallbackHandlerProps {
	clientId: string;
}

export function LoginCallbackHandler({ clientId }: LoginCallbackHandlerProps) {
	const router = useRouter();
	const [message, setMessage] = useState("Completing sign in…");

	useEffect(() => {
		let cancelled = false;

		async function completeLogin() {
			const stored = readOAuthContext();
			if (!stored) {
				setMessage("Sign-in session expired. Redirecting to login…");
				router.replace("/login" as Route);
				return;
			}

			const client = createBrowserAuthClient(clientId);
			const returnedOAuthData = client.auth.parseFromUrl();

			if (returnedOAuthData.error) {
				clearOAuthContext();
				setMessage(
					returnedOAuthData.errorDescription ??
						"Google sign-in was cancelled. Redirecting…"
				);
				router.replace("/login" as Route);
				return;
			}

			if (!returnedOAuthData.code || !returnedOAuthData.state) {
				clearOAuthContext();
				setMessage("Invalid sign-in response. Redirecting…");
				router.replace("/login" as Route);
				return;
			}

			try {
				const tokens = await client.auth.getMemberTokens(
					returnedOAuthData.code,
					returnedOAuthData.state,
					stored.oauthData
				);

				const saved = await persistSession(tokens);
				clearOAuthContext();

				if (!saved.ok) {
					setMessage(saved.error);
					router.replace("/login" as Route);
					return;
				}

				if (!cancelled) {
					router.replace(stored.returnTo as Route);
					router.refresh();
				}
			} catch {
				clearOAuthContext();
				if (!cancelled) {
					setMessage("Sign-in failed. Redirecting…");
					router.replace("/login" as Route);
				}
			}
		}

		completeLogin();

		return () => {
			cancelled = true;
		};
	}, [clientId, router]);

	return (
		<main className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
			<p className="text-muted-foreground text-sm">{message}</p>
		</main>
	);
}
