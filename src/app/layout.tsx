import type { Metadata } from "next";
import "@/styles/globals.css";

import { Navbar } from "@/components/layout/navbar";

import { instrumentSerifHeading, publicSans } from "@/assets/fonts";

import { CartProvider } from "@/features/cart/context/cart-context";
import { defaultLocale, getTextDirection } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { getCart } from "@/lib/wix";

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
				publicSans.variable,
				instrumentSerifHeading.variable
			)}
			dir={getTextDirection(defaultLocale)}
			lang={defaultLocale}
		>
			<body className="flex min-h-full flex-col">
				<CartProvider cartPromise={cartPromise}>
					<Navbar />
					{children}
				</CartProvider>
			</body>
		</html>
	);
}
