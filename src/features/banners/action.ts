import { items } from "@wix/data";

import { getWixClient } from "@/lib/wix";
import { getWixImage, WixResolvedImage } from "@/lib/wix/helpers";

import { getCmsItemData, readCmsField } from "./record";

const HOME_BANNERS_COLLECTION = "HomeBanners";

export interface HomeBanner {
	id: string;
	title: string;
	subtitle?: string;
	ctaLabel?: string;
	ctaHref?: string;
	image: WixResolvedImage | undefined;
}

export async function getHomeBanners(): Promise<HomeBanner[]> {
	try {
		const { items: bannersData } = (await getWixClient()).use({ items });
		const { items: bannersRes } = await bannersData
			.query(HOME_BANNERS_COLLECTION)
			.eq("enabled", true)
			.limit(20)
			.find();

		const banners: HomeBanner[] = [];
		for (const item of bannersRes) {
			const data = getCmsItemData(item as Record<string, unknown>);
			const image = getWixImage(data.image as string);
			if (!image) continue;
			banners.push({
				id: item._id ?? String(readCmsField(data, "title") ?? ""),
				title: String(readCmsField(data, "title") ?? ""),
				subtitle: readCmsField(data, "subtitle") as string | undefined,
				ctaLabel: readCmsField(data, "ctaLabel") as string | undefined,
				ctaHref: readCmsField(data, "ctaHref") as string | undefined,
				image,
			});
		}
		return banners;
	} catch {
		return [];
	}
}
