"use client";

import type React from "react";

import Link from "next/link";

import { ShoppingBagIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
} from "@/components/ui/drawer";

import { useCart } from "../context/cart-context";

export default function CartModal({
	trigger,
}: {
	trigger: React.ReactNode;
}) {
	const { cart, updateCartItem } = useCart();
	return (
		<Drawer position="right">
			{trigger}
			<DrawerPopup showCloseButton variant="straight">
				<DrawerHeader>
					<DrawerTitle>Cart {cart?.totalQuantity}</DrawerTitle>
				</DrawerHeader>
				<DrawerPanel>
					<nav className="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
						<DrawerClose
							nativeButton={false}
							render={
								<Button
									className="justify-start"
									render={<Link href="#" />}
									variant="ghost"
								/>
							}
						>
							Products
						</DrawerClose>
						<DrawerClose
							nativeButton={false}
							render={
								<Button
									className="justify-start"
									render={<Link href="#" />}
									variant="ghost"
								/>
							}
						>
							Profile
						</DrawerClose>
						<DrawerClose
							nativeButton={false}
							render={
								<Button
									className="justify-start"
									render={<Link href="#" />}
									variant="ghost"
								/>
							}
						>
							Settings
						</DrawerClose>
						<DrawerClose
							nativeButton={false}
							render={
								<Button
									className="justify-start"
									render={<Link href="#" />}
									variant="ghost"
								/>
							}
						>
							Sign out
						</DrawerClose>
					</nav>
				</DrawerPanel>
			</DrawerPopup>
		</Drawer>
	);
}

export function CartModalSkeleton() {
	return (
		<Button size="icon-lg" variant="ghost">
			<ShoppingBagIcon aria-hidden="true" className="size-4" />
		</Button>
	);
}
