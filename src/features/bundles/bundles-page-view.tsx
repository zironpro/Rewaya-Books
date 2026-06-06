import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { items } from "@wix/data";

import { getWixClient } from "@/lib/wix";
import { BOOK_BUNDLES_COLLECTION } from "@/lib/wix/constants";
import { getWixImage } from "@/lib/wix/helpers";

export const BundlesPageView = async () => {
	const wixClient = (await getWixClient()).use(items);

	const bundles = await wixClient
		.query(BOOK_BUNDLES_COLLECTION)
		.include("bundleProducts")
		.limit(2)
		.find();

	return (
		<div className="container">
			{/* <pre className="text-wrap text-xs">
				{JSON.stringify(bundles, null, 4)}
			</pre> */}
			<div className="grid grid-cols-4 gap-6">
				{bundles.items.map((item) => {
					const image = getWixImage(item.image);

					return (
						<div key={item._id}>
							<Link href={`/bundles/${item._id}` as Route}>
								<div className="relative aspect-4/5 bg-card">
									{image ? (
										<Image
											alt={image.altText ?? String(item.title ?? "")}
											fill
											sizes="(max-width: 768px) 50vw, 25vw"
											src={image.url}
										/>
									) : null}
								</div>
								{item.title}
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};
