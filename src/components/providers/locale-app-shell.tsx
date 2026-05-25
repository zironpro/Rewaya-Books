import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { LocaleDirectionProvider } from "@/components/providers/locale-direction-provider";

import { CartProvider } from "@/features/cart/context/cart-context";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Cart } from "@/lib/wix/types";

type LocaleAppShellProps = {
	children: ReactNode;
	cartPromise: Promise<Cart | undefined>;
	locale: Awaited<ReturnType<typeof getLocale>>;
};

export function LocaleAppShell({
	children,
	cartPromise,
	locale,
}: LocaleAppShellProps) {
	return (
		<LocaleDirectionProvider locale={locale}>
			<CartProvider cartPromise={cartPromise}>
				<Navbar />
				{children}
			</CartProvider>
		</LocaleDirectionProvider>
	);
}

export async function LocaleAppShellFromCookie({
	children,
	cartPromise,
}: {
	children: ReactNode;
	cartPromise: Promise<Cart | undefined>;
}) {
	const locale = await getLocale();

	return (
		<LocaleAppShell cartPromise={cartPromise} locale={locale}>
			{children}
		</LocaleAppShell>
	);
}
