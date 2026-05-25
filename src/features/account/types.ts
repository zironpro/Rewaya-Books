export type AuthFormState = {
	error?: string;
	needsVerification?: boolean;
	stateToken?: string;
	needsApproval?: boolean;
	message?: string;
};

export type PersistSessionResult = { ok: true } | { ok: false; error: string };
