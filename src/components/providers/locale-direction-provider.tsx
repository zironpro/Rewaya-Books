"use client";

import type { ReactNode } from "react";

import { DirectionProvider } from "@/components/ui/direction";

import type { Locale } from "@/lib/i18n/config";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale-context";

type LocaleDirectionProviderProps = {
	children: ReactNode;
	locale: Locale;
};

export function LocaleDirectionProvider({
	children,
	locale,
}: LocaleDirectionProviderProps) {
	return (
		<LocaleProvider initialLocale={locale} key={locale}>
			<LocaleDirectionInner>{children}</LocaleDirectionInner>
		</LocaleProvider>
	);
}

function LocaleDirectionInner({ children }: { children: ReactNode }) {
	const { direction } = useLocale();

	return (
		<DirectionProvider direction={direction}>{children}</DirectionProvider>
	);
}
