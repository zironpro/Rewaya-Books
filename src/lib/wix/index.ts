import { cookies } from "next/headers";

import { currentCart, recommendations } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";

import { SortKey, WIX_SESSION_COOKIE } from "@/lib/constants";
import { Collection, Product } from "@/lib/wix/types";

import { env } from "../env/server";
import {
	getApplicationErrorCode,
	isWixSdkError,
	reshapeCollection,
	reshapeCollections,
	reshapeProduct,
} from "./helpers";

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

export async function getCollectionProducts({
	collection,
	reverse,
	sortKey,
}: {
	collection: string;
	reverse?: boolean;
	sortKey?: string;
}): Promise<Product[]> {
	const { getCollectionBySlug } = (await getWixClient()).use(collections);
	let resolvedCollection;
	try {
		const { collection: wixCollection } = await getCollectionBySlug(collection);
		resolvedCollection = wixCollection;
	} catch (error) {
		if (getApplicationErrorCode(error) !== 404) {
			throw error;
		}
	}

	if (!resolvedCollection) {
		console.log(`No collection found for \`${collection}\``);
		return [];
	}

	const { items } = await (await sortedProductsQuery(sortKey, reverse))
		.hasSome("collectionIds", [resolvedCollection._id])
		.find();

	return items.map(reshapeProduct);
}

async function sortedProductsQuery(sortKey?: string, reverse?: boolean) {
	const { queryProducts } = (await getWixClient()).use(products);
	const query = queryProducts();
	if (reverse) {
		return query.descending((sortKey! as SortKey) ?? "name");
	}
	return query.ascending((sortKey! as SortKey) ?? "name");
}

export async function getCollections(): Promise<Collection[]> {
	const { queryCollections } = (await getWixClient()).use(collections);
	const { items } = await queryCollections().find();

	const wixCollections = [
		{
			handle: "",
			title: "All",
			description: "All products",
			seo: {
				title: "All",
				description: "All products",
			},
			path: "/shop" as const,
			updatedAt: new Date().toISOString(),
		},
		// Filter out the `hidden` collections.
		// Collections that start with `hidden-*` need to be hidden on the search page.
		...reshapeCollections(items).filter(
			(collection) => !collection.handle.startsWith("hidden")
		),
	];

	return wixCollections;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
	const { queryProducts } = (await getWixClient()).use(products);
	const { items } = await queryProducts().eq("slug", handle).limit(1).find();
	const product = items[0];

	if (!product) {
		return undefined;
	}

	return reshapeProduct(product);
}

export async function getProductRecommendations(
	productId: string
): Promise<Product[]> {
	const { getRecommendation } = (await getWixClient()).use(recommendations);

	const { recommendation } = await getRecommendation(
		[
			{
				_id: "5dd69f67-9ab9-478e-ba7c-10c6c6e7285f",
				appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
			},
			{
				_id: "ba491fd2-b172-4552-9ea6-7202e01d1d3c",
				appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
			},
			{
				_id: "68ebce04-b96a-4c52-9329-08fc9d8c1253",
				appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
			},
		],
		{
			items: [
				{
					catalogItemId: productId,
					appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
				},
			],
			minimumRecommendedItems: 3,
		}
	);

	if (!recommendation) {
		return [];
	}

	const { queryProducts } = (await getWixClient()).use(products);
	const { items } = await queryProducts()
		.in(
			"_id",
			recommendation.items!.map((item) => item.catalogItemId)
		)
		.find();
	return items.slice(0, 6).map(reshapeProduct);
}

export async function getProducts({
	query,
	reverse,
	sortKey,
}: {
	query?: string;
	reverse?: boolean;
	sortKey?: string;
}): Promise<Product[]> {
	const { items } = await (await sortedProductsQuery(sortKey, reverse))
		.startsWith("name", query || "")
		.find();

	return items.map(reshapeProduct);
}

export const getWixClient = async () => {
	let sessionTokens;
	try {
		const cookieStore = await cookies();
		sessionTokens = JSON.parse(
			cookieStore.get(WIX_SESSION_COOKIE)?.value || "{}"
		);
	} catch {}
	const wixClient = createClient({
		auth: OAuthStrategy({
			clientId: env.WIX_CLIENT_ID,
			tokens: sessionTokens,
		}),
	});
	return wixClient;
};

export {
	clearSessionTokens,
	getAuthWixClient,
	getCurrentMember,
	getMemberDisplayName,
	getSessionTokens,
	isMemberLoggedIn,
	isMemberSession,
	parseSessionTokens,
	saveSessionTokens,
} from "./members";

export async function createCheckoutUrl(postFlowUrl: string) {
	const {
		currentCart: { createCheckoutFromCurrentCart },
		redirects: { createRedirectSession },
	} = (await getWixClient()).use({ currentCart, redirects });

	const currentCheckout = await createCheckoutFromCurrentCart({
		channelType: currentCart.ChannelType.OTHER_PLATFORM,
	});

	const { redirectSession } = await createRedirectSession({
		ecomCheckout: { checkoutId: currentCheckout.checkoutId },
		callbacks: {
			postFlowUrl,
		},
	});

	return redirectSession?.fullUrl!;
}
