"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import { useRouter } from "next/navigation";

import {
	defaultLocale,
	getTextDirection,
	type Locale,
	localeCookieName,
} from "@/lib/i18n/config";

type LocaleContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	direction: "ltr" | "rtl";
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function setLocaleCookie(locale: Locale) {
	document.cookie = `${localeCookieName}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

function syncDocumentLocale(locale: Locale) {
	document.documentElement.lang = locale;
	document.documentElement.dir = getTextDirection(locale);
}

type LocaleProviderProps = {
	children: ReactNode;
	initialLocale?: Locale;
};

export function LocaleProvider({
	children,
	initialLocale = defaultLocale,
}: LocaleProviderProps) {
	const router = useRouter();
	const [locale, setLocaleState] = useState<Locale>(initialLocale);

	const setLocale = useCallback(
		(nextLocale: Locale) => {
			setLocaleState(nextLocale);
			setLocaleCookie(nextLocale);
			syncDocumentLocale(nextLocale);
			router.refresh();
		},
		[router]
	);

	const value = useMemo<LocaleContextValue>(
		() => ({
			locale,
			setLocale,
			direction: getTextDirection(locale),
		}),
		[locale, setLocale]
	);

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}

export function useLocale(): LocaleContextValue {
	const context = useContext(LocaleContext);
	if (context === undefined) {
		throw new Error("useLocale must be used within a LocaleProvider");
	}
	return context;
}
