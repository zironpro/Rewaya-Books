import { Fragment, Suspense } from "react";

import { Route } from "next";
import Link from "next/link";

import { TruckIcon } from "@phosphor-icons/react/dist/ssr";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import { getCollections } from "@/lib/wix";

export const CategoriesNavigation = () => {
	return (
		<nav
			aria-label="Categories"
			className="container flex h-10 w-full items-center gap-9"
		>
			<Carousel
				className="w-full min-w-0"
				opts={{
					dragFree: true,
					align: "start",
					containScroll: "trimSnaps",
					skipSnaps: false,
				}}
			>
				<CarouselContent className="-ms-1">
					<Suspense fallback={<CategoryNavListSkeleton />}>
						<CategoriesNavigationList />
					</Suspense>
				</CarouselContent>
				<CarouselNext size="icon-xs" />
				<CarouselPrevious size="icon-xs" />
			</Carousel>

			<div className="flex h-7 flex-1 shrink-0 basis-auto items-center gap-2 rounded-full border border-yellow-500 bg-yellow-300/20 px-2.5 text-yellow-700">
				<TruckIcon weight="fill" />
				<p
					className="text-[0.675rem] *:font-bold"
					data-text="Planning next moves"
				>
					Get <span>Free Delivery,</span> Orders Above <span>100AED</span>
				</p>
			</div>
		</nav>
	);
};

export const CategoriesNavigationList = async () => {
	const categories = await getCollections();

	return categories.map((category) => (
		<CarouselItem className="basis-auto ps-1" key={category.handle}>
			<Link
				className="flex h-7 items-center justify-center rounded-sm border border-transparent px-2.5 font-medium text-sm transition-colors duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] hover:border-border hover:bg-muted"
				href={category.path as Route}
			>
				{category.title}
			</Link>
		</CarouselItem>
	));
};

function CategoryNavListSkeleton() {
	return Array.from({ length: 6 }).map((_, i) => (
		<Fragment key={`skeleton-${i.toString()}`}>
			<CarouselItem className="basis-auto ps-1">
				<Skeleton className="h-8 w-12" />
			</CarouselItem>
			<CarouselItem className="basis-auto ps-1">
				<Skeleton className="h-8 w-24" />
			</CarouselItem>
			<CarouselItem className="basis-auto ps-1">
				<Skeleton className="h-8 w-16" />
			</CarouselItem>
			<CarouselItem className="basis-auto ps-1">
				<Skeleton className="h-8 w-14" />
			</CarouselItem>
		</Fragment>
	));
}
