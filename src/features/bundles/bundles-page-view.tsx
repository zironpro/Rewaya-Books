import { items } from "@wix/data";

import { getWixClient } from "@/lib/wix";
import { BOOK_BUNDLES_COLLECTION } from "@/lib/wix/constants";

export const BundlesPageView = async () => {
	const wixClient = (await getWixClient()).use(items);

	const bundles = wixClient
		.query(BOOK_BUNDLES_COLLECTION)
		.include("bundleProducts")
		.limit(100)
		.find();

	return (
		<div className="container">
			<pre className="text-wrap text-sm">
				{JSON.stringify(bundles, null, 2)}
			</pre>
		</div>
	);
};
