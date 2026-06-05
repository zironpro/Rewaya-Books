"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { AuthFormState } from "../types";
import { AuthDivider } from "./auth-divider";
import { ForgotPasswordForm } from "./forgot-password-form";
import { GoogleLoginButton } from "./google-login-button";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { VerifyEmailForm } from "./verify-email-form";

type AuthView = "login" | "register" | "forgot" | "verify";

interface AuthTabsProps {
	clientId: string;
	siteUrl: string;
	returnTo: string;
}

export function AuthTabs({ clientId, siteUrl, returnTo }: AuthTabsProps) {
	const [view, setView] = useState<AuthView>("login");
	const [verificationState, setVerificationState] = useState<AuthFormState>({});

	function handleNeedsVerification(state: AuthFormState) {
		setVerificationState(state);
		setView("verify");
	}

	if (view === "verify") {
		return (
			<VerifyEmailForm
				clientId={clientId}
				onBack={() => setView("login")}
				returnTo={returnTo}
				stateToken={verificationState.stateToken}
			/>
		);
	}

	if (view === "forgot") {
		return <ForgotPasswordForm onBack={() => setView("login")} />;
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="font-bold font-heading text-3xl">Welcome back</h1>
				<p className="text-muted-foreground text-sm">
					Sign in or create an account to save favorites and manage your
					profile.
				</p>
			</div>

			<GoogleLoginButton
				clientId={clientId}
				returnTo={returnTo}
				siteUrl={siteUrl}
			/>

			<AuthDivider />

			<div className="flex rounded-lg border bg-muted/30 p-1">
				<button
					className={cn(
						"flex-1 rounded-md px-3 py-2 font-medium text-sm transition-colors",
						view === "login"
							? "bg-background text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground"
					)}
					onClick={() => setView("login")}
					type="button"
				>
					Sign in
				</button>
				<button
					className={cn(
						"flex-1 rounded-md px-3 py-2 font-medium text-sm transition-colors",
						view === "register"
							? "bg-background text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground"
					)}
					onClick={() => setView("register")}
					type="button"
				>
					Sign up
				</button>
			</div>

			{view === "login" ? (
				<LoginForm
					clientId={clientId}
					onForgotPassword={() => setView("forgot")}
					onNeedsVerification={handleNeedsVerification}
					returnTo={returnTo}
				/>
			) : (
				<RegisterForm
					clientId={clientId}
					onNeedsVerification={handleNeedsVerification}
					returnTo={returnTo}
				/>
			)}
		</div>
	);
}
