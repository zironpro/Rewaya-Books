"use client";

import { TranslateIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
	Menu,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
} from "@/components/ui/menu";

import { localeConfig, locales } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageSelector() {
	const { locale, setLocale } = useLocale();

	return (
		<Menu>
			<MenuTrigger
				aria-label="Select language"
				render={<Button size="icon-lg" variant="ghost" />}
			>
				<TranslateIcon aria-hidden="true" className="size-4" />
				<span className="sr-only">Language</span>
			</MenuTrigger>
			<MenuPopup align="end" className="min-w-36">
				<MenuRadioGroup
					onValueChange={(value) => {
						if (value === "en" || value === "ar") {
							setLocale(value);
						}
					}}
					value={locale}
				>
					{locales.map((code) => (
						<MenuRadioItem key={code} value={code}>
							{localeConfig[code].nativeLabel}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuPopup>
		</Menu>
	);
}
