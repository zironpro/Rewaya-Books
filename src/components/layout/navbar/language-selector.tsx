"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { localeConfig, locales } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export const languageOptions = locales.map((locale) => ({
	value: locale,
	label: localeConfig[locale].nativeLabel,
}));

export interface LanguageSelectorProps {
	className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
	return (
		<Select defaultValue="en" items={languageOptions}>
			<SelectTrigger
				className={cn("w-24", className)}
				data-name="language-selector"
				dir="ltr"
				size="sm"
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent
				className="data-closed:animate-none data-open:animate-none"
				dir="ltr"
			>
				<SelectGroup>
					{languageOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
