"use client";

import { useState } from "react";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { LoginState } from "@wix/sdk";

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

interface VerifyEmailFormProps {
	clientId: string;
	returnTo: string;
	stateToken?: string;
	onBack: () => void;
}

export function VerifyEmailForm({
	clientId,
	returnTo,
	stateToken,
	onBack,
}: VerifyEmailFormProps) {
	const router = useRouter();
	const [formState, setFormState] = useState<AuthFormState>({});
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		setFormState({});

		const formData = new FormData(event.currentTarget);
		const verificationCode = String(formData.get("code") ?? "").trim();

		if (!verificationCode) {
			setFormState({ error: "Enter the verification code from your email." });
			setIsPending(false);
			return;
		}

		const client = createBrowserAuthClient(clientId);

		try {
			const response = await client.auth.processVerification(
				{ verificationCode },
				stateToken
					? {
							loginState: LoginState.EMAIL_VERIFICATION_REQUIRED,
							data: { stateToken },
						}
					: undefined
			);

			const mapped = mapAuthResponse(response);
			if (mapped.error || mapped.needsVerification || mapped.needsApproval) {
				setFormState(mapped);
				setIsPending(false);
				return;
			}

			const sessionToken = getSessionTokenFromResponse(response);
			if (!sessionToken) {
				setFormState({ error: "Verification failed. Try again." });
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
				error: "Verification failed. Check the code and try again.",
			});
			setIsPending(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h2 className="font-heading text-2xl">Verify your email</h2>
				<p className="text-muted-foreground text-sm">
					Enter the code we sent to your inbox to finish signing in.
				</p>
			</div>

			<Form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label className="font-medium text-sm" htmlFor="code">
						Verification code
					</label>
					<Input
						autoComplete="one-time-code"
						id="code"
						name="code"
						placeholder="123456"
						required
					/>
				</div>

				{formState.error ? (
					<p className="text-destructive text-sm" role="alert">
						{formState.error}
					</p>
				) : null}

				<Button className="w-full" disabled={isPending} type="submit">
					{isPending ? "Verifying…" : "Verify and continue"}
				</Button>
			</Form>

			<Button
				className="w-full"
				onClick={onBack}
				type="button"
				variant="outline"
			>
				Back
			</Button>
		</div>
	);
}
