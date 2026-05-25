"use client";

import { LoginState } from "@wix/sdk";

import type { createBrowserAuthClient } from "@/lib/wix/auth-client";

import type { AuthFormState } from "../types";

type AuthClient = ReturnType<typeof createBrowserAuthClient>;

type AuthResponse = Awaited<ReturnType<AuthClient["auth"]["login"]>>;

const ERROR_MESSAGES: Record<string, string> = {
	invalidEmail: "Enter a valid email address.",
	invalidPassword: "Incorrect email or password.",
	emailAlreadyExists:
		"An account with this email already exists. Sign in instead.",
	resetPassword: "Reset your password using the link below.",
	missingCaptchaToken: "Complete the security check and try again.",
	invalidCaptchaToken: "Security check failed. Try again.",
};

export async function exchangeSessionForMemberTokens(
	client: AuthClient,
	sessionToken: string
) {
	return client.auth.getMemberTokensForDirectLogin(sessionToken);
}

export function getSessionTokenFromResponse(
	response: AuthResponse
): string | undefined {
	if (
		response.loginState === LoginState.SUCCESS &&
		"data" in response &&
		response.data?.sessionToken
	) {
		return response.data.sessionToken;
	}
	return undefined;
}

export function mapAuthResponse(response: AuthResponse): AuthFormState {
	if (response.loginState === LoginState.SUCCESS) {
		return {};
	}

	if (response.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
		const stateToken =
			"data" in response ? response.data?.stateToken : undefined;
		return {
			needsVerification: true,
			stateToken,
		};
	}

	if (response.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
		return {
			needsApproval: true,
			error:
				"Your account is pending approval. You can sign in once the site owner approves it.",
		};
	}

	const errorCode = "errorCode" in response ? response.errorCode : undefined;
	const message =
		(errorCode && ERROR_MESSAGES[errorCode]) ||
		("error" in response ? response.error : undefined) ||
		"Something went wrong. Please try again.";

	return { error: message };
}
