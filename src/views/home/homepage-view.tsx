import { Collections } from "./components/collections-carousel";
import { FeaturedItems } from "./components/featured-items";
import { HeroBanners } from "./components/hero-banners";

export function HomepageView() {
	return (
		<main className="container py-4">
			<HeroBanners />
			<Collections />
			<FeaturedItems />
		</main>
	);
}
