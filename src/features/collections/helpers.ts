import { collections } from "@wix/stores";

import { Collection } from "@/lib/wix/types";

export const reshapeCollection = (
	collection: collections.Collection
): Collection => ({
	path: `/shop/${collection.slug ?? ""}`,
	handle: collection.slug ?? "",
	title: collection.name ?? "",
	description: collection.description ?? "",
	image: collection.media?.mainMedia?.image?.url,
	productsCount: collection.numberOfProducts ?? 0,
	seo: {
		title: collection.name ?? "",
		description: collection.description ?? "",
	},
	updatedAt: new Date().toISOString(),
});

export const reshapeCollections = (
	wixCollections: collections.Collection[]
) => {
	return wixCollections.map(reshapeCollection);
};
