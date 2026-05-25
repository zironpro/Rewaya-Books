"use client";

import { useState } from "react";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createBrowserAuthClient } from "@/lib/wix/auth-client";

import { persistSession } from "../actions/persist-session";
import {
	exchangeSessionForMemberTokens,
	getSessionTokenFromResponse,
	mapAuthResponse,
} from "../lib/auth-flow";
import type { AuthFormState } from "../types";

interface LoginFormProps {
	clientId: string;
	returnTo: string;
	onForgotPassword: () => void;
	onNeedsVerification: (state: AuthFormState) => void;
}

export function LoginForm({
	clientId,
	returnTo,
	onForgotPassword,
	onNeedsVerification,
}: LoginFormProps) {
	const router = useRouter();
	const [formState, setFormState] = useState<AuthFormState>({});
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		setFormState({});

		const formData = new FormData(event.currentTarget);
		const email = String(formData.get("email") ?? "").trim();
		const password = String(formData.get("password") ?? "");

		if (!email || !password) {
			setFormState({ error: "Enter your email and password." });
			setIsPending(false);
			return;
		}

		const client = createBrowserAuthClient(clientId);

		try {
			const response = await client.auth.login({ email, password });
			const mapped = mapAuthResponse(response);

			if (mapped.needsVerification) {
				onNeedsVerification(mapped);
				setIsPending(false);
				return;
			}

			if (mapped.error || mapped.needsApproval) {
				setFormState(mapped);
				setIsPending(false);
				return;
			}

			const sessionToken = getSessionTokenFromResponse(response);
			if (!sessionToken) {
				setFormState({ error: "Sign in failed. Please try again." });
				setIsPending(false);
				return;
			}

			const tokens = await exchangeSessionForMemberTokens(client, sessionToken);
			const saved = await persistSession(tokens);

			if (!saved.ok) {
				setFormState({ error: saved.error });
				setIsPending(false);
				return;
			}

			router.push(returnTo as Route);
			router.refresh();
		} catch {
			setFormState({
				error: "Sign in failed. Check your details and try again.",
			});
			setIsPending(false);
		}
	}

	return (
		<Form className="space-y-4" onSubmit={handleSubmit}>
			<div className="space-y-2">
				<label className="font-medium text-sm" htmlFor="login-email">
					Email
				</label>
				<Input
					autoComplete="email"
					id="login-email"
					name="email"
					placeholder="you@example.com"
					required
					type="email"
				/>
			</div>

			<div className="space-y-2">
				<label className="font-medium text-sm" htmlFor="login-password">
					Password
				</label>
				<Input
					autoComplete="current-password"
					id="login-password"
					name="password"
					required
					type="password"
				/>
			</div>

			{formState.error ? (
				<p className="text-destructive text-sm" role="alert">
					{formState.error}
				</p>
			) : null}

			<Button className="w-full" disabled={isPending} type="submit">
				{isPending ? "Signing in…" : "Sign in"}
			</Button>

			<Button
				className="w-full"
				onClick={onForgotPassword}
				type="button"
				variant="link"
			>
				Forgot password?
			</Button>
		</Form>
	);
}
