import { Suspense } from "react";

import Link from "next/link";

import { Logo } from "@/assets/logo";

import { CategoriesNavigation } from "./categories-navigations";
import { NavActions } from "./nav-actions";
import SearchForm, { SearchSkeleton } from "./search";

interface NavbarProps {
	showCategories?: boolean;
	showSearch?: boolean;
}

export async function Navbar({
	showCategories = true,
	showSearch = true,
}: NavbarProps) {
	return (
		<header className="sticky inset-x-0 top-0 z-40 bg-white shadow-xs">
			<div className="h-14 border-b">
				<div className="container flex h-full w-full items-center gap-4 md:gap-8">
					<div className="flex w-full md:w-1/3">
						<Link href="/" prefetch={true}>
							<Logo />
						</Link>
					</div>

					<NavbarSearch showSearch={showSearch} />

					<NavActions />
				</div>
			</div>

			{showCategories && <CategoriesNavigation />}
		</header>
	);
}

function NavbarSearch({ showSearch = true }: { showSearch?: boolean }) {
	if (!showSearch) return null;

	return (
		<div className="hidden justify-center md:flex md:w-1/3">
			<Suspense fallback={<SearchSkeleton />}>
				<SearchForm />
			</Suspense>
		</div>
	);
}
