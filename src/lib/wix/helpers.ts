import { currentCart } from "@wix/ecom";
import { media } from "@wix/sdk";
import { products } from "@wix/stores";

import { Cart, Product } from "@/lib/wix/types";

export const cartesian = <T>(data: T[][]) =>
	data.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [
		[],
	] as T[][]);

export type WixSdkError = {
	code?: string | number;
	details?: { applicationError?: { code?: string | number } };
};

export const isWixSdkError = (error: unknown): error is WixSdkError =>
	typeof error === "object" && error !== null;

export const getApplicationErrorCode = (error: unknown) =>
	isWixSdkError(error) ? error.details?.applicationError?.code : undefined;

export type WixResolvedImage = {
	url: string;
	width: number;
	height: number;
	altText?: string;
};

/** Converts `wix:image://…` (or static.wixstatic.com URLs) to a Next.js–compatible image. */
export const getWixImage = (
	source: string | null | undefined
): WixResolvedImage | undefined => {
	if (!source) {
		return undefined;
	}

	const { url, width, height, altText } = media.getImageUrl(source);
	return { url, width, height, altText };
};

const getOptionChoiceLabel = (
	optionType: products.ProductOption["optionType"],
	choice: products.Choice
): string =>
	optionType === products.OptionType.color
		? (choice.description ?? choice.value ?? "")
		: (choice.value ?? choice.description ?? "");

export const reshapeCart = (cart: currentCart.Cart): Cart => {
	return {
		id: cart._id!,
		checkoutUrl: "/cart-checkout",
		cost: {
			subtotalAmount: {
				amount: String(
					cart.lineItems!.reduce((acc, item) => {
						return (
							acc + Number.parseFloat(item.price?.amount!) * item.quantity!
						);
					}, 0)
				),
				currencyCode: cart.currency!,
			},
			totalAmount: {
				amount: String(
					cart.lineItems!.reduce((acc, item) => {
						return (
							acc + Number.parseFloat(item.price?.amount!) * item.quantity!
						);
					}, 0)
				),
				currencyCode: cart.currency!,
			},
			totalTaxAmount: {
				amount: "0",
				currencyCode: cart.currency!,
			},
		},
		lines: cart.lineItems!.map((item) => {
			const featuredImage = getWixImage(item.image!)!;
			return {
				id: item._id!,
				quantity: item.quantity!,
				cost: {
					totalAmount: {
						amount: String(
							Number.parseFloat(item.price?.amount!) * item.quantity!
						),
						currencyCode: cart.currency!,
					},
				},
				merchandise: {
					id: item._id!,
					title:
						item.descriptionLines
							?.map((x) => x.colorInfo?.original ?? x.plainText?.original)
							.join(" / ") ?? "",
					selectedOptions: [],
					product: {
						handle: item.url?.split("/").pop() ?? "",
						featuredImage: {
							altText: featuredImage.altText ?? "alt text",
							url: featuredImage.url,
							width: featuredImage.width,
							height: featuredImage.height,
						},
						title: item.productName?.original!,
						// biome-ignore lint/suspicious/noExplicitAny: return type is Product
					} as any as Product,
					url: `/product/${item.url?.split("/").pop() ?? ""}`,
				},
			};
		}),
		totalQuantity: cart.lineItems!.reduce((acc, item) => {
			return acc + item.quantity!;
		}, 0),
	};
};

export const reshapeProduct = (item: products.Product): Product => {
	return {
		id: item._id!,
		title: item.name!,
		description: item.description!,
		descriptionHtml: item.description!,
		availableForSale:
			item.stock?.inventoryStatus === "IN_STOCK" ||
			item.stock?.inventoryStatus === "PARTIALLY_OUT_OF_STOCK",
		handle: item.slug!,
		images:
			item.media
				?.items!.filter((x) => x.image)
				.map((image) => ({
					url: image.image!.url!,
					altText: image.image?.altText! ?? "alt text",
					width: image.image?.width!,
					height: image.image?.height!,
				})) || [],
		priceRange: {
			minVariantPrice: {
				amount: String(item.price?.price!),
				currencyCode: item.price?.currency!,
			},
			maxVariantPrice: {
				amount: String(item.price?.price!),
				currencyCode: item.price?.currency!,
			},
		},
		options: (item.productOptions ?? []).map((option) => ({
			id: option.name ?? "",
			name: option.name ?? "",
			values: (option.choices ?? []).map((choice) =>
				getOptionChoiceLabel(option.optionType, choice)
			),
		})),
		featuredImage: {
			url: item.media?.mainMedia?.image?.url!,
			altText: item.media?.mainMedia?.image?.altText! ?? "alt text",
			width: item.media?.mainMedia?.image?.width!,
			height: item.media?.mainMedia?.image?.height!,
		},
		tags: [],
		variants: item.manageVariants
			? (item.variants?.map((variant) => ({
					id: variant._id!,
					title: item.name!,
					price: {
						amount: String(variant.variant?.priceData?.price ?? 0),
						currencyCode: variant.variant?.priceData?.currency ?? "",
					},
					availableForSale: variant.stock?.trackQuantity
						? (variant.stock.quantity ?? 0) > 0
						: true,
					selectedOptions: Object.entries(variant.choices ?? {}).map(
						([name, value]) => ({
							name,
							value,
						})
					),
				})) ?? [])
			: cartesian(
					item.productOptions?.map(
						(x) =>
							x.choices?.map((choice) => ({
								name: x.name ?? "",
								value: getOptionChoiceLabel(x.optionType, choice),
							})) ?? []
					) ?? []
				).map((selectedOptions) => ({
					id: "00000000-0000-0000-0000-000000000000",
					title: item.name!,
					price: {
						amount: String(item.price?.price ?? 0),
						currencyCode: item.price?.currency ?? "",
					},
					availableForSale: item.stock?.inventoryStatus === "IN_STOCK",
					selectedOptions,
				})),
		seo: {
			description: item.description!,
			title: item.name!,
		},
		updatedAt: item.lastUpdated?.toString()!,
	};
};
