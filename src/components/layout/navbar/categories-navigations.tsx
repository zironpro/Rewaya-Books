import { Fragment, Suspense } from "react";

import { Route } from "next";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

import { getCollections } from "@/lib/wix";

export const CategoriesNavigation = () => {
	return (
		<nav aria-label="Categories" className="h-10 border-b">
			<ul className="container flex h-full items-center gap-1 overflow-hidden">
				<Suspense fallback={<CategoryNavListSkeleton />}>
					<CategoriesNavigationList />
				</Suspense>
			</ul>
		</nav>
	);
};

export const CategoriesNavigationList = async () => {
	const categories = await getCollections();

	return categories.map((category) => (
		<li className="shrink-0" key={category.handle}>
			<Link
				className="flex h-8 items-center justify-center rounded-sm px-3 font-medium text-sm transition-colors duration-400 ease-[cubic-bezier(0.33,1,0.68,1)] hover:bg-muted"
				href={category.path as Route}
			>
				{category.title}
			</Link>
		</li>
	));
};

function CategoryNavListSkeleton() {
	return Array.from({ length: 6 }).map((_, i) => (
		<Fragment key={`skeleton-${i.toString()}`}>
			<li className="shrink-0">
				<Skeleton className="h-8 w-12" />
			</li>
			<li className="shrink-0">
				<Skeleton className="h-8 w-24" />
			</li>
			<li className="shrink-0">
				<Skeleton className="h-8 w-16" />
			</li>
			<li className="shrink-0">
				<Skeleton className="h-8 w-14" />
			</li>
		</Fragment>
	));
}
