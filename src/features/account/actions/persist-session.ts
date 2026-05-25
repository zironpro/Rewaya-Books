"use server";

import type { Tokens } from "@wix/sdk";

import { saveSessionTokens } from "@/lib/wix/members";

import type { PersistSessionResult } from "../types";

export async function persistSession(
	tokens: Tokens
): Promise<PersistSessionResult> {
	try {
		await saveSessionTokens(tokens);
		return { ok: true };
	} catch {
		return {
			ok: false,
			error: "Could not save your session. Please try again.",
		};
	}
}
