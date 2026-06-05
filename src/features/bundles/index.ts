import { items } from "@wix/data";

import { getWixClient } from "@/lib/wix";

import { BOOK_BUNDLES_COLLECTION } from "./contants";

export async function getBundles() {
	const { items: db } = (await getWixClient()).use({ items });

	const { items: bundles } = await db
		.query(BOOK_BUNDLES_COLLECTION)
		.include("bundleProducts")
		.limit(100)
		.find();

	return bundles;
}
