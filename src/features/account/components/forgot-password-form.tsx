"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { forgotPassword } from "../actions/forgot-password";
import type { AuthFormState } from "../types";

interface ForgotPasswordFormProps {
	onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
	const [formState, formAction, isPending] = useActionState<
		AuthFormState,
		FormData
	>(forgotPassword, {});

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h2 className="font-heading text-2xl">Reset password</h2>
				<p className="text-muted-foreground text-sm">
					We will email you a link to reset your password on Wix.
				</p>
			</div>

			<Form action={formAction} className="space-y-4">
				<div className="space-y-2">
					<label className="font-medium text-sm" htmlFor="forgot-email">
						Email
					</label>
					<Input
						autoComplete="email"
						id="forgot-email"
						name="email"
						placeholder="you@example.com"
						required
						type="email"
					/>
				</div>

				{formState.error ? (
					<p className="text-destructive text-sm" role="alert">
						{formState.error}
					</p>
				) : null}

				{formState.message ? (
					<p className="text-muted-foreground text-sm" role="status">
						{formState.message}
					</p>
				) : null}

				<Button className="w-full" disabled={isPending} type="submit">
					{isPending ? "Sending…" : "Send reset email"}
				</Button>
			</Form>

			<Button
				className="w-full"
				onClick={onBack}
				type="button"
				variant="outline"
			>
				Back to sign in
			</Button>
		</div>
	);
}
