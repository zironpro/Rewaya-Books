/** Read CMS field values whether the SDK nests them under `data` or flattens onto the item. */

const CMS_META_KEYS = new Set([
	"_id",
	"_owner",
	"_createdDate",
	"_updatedDate",
	"data",
	"id",
	"dataCollectionId",
]);

export function getCmsItemData(
	item: Record<string, unknown>
): Record<string, unknown> {
	const nested = item.data;
	if (nested && typeof nested === "object" && Object.keys(nested).length > 0) {
		return nested as Record<string, unknown>;
	}

	const flat: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(item)) {
		if (!CMS_META_KEYS.has(key)) flat[key] = value;
	}
	return flat;
}

export function readCmsField(
	data: Record<string, unknown>,
	...keys: string[]
): unknown {
	for (const key of keys) {
		if (data[key] != null) return data[key];
	}
	return undefined;
}
