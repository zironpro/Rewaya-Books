import { Suspense } from "react";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

import { AuthTabs, LoginButton } from "@/features/account";
import { AUTH_RETURN_TO_PARAM } from "@/lib/constants";
import { env } from "@/lib/env/server";
import { isMemberLoggedIn } from "@/lib/wix/members";

interface LoginPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function getReturnTo(
	searchParams: { [key: string]: string | string[] | undefined },
	fallback = "/profile"
) {
	const value = searchParams[AUTH_RETURN_TO_PARAM];
	const returnTo = Array.isArray(value) ? value[0] : value;
	if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
		return fallback;
	}
	return returnTo;
}

function LoginPageFallback() {
	return (
		<main className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
			<div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 shadow-xs md:p-8">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</main>
	);
}

export default function LoginPage({ searchParams }: LoginPageProps) {
	return (
		<Suspense fallback={<LoginPageFallback />}>
			<LoginPageContent searchParams={searchParams} />
		</Suspense>
	);
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
	const params = await searchParams;
	const returnTo = getReturnTo(params);

	if (await isMemberLoggedIn()) {
		redirect(returnTo as Route);
	}

	return (
		<main className="container flex min-h-svh items-center justify-center py-12">
			<div className="w-full max-w-md rounded-md border bg-card p-6 shadow-xs md:p-8">
				<LoginButton />
				<AuthTabs
					clientId={env.WIX_CLIENT_ID}
					returnTo={returnTo}
					siteUrl={env.SITE_URL}
				/>
			</div>
		</main>
	);
}
