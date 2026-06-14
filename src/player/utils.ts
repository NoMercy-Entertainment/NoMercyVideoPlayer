/**
 * @module player/utils — utility function re-exports for backward compatibility.
 *
 * The subpath export `./player/utils` in `package.json` points here so
 * consumer imports from that path continue to resolve without source changes
 * during the migration window.
 *
 * @deprecated Import utilities from the package root in new code.
 */

export {
	convertToSeconds,
	humanTime,
	limitSentenceByCharacters,
	lineBreakShowTitle,
} from '../index';

/**
 * Convert a string to Title Case.
 * @deprecated Import from your own codebase in new code.
 */
export function toTitleCase(str: string, locale?: string): string {
	return str
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toLocaleUpperCase(locale) + word.slice(1))
		.join(' ');
}

/**
 * Return a de-duplicated array, preserving order on a given key.
 * @deprecated Import from your own codebase in new code.
 */
export function unique<T>(array: ReadonlyArray<T>, key: string): T[] {
	const seen = new Set<unknown>();
	return array.filter((item) => {
		const value = (item as Record<string, unknown>)[key];
		if (seen.has(value))
			return false;
		seen.add(value);
		return true;
	});
}
