import type { Metadata } from "next";
import "@/styles/globals.css";

import { Navbar } from "@/components/layout/navbar";
import { DirectionProvider } from "@/components/ui/direction";

import { instrumentSerifHeading, publicSans } from "@/assets/fonts";

import { CartProvider } from "@/features/cart/context/cart-context";
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

	return (
		<html
			className={cn(
				"h-full font-sans antialiased",
				publicSans.variable,
				instrumentSerifHeading.variable
			)}
			lang="en"
		>
			<body className="flex min-h-full flex-col">
				<DirectionProvider direction="ltr">
					<CartProvider cartPromise={cart}>
						<Navbar />
						{children}
					</CartProvider>
				</DirectionProvider>
			</body>
		</html>
	);
}
