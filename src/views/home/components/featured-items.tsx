import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import { CountdownTimer } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@/components/ui/frame";

import { getBundles } from "@/features/bundles";
import { getWixImage } from "@/lib/wix/helpers";

const FEATURED_DEALS = [
	{
		id: "1",
		title: "Bundles",
		description: "One cart, one great price",
		image: "/images/bundles-cover.webp",
		href: "/bundles",
	},
	{
		id: "2",
		title: "New Arrivals",
		description: "The latest, curated for you",
		image: "/images/new-arrivals.webp",
		href: "/shop",
	},
	{
		id: "3",
		title: "Stories Inspire",
		description: "Get Inspired",
		image: "/images/stories-inspire.webp",
		href: "/shop",
	},
	{
		id: "4",
		title: "Kids Deals",
		description: "Shop from our top shelf",
		image: "/images/kids-deals.webp",
		href: "/shop",
	},
] as const;

export function FeaturedItems() {
	return (
		<section className="grid gap-4 sm:grid-cols-3">
			<Frame className="w-full">
				<FrameHeader>
					<FrameTitle>
						<h3 className="font-display text-xl">
							Stick together for best value
						</h3>
					</FrameTitle>
				</FrameHeader>
				<FramePanel className="grid grid-cols-2 gap-3">
					{FEATURED_DEALS.map((item) => (
						<Link
							className="overflow-hidden rounded-md bg-muted shadow-100 transition-[box-shadow_scale] hover:scale-105 hover:shadow-400"
							href={item.href}
							key={item.id}
						>
							<div className="relative aspect-square w-full">
								<Image
									alt=""
									className="rounded-sm object-cover object-left"
									fill
									src={item.image}
								/>
							</div>
							<h4 className="px-2 py-1.5 font-bold font-display text-xl">
								{item.description}
							</h4>
						</Link>
					))}
				</FramePanel>
			</Frame>
			<Frame className="w-full">
				<FrameHeader className="flex flex-row items-center justify-between">
					<FrameTitle>
						<h3 className="font-display text-xl">Bundle Deals</h3>
					</FrameTitle>
					<CountdownTimer />
					<Button variant="secondary">All Bundle</Button>
				</FrameHeader>
				<FramePanel className="grid grid-cols-2 gap-3">
					<Suspense>
						<BundleDealsItem />
					</Suspense>
				</FramePanel>
			</Frame>
			<div className="grid grid-rows-3 gap-4">
				<div className="group relative flex h-full w-full items-center overflow-hidden rounded-md shadow-100">
					<div className="relative z-1 max-w-2xs p-6">
						<Badge
							className="border-primary text-primary group-hover:border-solid"
							variant="outline"
						>
							Special Release
						</Badge>
						<h3 className="mt-2 mb-4 font-display font-semibold text-3xl text-primary">
							Nurturing the Next Generation of Seekers
						</h3>
						<Button>Shop children's book</Button>
					</div>
					<Image
						alt=""
						className="object-cover object-right"
						fill
						src="/banners/kids-banner.webp"
					/>
				</div>
				<div className="group relative row-span-2 flex h-full w-full items-center overflow-hidden rounded-md shadow-100">
					<div className="relative z-1 max-w-2xs p-6">
						<Badge
							className="border-primary text-primary group-hover:border-solid"
							variant="outline"
						>
							Special Release
						</Badge>
						<h3 className="mt-2 mb-4 font-display font-semibold text-3xl text-primary">
							Nurturing the Next Generation of Seekers
						</h3>
						<Button>Shop children's book</Button>
					</div>
					<Image
						alt=""
						className="object-cover object-right"
						fill
						src="/banners/kids-banner.webp"
					/>
				</div>
			</div>
		</section>
	);
}

async function BundleDealsItem() {
	const bundles = await getBundles();

	console.log("bundles", bundles);
	return bundles.map((item) => (
		<div
			className="overflow-hidden rounded-md bg-muted shadow-100 transition-[box-shadow_scale] hover:scale-105 hover:shadow-400"
			key={item._id}
		>
			<div className="relative flex aspect-square w-full items-end justify-end p-3">
				<div className="relative z-10 flex flex-col items-center justify-center rounded-sm border border-card bg-card/90 p-2 shadow-100 backdrop-blur-md">
					<p className="text-center text-xs leading-3">
						<span className="font-medium">{item.bundleProducts.length}</span>{" "}
						Books
					</p>
				</div>
				<Image
					alt=""
					className="rounded-sm object-cover"
					fill
					src={getWixImage(item.image)?.url!}
				/>
			</div>
			<h4 className="line-clamp-1 px-2 py-1.5 font-bold font-display text-xl">
				{item.title}
			</h4>
		</div>
	));
}
