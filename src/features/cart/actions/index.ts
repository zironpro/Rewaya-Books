import { currentCart } from "@wix/ecom";

import { getWixClient } from "@/lib/wix";
import { getApplicationErrorCode, reshapeCart } from "@/lib/wix/helpers";
import { Cart, ProductVariant } from "@/lib/wix/types";

export async function addToCart(
	lines: { productId: string; variant?: ProductVariant; quantity: number }[]
): Promise<Cart> {
	const { addToCurrentCart } = (await getWixClient()).use(currentCart);
	const { cart } = await addToCurrentCart({
		lineItems: lines.map(({ productId, variant, quantity }) => ({
			catalogReference: {
				catalogItemId: productId,
				appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
				...(variant && {
					options:
						variant.id === "00000000-0000-0000-0000-000000000000"
							? {
									options: variant.selectedOptions.reduce(
										(
											acc: Record<string, string>,
											option: { name: string; value: string }
										) => ({
											...acc,
											[option.name!]: option.value!,
										}),
										{} as Record<string, string>
									),
								}
							: { variantId: variant?.id },
				}),
			},
			quantity,
		})),
	});

	return reshapeCart(cart!);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
	const { removeLineItemsFromCurrentCart } = (await getWixClient()).use(
		currentCart
	);

	const { cart } = await removeLineItemsFromCurrentCart(lineIds);

	return reshapeCart(cart!);
}

export async function updateCart(
	lines: { id: string; quantity: number }[]
): Promise<Cart> {
	const { updateCurrentCartLineItemQuantity } = (await getWixClient()).use(
		currentCart
	);

	const { cart } = await updateCurrentCartLineItemQuantity(
		lines.map(({ id, quantity }) => ({
			id: id,
			quantity,
		}))
	);

	return reshapeCart(cart!);
}

export async function getCart(): Promise<Cart | undefined> {
	const { getCurrentCart } = (await getWixClient()).use(currentCart);
	try {
		const cart = await getCurrentCart();

		return reshapeCart(cart);
	} catch (error) {
		if (getApplicationErrorCode(error) === "OWNED_CART_NOT_FOUND") {
			return undefined;
		}
	}
}
