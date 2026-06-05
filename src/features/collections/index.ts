import { collections } from "@wix/stores";

import { getWixClient } from "@/lib/wix";
import { isWixSdkError } from "@/lib/wix/helpers";
import { Collection } from "@/lib/wix/types";

import { reshapeCollection, reshapeCollections } from "./helpers";

export async function getCollection(
	handle: string
): Promise<Collection | undefined> {
	const { getCollectionBySlug } = (await getWixClient()).use(collections);

	try {
		const { collection } = await getCollectionBySlug(handle);

		if (!collection) {
			return undefined;
		}

		return reshapeCollection(collection);
	} catch (error) {
		if (isWixSdkError(error) && error.code === "404") {
			return undefined;
		}
	}
}

export async function getCollections(): Promise<Collection[]> {
	const { queryCollections } = (await getWixClient()).use(collections);
	const { items } = await queryCollections().find();

	const wixCollections = [
		// {
		// 	handle: "",
		// 	title: "Shop All",
		// 	description: "All products",
		// 	seo: {
		// 		title: "All",
		// 		description: "All products",
		// 	},
		// 	path: "/shop" as const,
		// 	updatedAt: new Date().toISOString(),
		// },
		// Filter out the `hidden` collections.
		// Collections that start with `hidden-*` need to be hidden on the search page.
		...reshapeCollections(items).filter(
			(collection) => !collection.handle.startsWith("hidden")
		),
	];

	return wixCollections;
}
