import Link from "next/link";

import { GridItem } from "@/components/layout/grid";

import { Product } from "@/lib/wix/types";

import { GridTileImage } from "./tile";

export default function ProductGridItems({
	products,
}: {
	products: Product[];
}) {
	return (
		<>
			{products.map((product) => (
				<GridItem className="animate-fadeIn" key={product.handle}>
					<Link
						className="relative inline-block h-full w-full"
						href={`/product/${product.handle}`}
						prefetch={true}
					>
						<GridTileImage
							alt={product.title}
							fill
							label={{
								title: product.title,
								amount: product.priceRange.maxVariantPrice.amount,
								currencyCode: product.priceRange.maxVariantPrice.currencyCode,
							}}
							sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
							src={product.featuredImage?.url}
						/>
					</Link>
				</GridItem>
			))}
		</>
	);
}
