/**
 * Display-name helpers for track menu rows. Sidecar tracks arrive with raw
 * wire values (`language: 'eng'`, `type: 'full'`); the menu shows the
 * localized language name with the variant as a suffix — `English (Full)` —
 * matching the v1 player. Localization depends on the player's UI language,
 * so this is composed at render time, never stored on the track.
 */

import type { SubtitleTrackRef } from '../../types';

/**
 * Non-standard codes seen in media containers that `Intl.DisplayNames`
 * does not recognise. Standard ISO 639-2/B bibliographic codes (fre, ger,
 * chi, …) resolve natively.
 */
const ISO3_QUIRKS: Readonly<Record<string, string>> = {
	bra: 'pt-BR',
	pob: 'pt-BR',
};

/**
 * Localized display name for a language code (ISO 639-1/2 or BCP-47),
 * rendered in `locale`. Returns `null` when the runtime cannot resolve the
 * code — callers decide their own fallback.
 */
export function languageDisplayName(code: string | undefined, locale: string): string | null {
	if (!code)
		return null;
	const bcp47 = ISO3_QUIRKS[code] ?? code;
	try {
		const name = new Intl.DisplayNames([locale, 'en'], { type: 'language', fallback: 'none' }).of(bcp47);
		// Intl echoes unrecognised tags back unchanged — treat that as a miss.
		return (name && name !== bcp47 && name !== code) ? name : null;
	}
	catch {
		return null;
	}
}

/** Variants with a translation key in the plugin bundles. Anything else renders raw. */
const TRANSLATED_VARIANTS = new Set(['full', 'sign']);

/**
 * Menu row label for a subtitle track: `English (Full)`, `English (Sign)`,
 * `Nederlands (SDH)`. Falls back through variant-only → raw label →
 * language code → the provided default when fields are missing.
 */
export function subtitleTrackLabel(
	track: SubtitleTrackRef,
	locale: string,
	t: (key: string) => string,
	fallback: string,
): string {
	const langName = languageDisplayName(track.language, locale);

	const variant = track.type?.toLowerCase();
	let variantLabel: string | undefined;
	if (variant && TRANSLATED_VARIANTS.has(variant)) {
		const key = `plugin.desktop-ui.menu.subtitleType.${variant}`;
		const translated = t(key);
		// t() echoes the key back when no bundle carries it yet.
		variantLabel = translated === key ? track.type : translated;
	}
	else if (track.type) {
		variantLabel = track.type;
	}

	if (langName && variantLabel)
		return `${langName} (${variantLabel})`;
	if (langName)
		return langName;
	if (variantLabel)
		return variantLabel;
	return track.label || track.language || fallback;
}
