// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { Translations } from '@nomercy-entertainment/nomercy-player-core';
import type { MediaSessionMetadata } from '@nomercy-entertainment/nomercy-player-core/plugins/media-session';

import type { NMVideoPlayer } from '../../index';
import type { VideoPlaylistItem } from '../../types';

import { translationsFromGlob } from '@nomercy-entertainment/nomercy-player-core';
import { MediaSessionPlugin as BaseMediaSession } from '@nomercy-entertainment/nomercy-player-core/plugins/media-session';

/**
 * Video-specific MediaSession integration. Overrides text metadata only —
 * artwork resolution lives in the kit base class and flows through
 * `resolveUrl(url, 'poster')`, which consults `baseImageUrl`.
 *
 * Fills `artist` with the show name and `album` with the season label so the
 * OS "Now Playing" surface shows TV-style metadata for series. Reads only
 * fields on the canonical `VideoPlaylistItem` (T). Consumers that carry
 * server-specific fields (e.g. `year`, `name`) should subclass and override
 * `getMetadata()` — do NOT cast to a richer intersection in this built-in.
 */
export class MediaSessionPlugin<T extends VideoPlaylistItem = VideoPlaylistItem> extends BaseMediaSession<T, NMVideoPlayer<T>> {
	static override readonly id: string = 'media-session';
	static override readonly translations: Translations = translationsFromGlob('./i18n/*.ts');

	protected override getMetadata(item: T): MediaSessionMetadata {
		const seasonText = item.season !== undefined && item.season !== null && String(item.season) !== ''
			? this.t('season', { season: String(item.season) })
			: '';
		return {
			title: item.title ?? '',
			artist: item.show ?? '',
			album: seasonText,
		};
	}
}

export const mediaSessionPlugin = MediaSessionPlugin;
