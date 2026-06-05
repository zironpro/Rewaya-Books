import { items } from "@wix/data";

import { Button } from "@/components/ui/button";

import { getWixClient } from "@/lib/wix";
import { BOOK_BUNDLES_COLLECTION } from "@/lib/wix/constants";

export default async function BundleDetailPage(
	props: PageProps<"/bundles/[bundleId]">
) {
	const { params } = props;

	const { bundleId } = await params;
	const wixClient = (await getWixClient()).use(items);

	const item = await wixClient
		.query(BOOK_BUNDLES_COLLECTION)
		.include("bundleProducts")
		.eq("_id", bundleId)
		.limit(1)
		.find();

	const [product] = item.items;

	return (
		<div className="container">
			<h1>{product.title}</h1>
			<Button>Add to cart</Button>
		</div>
	);
}
