import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_RETURN_TO_PARAM } from "@/lib/constants";
import { isMemberLoggedIn } from "@/lib/wix/members";

export default async function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (!(await isMemberLoggedIn())) {
		const headersList = await headers();
		const pathname =
			headersList.get("x-pathname") ??
			headersList.get("x-invoke-path") ??
			"/profile";
		redirect(
			`/login?${AUTH_RETURN_TO_PARAM}=${encodeURIComponent(pathname)}` as Route
		);
	}

	return children;
}
