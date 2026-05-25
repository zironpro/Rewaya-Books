export type SortKey = "name" | "lastUpdated" | "price";

export type SortFilterItem = {
	title: string;
	slug: string | null;
	sortKey: SortKey;
	reverse: boolean;
};

export const defaultSort: SortFilterItem = {
	title: "Name",
	slug: null,
	sortKey: "name",
	reverse: false,
};

export const sorting: SortFilterItem[] = [
	defaultSort,
	{
		title: "Latest arrivals",
		slug: "latest-desc",
		sortKey: "lastUpdated",
		reverse: true,
	},
	{
		title: "Price: Low to high",
		slug: "price-asc",
		sortKey: "price",
		reverse: false,
	}, // asc
	{
		title: "Price: High to low",
		slug: "price-desc",
		sortKey: "price",
		reverse: true,
	},
];

export const HIDDEN_PRODUCT_TAG = "rewaya-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const WIX_SESSION_COOKIE = "rewaya-session";
export const AUTH_RETURN_TO_PARAM = "returnTo";
export const WIX_OAUTH_STORAGE_KEY = "rewaya-wix-oauth";
export const LOGIN_CALLBACK_PATH = "/login/callback";
