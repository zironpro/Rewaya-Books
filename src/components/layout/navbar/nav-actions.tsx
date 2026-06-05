"use client";

import { ComponentType, Suspense } from "react";

import Link from "next/link";

import { HeartIcon, ShoppingCartIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, buttonVariants } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";
import {
	Tooltip,
	TooltipCreateHandle,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import CartModal from "@/features/cart/components/cart-modal";
import { cn } from "@/lib/utils";

import { NavbarUser } from "./navbar-user";

const tooltipHandle = TooltipCreateHandle<ComponentType>();

const CartContent = () => {
	return <span>Cart</span>;
};

function CartTooltipTrigger() {
	return (
		<TooltipTrigger
			handle={tooltipHandle}
			payload={CartContent}
			render={
				<DrawerTrigger
					render={
						<Button
							className="bg-mauve-100/15 text-card hover:bg-mauve-50/25"
							variant="ghost"
						/>
					}
				/>
			}
		>
			<ShoppingCartIcon aria-hidden="true" className="size-4" weight="bold" />{" "}
			<span className="text-xs">Cart</span>
		</TooltipTrigger>
	);
}
const FavoritesContent = () => {
	return <span>Favorite book self</span>;
};

interface NavActionsProps {
	isLoggedIn: boolean;
	displayName?: string | null;
}

export const NavActions = ({ isLoggedIn, displayName }: NavActionsProps) => {
	return (
		<TooltipProvider delay={50}>
			{/* <LanguageSelector onValueChange={setLocale} value={locale} /> */}
			<NavbarUser
				displayName={displayName}
				handle={tooltipHandle}
				isLoggedIn={isLoggedIn}
			/>
			<TooltipTrigger
				className="after:absolute after:inset-s-full after:h-full after:w-1"
				handle={tooltipHandle}
				payload={FavoritesContent}
				render={
					<Link
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"bg-mauve-100/15 text-card hover:bg-mauve-50/25"
						)}
						href="/favorites"
					/>
				}
			>
				<HeartIcon aria-hidden="true" className="size-4" weight="bold" />{" "}
				<span className="text-xs">Wishlist</span>
			</TooltipTrigger>
			<Suspense
				fallback={
					<TooltipTrigger
						handle={tooltipHandle}
						payload={CartContent}
						render={
							<Button
								className="bg-mauve-100/15 text-card hover:bg-mauve-50/25"
								variant="ghost"
							/>
						}
					>
						<ShoppingCartIcon aria-hidden="true" className="size-4" />{" "}
						<span className="text-xs">Cart</span>
					</TooltipTrigger>
				}
			>
				<CartModal trigger={<CartTooltipTrigger />} />
			</Suspense>

			<Tooltip handle={tooltipHandle}>
				{({ payload: Payload }) => (
					<TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};
