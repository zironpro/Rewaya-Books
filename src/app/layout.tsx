import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@/styles/globals.css";

import { Navbar } from "@/components/layout/navbar";
import { LocaleDirectionProvider } from "@/components/providers/locale-direction-provider";

import { instrumentSerifHeading, publicSans } from "@/assets/fonts";

import { CartProvider } from "@/features/cart/context/cart-context";
import {
	getLocaleFromCookie,
	getTextDirection,
	localeCookieName,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { getCart } from "@/lib/wix";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cart = getCart();
	const cookieStore = await cookies();
	const locale = getLocaleFromCookie(cookieStore.get(localeCookieName)?.value);
	const direction = getTextDirection(locale);

	return (
		<html
			className={cn(
				"h-full font-sans antialiased",
				publicSans.variable,
				instrumentSerifHeading.variable
			)}
			dir={direction}
			lang={locale}
		>
			<body className="flex min-h-full flex-col">
				<LocaleDirectionProvider locale={locale}>
					<CartProvider cartPromise={cart}>
						<Navbar />
						{children}
					</CartProvider>
				</LocaleDirectionProvider>
			</body>
		</html>
	);
}
