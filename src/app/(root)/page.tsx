import { Metadata } from "next";

import { HomepageView } from "@/views/home";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",
};

export default function Home() {
	return <HomepageView />;
}
