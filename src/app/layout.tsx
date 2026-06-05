import type { Metadata } from "next";
import "@/styles/globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { BreakpointIndicator } from "@/components/layout/breakpoint-indicator";

import { google, instrumentSerifHeading } from "@/assets/fonts";

import { getCart } from "@/features/cart/actions";
import { CartProvider } from "@/features/cart/context/cart-context";
import { defaultLocale, getTextDirection } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cartPromise = getCart();

	return (
		<html
			className={cn(
				"h-full font-sans antialiased",
				google.variable,
				instrumentSerifHeading.variable
			)}
			dir={getTextDirection(defaultLocale)}
			lang={defaultLocale}
		>
			<body className="flex min-h-full flex-col">
				<NuqsAdapter>
					<CartProvider cartPromise={cartPromise}>{children}</CartProvider>
				</NuqsAdapter>

				<BreakpointIndicator />
			</body>
		</html>
	);
}
