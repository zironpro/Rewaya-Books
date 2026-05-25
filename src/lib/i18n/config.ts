export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeCookieName = "locale";

export type LocaleConfig = {
	label: string;
	nativeLabel: string;
	dir: "ltr" | "rtl";
};

export const localeConfig: Record<Locale, LocaleConfig> = {
	en: {
		label: "English",
		nativeLabel: "English",
		dir: "ltr",
	},
	ar: {
		label: "Arabic",
		nativeLabel: "العربية",
		dir: "rtl",
	},
};

export function isLocale(value: string | undefined | null): value is Locale {
	return value === "en" || value === "ar";
}

export function getLocaleFromCookie(value: string | undefined | null): Locale {
	return isLocale(value) ? value : defaultLocale;
}

export function getTextDirection(locale: Locale): "ltr" | "rtl" {
	return localeConfig[locale].dir;
}
