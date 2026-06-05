import { Suspense } from "react";

import Link from "next/link";

import { Logo } from "@/assets/logo";

import { CategoriesNavigation } from "./categories-navigations";
import { LanguageSelector } from "./language-selector";
import { NavActions } from "./nav-actions";
import { NavbarAuthActions } from "./navbar-auth-actions";
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
		<header className="sticky inset-x-0 top-0 z-40 bg-card/85 shadow-xs backdrop-blur-lg supports-backdrop-blur:bg-card">
			<div className="relative h-14 border-b bg-mauve-800">
				<div className="container flex h-full w-full items-center gap-4 md:gap-8">
					<div className="flex w-full md:w-1/3">
						<Link href="/" prefetch={true}>
							<Logo isDark />
						</Link>
					</div>

					<NavbarSearch showSearch={showSearch} />

					<div className="flex justify-end gap-1 md:w-1/3">
						<LanguageSelector className="border border-mauve-200/20 bg-mauve-950 text-card" />
						<Suspense fallback={<NavActionsFallback />}>
							<NavbarAuthActions />
						</Suspense>
					</div>
				</div>
				<div className="absolute top-[calc(100%+1px)] left-0 size-4 rounded-br-full bg-inherit [corner-shape:scoop]" />
				<div className="absolute top-[calc(100%+1px)] right-0 size-4 rounded-bl-full bg-inherit [corner-shape:scoop]" />
			</div>

			{showCategories && <CategoriesNavigation />}
		</header>
	);
}

function NavActionsFallback() {
	return <NavActions displayName={null} isLoggedIn={false} />;
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
