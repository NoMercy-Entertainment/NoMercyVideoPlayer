/**
 * @module @nomercy-entertainment/nomercy-video-player/compat
 *
 * v1 compatibility shim for the video player. All deprecated names / fields
 * live here. v1 consumers import from `./compat` and use the re-exported
 * aliases or run items / config through the normalizer before handing them
 * to the v2 player.
 *
 * ```ts
 * import { nmplayer, normalizeVideoItem, applyVideoV1Compat } from
 *   '@nomercy-entertainment/nomercy-video-player/compat';
 *
 * const player = nmplayer('my-div');
 * player.setup(applyVideoV1Compat({ accessToken: () => store.token, ... }));
 * player.load(normalizeVideoItem(legacyItem));
 * ```
 */

import type { BasePlaylistItem } from '@nomercy-entertainment/nomercy-player-core';
import type { VideoPlayerConfig, VideoPlaylistItem } from './types';
import { normalizeVideoConfig } from './player/v1-config-normalizer';

export type { NMVideoPlayer } from './index';

// ── Factory aliases ───────────────────────────────────────────────────────────

// Canonical named export — same name as v2 public surface.
export { nmVideoPlayer } from './index';

// Re-export the v1 name so existing callers keep working.
export { nmplayer } from './index';

export { default } from './index';

// ── Deprecated item field shapes ──────────────────────────────────────────────

/** Track entry shape used in the legacy `tracks[]` field. */
export interface LegacyTrackRef {
	id?: number | string;
	kind?: string;
	file?: string;
	label?: string;
	language?: string;
}

/**
 * v1 `VideoPlaylistItem` shape with the deprecated `tracks` field.
 * Pass items through `normalizeVideoItem` before handing to the v2 player.
 */
export interface VideoPlaylistItemV1Compat extends VideoPlaylistItem {
	/**
	 * @deprecated Use the typed fields (`subtitles`, `chapters`,
	 * `previewSpriteUrl`, `fonts`) instead. `tracks` was removed from
	 * `VideoPlaylistItem` in v2.
	 *
	 * The normalizer maps `tracks` entries to their typed counterparts based
	 * on the `kind` field: `'subtitles'` → `subtitles[]`, `'chapters'` →
	 * `chapters[]`, `'fonts'` → `fonts[]`. Unrecognised kinds are silently
	 * dropped.
	 */
	tracks?: LegacyTrackRef[];
}

/**
 * Normalise a v1 `VideoPlaylistItem` with the deprecated `tracks[]` field to
 * the v2 canonical shape. Safe on already-normalised items — existing typed
 * fields are never overwritten.
 */
export function normalizeVideoItem<T extends VideoPlaylistItemV1Compat>(item: T): Omit<T, 'tracks'> & VideoPlaylistItem {
	const result = { ...item } as Record<string, unknown>;
	const legacyTracks = item.tracks;

	if (legacyTracks && legacyTracks.length > 0) {
		// Subtitle tracks — kind === 'subtitles' or no kind but has language/label.
		const subtitleEntries = legacyTracks.filter(t => !t.kind || t.kind === 'subtitles' || t.kind === 'text');
		if (subtitleEntries.length > 0 && result.subtitles === undefined) {
			result.subtitles = subtitleEntries.map(t => ({
				id: t.id,
				file: t.file,
				label: t.label,
				language: t.language,
			}));
		}

		// Chapter tracks — kind === 'chapters'.
		const chapterEntries = legacyTracks.filter(t => t.kind === 'chapters');
		if (chapterEntries.length > 0 && result.chapters === undefined) {
			// Chapters need a VTT URL — promote the file field to previewSpriteUrl
			// when kind is exactly 'chapters'. Consumers should prefer the typed
			// fields but this preserves runtime data.
			const first = chapterEntries[0];
			if (first?.file && result.previewSpriteUrl === undefined) {
				result.previewSpriteUrl = first.file;
			}
		}

		// Font tracks — kind === 'fonts'.
		const fontEntries = legacyTracks.filter(t => t.kind === 'fonts');
		if (fontEntries.length > 0 && result.fonts === undefined) {
			result.fonts = fontEntries.map(t => ({
				file: t.file ?? '',
				label: t.label,
			}));
		}
	}

	delete result.tracks;

	return result as Omit<T, 'tracks'> & VideoPlaylistItem;
}

// ── Config normalizer ─────────────────────────────────────────────────────────

/**
 * Normalise a v1 video player config to the v2 `VideoPlayerConfig` shape.
 * Applies the kit-level normalizer (accessToken, debug) on top.
 */
export function applyVideoV1Compat<T extends BasePlaylistItem = VideoPlaylistItem>(
	config: VideoPlayerConfig<T> & { accessToken?: string | (() => string); debug?: boolean },
): VideoPlayerConfig<T> {
	return normalizeVideoConfig(config);
}
