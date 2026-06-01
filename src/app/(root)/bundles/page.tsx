import { Suspense } from "react";

import { BundlesPageView } from "@/features/bundles/bundles-page-view";

export default function BundlesPage() {
	return (
		<Suspense>
			<BundlesPageView />;
		</Suspense>
	);
}
