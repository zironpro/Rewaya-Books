import { ReadonlyURLSearchParams } from "next/navigation";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const baseUrl = process.env.SITE_URL
	? `https://${process.env.SITE_URL}`
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

export const validateEnvironmentVariables = () => {
	const requiredEnvironmentVariables = ["WIX_CLIENT_ID"];
	const missingEnvironmentVariables = [] as string[];

	requiredEnvironmentVariables.forEach((envVar) => {
		if (!process.env[envVar]) {
			missingEnvironmentVariables.push(envVar);
		}
	});

	if (missingEnvironmentVariables.length) {
		throw new Error(
			"The following environment variables are missing. Your site will not work without them."
		);
	}
};
