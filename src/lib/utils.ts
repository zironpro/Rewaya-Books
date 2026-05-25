import { ReadonlyURLSearchParams } from "next/navigation";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "./env/server";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const baseUrl = process.env.SITE_URL
	? `${env.SITE_URL}`
	: "http://localhost:3000";

export const createUrl = (
	pathname: string,
	params: URLSearchParams | ReadonlyURLSearchParams
) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
	stringToCheck.startsWith(startsWith)
		? stringToCheck
		: `${startsWith}${stringToCheck}`;
