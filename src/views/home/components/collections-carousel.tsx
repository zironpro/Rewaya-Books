import { Suspense } from "react";

import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import { getCollections } from "@/features/collections";

export const Collections = () => {
	return (
		<Suspense fallback={<CollectionsSkeleton />}>
			<CollectionsCarousel />
		</Suspense>
	);
};

function CollectionsSkeleton() {
	const collections = Array.from({ length: 12 }).flatMap((_, i) => [
		{
			id: i,
			title: `skeleton-${i}`,
		},
	]);

	return (
		<Carousel
			className="w-full py-9"
			opts={{ align: "start", dragFree: true, loop: false }}
		>
			<CarouselContent carouselFade>
				{collections.map((cat) => (
					<CarouselItem className="basis-auto" key={cat.id}>
						<Skeleton className="mb-2 size-32 rounded-sm md:size-48" />
						<Skeleton className="mx-auto h-6 w-24" />
					</CarouselItem>
				))}
			</CarouselContent>

			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

async function CollectionsCarousel() {
	const collections = await getCollections();

	return (
		<Carousel
			className="w-full py-9"
			opts={{ align: "start", dragFree: true, loop: false }}
		>
			<CarouselContent carouselFade>
				{collections.map((cat) => (
					<CarouselItem className="basis-auto" key={cat.handle}>
						<Link
							className="group flex flex-col items-center gap-2"
							href={cat.path as Route}
						>
							<div className="relative mx-auto size-32 overflow-hidden rounded-sm border-2 border-card bg-card transition-all group-hover:border-primary group-hover:shadow-200 md:size-48">
								<Image
									alt={cat.title!}
									className="object-cover transition-transform duration-700 group-hover:scale-110"
									fill
									sizes="(max-width: 768px) 128px, 192px"
									src={cat.image!}
								/>
							</div>
							<span className="text-center font-semibold text-muted-foreground transition-colors group-hover:text-primary">
								{cat.title}
							</span>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>

			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
