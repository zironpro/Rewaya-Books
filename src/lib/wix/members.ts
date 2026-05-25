import { cookies } from "next/headers";

import { members } from "@wix/members";
import { createClient, OAuthStrategy, TokenRole, type Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE } from "@/lib/constants";
import { env } from "@/lib/env/server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 12;

export function parseSessionTokens(raw: string | undefined): Tokens | null {
	if (!raw) return null;
	try {
		const tokens = JSON.parse(raw) as Tokens;
		if (!tokens.refreshToken?.value) return null;
		return tokens;
	} catch {
		return null;
	}
}

export function isMemberSession(tokens: Tokens | null): boolean {
	return tokens?.refreshToken?.role === TokenRole.MEMBER;
}

export async function getSessionTokens(): Promise<Tokens | null> {
	const cookieStore = await cookies();
	return parseSessionTokens(cookieStore.get(WIX_SESSION_COOKIE)?.value);
}

export async function getAuthWixClient(tokens?: Tokens | null) {
	const sessionTokens = tokens ?? (await getSessionTokens());
	return createClient({
		modules: { members },
		auth: OAuthStrategy({
			clientId: env.WIX_CLIENT_ID,
			tokens: sessionTokens ?? undefined,
		}),
	});
}

export async function saveSessionTokens(tokens: Tokens) {
	const cookieStore = await cookies();
	cookieStore.set(WIX_SESSION_COOKIE, JSON.stringify(tokens), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_MAX_AGE,
		path: "/",
	});
}

export async function clearSessionTokens() {
	const cookieStore = await cookies();
	cookieStore.delete(WIX_SESSION_COOKIE);
}

export async function isMemberLoggedIn(): Promise<boolean> {
	const tokens = await getSessionTokens();
	if (!isMemberSession(tokens)) return false;

	const client = await getAuthWixClient(tokens);
	return client.auth.loggedIn();
}

export async function getCurrentMember() {
	const tokens = await getSessionTokens();
	if (!isMemberSession(tokens)) return null;

	try {
		const client = await getAuthWixClient(tokens);
		if (!client.auth.loggedIn()) return null;
		const { member } = await client.members.getCurrentMember({
			fieldsets: ["FULL"],
		});
		return member ?? null;
	} catch {
		return null;
	}
}

export function getMemberDisplayName(
	member: NonNullable<Awaited<ReturnType<typeof getCurrentMember>>>
): string {
	const contact =
		member.contact ??
		("contactDetails" in member
			? (member.contactDetails as {
					firstName?: string | null;
					lastName?: string | null;
				})
			: undefined);

	const firstName = contact?.firstName?.trim();
	const lastName = contact?.lastName?.trim();
	const fullName = [firstName, lastName].filter(Boolean).join(" ");
	if (fullName) return fullName;

	const email =
		member.loginEmail?.trim() ??
		("loginEmail" in member ? String(member.loginEmail ?? "") : "");
	if (email) return email.split("@")[0] ?? email;
	return "Member";
}
