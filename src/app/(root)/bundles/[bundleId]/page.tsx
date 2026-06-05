import { items } from "@wix/data";

import { Button } from "@/components/ui/button";

import { getWixClient } from "@/lib/wix";
import { BOOK_BUNDLES_COLLECTION } from "@/lib/wix/constants";
import { useTransition } from "react";
import { currentCart } from "@wix/ecom";

export default async function BundleDetailPage(
	props: PageProps<"/bundles/[bundleId]">
) {
	const { params } = props;
    const [isPending, startTransition] = useTransition()

	const { bundleId } = await params;
	const wixClient = (await getWixClient()).use(items);

	const item = await wixClient
		.query(BOOK_BUNDLES_COLLECTION)
		.include("bundleProducts")
		.eq("_id", bundleId)
		.limit(1)
		.find();

	const [product] = item.items;

    function handleAddToCart() {
        startTransition(async () => {
            const {addToCurrentCart} = (await getWixClient()).use(currentCart); 
            const {cart} = await addToCurrentCart() 
        })
    }

	return (
		<div className="container">
			<h1>{product.title}</h1>
			<Button onClick={handleAddToCart} disabled={isPending}>Add to cart</Button>
		</div>
	);
}
