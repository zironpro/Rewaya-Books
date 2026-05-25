"use client";

import { ComponentType, Suspense } from "react";

import Link from "next/link";

import { UserIcon } from "@phosphor-icons/react";
import { HeartIcon, ShoppingBagIcon } from "@phosphor-icons/react/dist/ssr";

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
				<DrawerTrigger render={<Button size="icon-lg" variant="ghost" />} />
			}
		>
			<ShoppingBagIcon aria-hidden="true" className="size-4" />
		</TooltipTrigger>
	);
}
const FavoritesContent = () => {
	return <span>Favorite book self</span>;
};
const ProfileContent = () => {
	return <span>Profile</span>;
};

export const NavActions = () => {
	return (
		<TooltipProvider delay={50}>
			<div className="flex justify-end gap-1 md:w-1/3">
				{/* <LanguageSelector onValueChange={setLocale} value={locale} /> */}
				<TooltipTrigger
					className="after:absolute after:inset-s-full after:h-full after:w-1"
					handle={tooltipHandle}
					payload={ProfileContent}
					render={
						<Link
							className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
							href="/profile"
						/>
					}
				>
					<UserIcon aria-hidden="true" className="size-4" />
					<span className="sr-only">Profile</span>
				</TooltipTrigger>
				<TooltipTrigger
					className="after:absolute after:inset-s-full after:h-full after:w-1"
					handle={tooltipHandle}
					payload={FavoritesContent}
					render={
						<Link
							className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
							href="/favorites"
						/>
					}
				>
					<HeartIcon aria-hidden="true" className="size-4" />
				</TooltipTrigger>
				<Suspense
					fallback={
						<TooltipTrigger
							handle={tooltipHandle}
							payload={CartContent}
							render={<Button size="icon-lg" variant="ghost" />}
						>
							<ShoppingBagIcon aria-hidden="true" className="size-4" />
						</TooltipTrigger>
					}
				>
					<CartModal trigger={<CartTooltipTrigger />} />
				</Suspense>
			</div>

			<Tooltip handle={tooltipHandle}>
				{({ payload: Payload }) => (
					<TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};
