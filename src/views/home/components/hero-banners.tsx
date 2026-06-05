import { Suspense } from "react";

import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import { getHomeBanners } from "@/features/banners/action";

export const HeroBanners = () => {
	return (
		<section className="grid md:grid-cols-[1fr_.55fr] md:gap-4">
			<Suspense fallback={<BannersCarouselSkeleton />}>
				<BannersCarousel />
			</Suspense>
			<div className="relative hidden overflow-hidden rounded-md bg-card shadow-200 md:block">
				<Image
					alt=""
					className="object-cover"
					fill
					src="/banners/bundles-hero.webp"
				/>
			</div>
		</section>
	);
};

async function BannersCarousel() {
	const banners = await getHomeBanners();
	return (
		<Carousel className="group size-full overflow-hidden rounded-md bg-card shadow-200">
			<CarouselContent className="ms-0 h-full">
				{banners.map((banner) => (
					<CarouselItem className="relative h-56 ps-0 md:h-110" key={banner.id}>
						<div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
							<h2 className="font-bold font-display text-2xl uppercase md:text-4xl">
								{banner.title}
							</h2>
							<p className="mb-2 max-w-2xs text-balance text-sm md:text-base lg:text-lg">
								{banner.subtitle}
							</p>
							<Button
								render={<Link href={banner.ctaHref as Route} />}
								size="lg"
							>
								{banner.ctaLabel}
							</Button>
						</div>
						<Image
							alt={banner.image?.altText!}
							className="object-cover"
							fill
							src={banner.image?.url!}
						/>
					</CarouselItem>
				))}
			</CarouselContent>

			<CarouselPrevious className="inset-s-3 -translate-x-12 bg-card transition-transform group-hover:translate-x-0" />
			<CarouselNext className="inset-e-3 translate-x-12 bg-card transition-transform group-hover:translate-x-0" />
		</Carousel>
	);
}

function BannersCarouselSkeleton() {
	return (
		<div className="flex h-56 flex-col items-center justify-center rounded-md bg-card shadow-200 md:h-110">
			<Skeleton className="h-10 w-48" />
			<Skeleton className="mb-2 h-6 w-64" />
			<Button className="w-32" size="lg">
				Loading...
			</Button>
		</div>
	);
}
