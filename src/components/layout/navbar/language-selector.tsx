"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { type Locale, localeConfig, locales } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export const languageOptions = locales.map((locale) => ({
	value: locale,
	label: `${localeConfig[locale].label} (${localeConfig[locale].nativeLabel})`,
}));

export interface LanguageSelectorProps {
	value: Locale;
	onValueChange: (value: Locale) => void;
	className?: string;
}

export function LanguageSelector({
	value,
	onValueChange,
	className,
}: LanguageSelectorProps) {
	return (
		<Select
			items={languageOptions}
			onValueChange={(nextValue) => onValueChange(nextValue as Locale)}
			value={value}
		>
			<SelectTrigger
				className={cn("w-40", className)}
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
