"use client";

import { items } from "@wix/data";
import { currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import Cookies from "js-cookie";

const refreshToken = JSON.parse(Cookies.get("refreshToken")!);
const accessToken = JSON.parse(Cookies.get("accessToken")!);

export const wixClient = createClient({
	modules: {
		products,
		collections,
		currentCart,
		redirects,
		members,
		items,
	},
	auth: OAuthStrategy({
		clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID as string,
		tokens: {
			accessToken,
			refreshToken,
		},
	}),
});
