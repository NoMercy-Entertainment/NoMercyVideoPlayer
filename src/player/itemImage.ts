/**
 * Shared helper for reading the thumbnail/poster/image field from a playlist
 * item. Priority order: image → poster → thumbnail.
 *
 * Accepts `unknown` so it can be called from typed and untyped contexts alike
 * (e.g. event payloads arriving as `unknown` before narrowing).
 */
export function readItemImage(item: unknown): string | undefined {
	if (!item || typeof item !== 'object')
		return undefined;
	for (const key of ['image', 'poster', 'thumbnail'] as const) {
		if (key in item && typeof (item as Record<string, unknown>)[key] === 'string') {
			return (item as Record<string, unknown>)[key] as string;
		}
	}
	return undefined;
}
