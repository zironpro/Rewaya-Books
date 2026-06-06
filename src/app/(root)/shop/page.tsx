import { Suspense } from "react";

import { Grid } from "@/components/layout/grid";

import ProductGridItems from "@/features/products/products-grid";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/wix";

export const metadata = {
	title: "Search",
	description: "Search for products in the store.",
};

interface SearchParamsProp {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SearchPage(props: SearchParamsProp) {
	return (
		<Suspense>
			<ShopPageContent searchParams={props.searchParams} />
		</Suspense>
	);
}

async function ShopPageContent(props: SearchParamsProp) {
	const searchParams = await props.searchParams;
	const { sort, q: searchValue } = searchParams as { [key: string]: string };
	const { sortKey, reverse } =
		sorting.find((item) => item.slug === sort) || defaultSort;

	const products = await getProducts({ sortKey, reverse, query: searchValue });
	const resultsText = products.length > 1 ? "results" : "result";
	return (
		<section className="container py-6">
			{searchValue ? (
				<p className="mb-4">
					{products.length === 0
						? "There are no products that match "
						: `Showing ${products.length} ${resultsText} for `}
					<span className="font-bold">&quot;{searchValue}&quot;</span>
				</p>
			) : null}
			{products.length > 0 ? (
				<Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					<ProductGridItems products={products} />
				</Grid>
			) : null}
		</section>
	);
}
