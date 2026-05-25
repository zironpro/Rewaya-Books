import { cookies } from "next/headers";

import {
	getLocaleFromCookie,
	getTextDirection,
	type Locale,
	localeCookieName,
} from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	return getLocaleFromCookie(cookieStore.get(localeCookieName)?.value);
}

export async function getLocaleDirection(): Promise<"ltr" | "rtl"> {
	return getTextDirection(await getLocale());
}
