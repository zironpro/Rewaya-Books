import { NextRequest, NextResponse } from "next/server";

import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE } from "@/lib/constants";
import { isMemberSession, parseSessionTokens } from "@/lib/wix/members";

import { env } from "./lib/env/client";

const wixClient = createClient({
	auth: OAuthStrategy({
		clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
	}),
});

const SESSION_MAX_AGE = 60 * 60 * 24 * 12;

export async function proxy(request: NextRequest) {
	const sessionCookie = request.cookies.get(WIX_SESSION_COOKIE);
	const parsedTokens = parseSessionTokens(sessionCookie?.value);
	const wasMember = isMemberSession(parsedTokens);

	let sessionTokens: Tokens =
		parsedTokens ?? (await wixClient.auth.generateVisitorTokens());

	const isExpired =
		sessionTokens.accessToken.expiresAt < Math.floor(Date.now() / 1000);

	if (isExpired) {
		try {
			sessionTokens = await wixClient.auth.renewToken(
				sessionTokens.refreshToken
			);
		} catch (_e) {
			if (wasMember) {
				const res = NextResponse.next({ request });
				res.cookies.delete(WIX_SESSION_COOKIE);
				return res;
			}
			sessionTokens = await wixClient.auth.generateVisitorTokens();
		}
	}

	request.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(sessionTokens));
	request.headers.set("x-pathname", request.nextUrl.pathname);
	const res = NextResponse.next({ request });
	res.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(sessionTokens), {
		maxAge: SESSION_MAX_AGE,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
