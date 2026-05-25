"use client";

import type { ComponentType } from "react";

import type { Route } from "next";
import Link from "next/link";

import { UserIcon } from "@phosphor-icons/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { TooltipTrigger } from "@/components/ui/tooltip";

import { logout } from "@/features/account/actions/logout";

interface NavbarUserProps {
	handle: ReturnType<
		typeof import("@/components/ui/tooltip").TooltipCreateHandle<ComponentType>
	>;
	isLoggedIn: boolean;
	displayName?: string | null;
}

function ProfileTooltipContent({
	isLoggedIn,
	displayName,
}: {
	isLoggedIn: boolean;
	displayName?: string | null;
}) {
	if (!isLoggedIn) {
		return <span>Sign in</span>;
	}

	return (
		<div className="flex flex-col gap-2">
			<span>Signed in as {displayName}</span>
			<form action={logout}>
				<Button className="w-full" size="sm" type="submit" variant="outline">
					Sign out
				</Button>
			</form>
		</div>
	);
}

export function NavbarUser({
	handle,
	isLoggedIn,
	displayName,
}: NavbarUserProps) {
	const href = (isLoggedIn ? "/profile" : "/login") as Route;
	const label = isLoggedIn ? (displayName ?? "Profile") : "Sign in";

	return (
		<TooltipTrigger
			className="after:absolute after:inset-s-full after:h-full after:w-1"
			handle={handle}
			payload={() => (
				<ProfileTooltipContent
					displayName={displayName}
					isLoggedIn={isLoggedIn}
				/>
			)}
			render={
				<Link
					aria-label={label}
					className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
					href={href}
				/>
			}
		>
			<UserIcon aria-hidden="true" className="size-4" />
			<span className="sr-only">{label}</span>
		</TooltipTrigger>
	);
}
