// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { ChromeCastMediaCtors, Translations } from '@nomercy-entertainment/nomercy-player-core';
import type { NMVideoPlayer } from '../../index';
import type { VideoPlaylistItem } from '../../types';
import { CastSenderPlugin as BaseCastSenderPlugin, translationsFromGlob } from '@nomercy-entertainment/nomercy-player-core';

export type { CastSenderEvents, CastSenderOptions } from '@nomercy-entertainment/nomercy-player-core';

/** Mutable subset of the Cast SDK `MediaMetadata` this plugin writes. */
interface CastMediaMetadata extends Record<string, unknown> {
	title?: string;
	seriesTitle?: string;
	subtitle?: string;
	season?: number;
	episode?: number;
	images?: Array<{ url: string }>;
}

/**
 * Video Cast sender — thin override of the kit's shared `CastSenderPlugin`.
 * Specializes only the bits that differ between music and video:
 *   - `'video/mp4'` default content type
 *   - `TvShowMediaMetadata` (when `item.show` is set) or
 *     `GenericMediaMetadata` builder reading `title` / `show` / `season` /
 *     `episode` / `poster` from the video item shape.
 *
 * Translations are auto-discovered from the `./i18n/*.ts` folder. Each file
 * default-exports its language bundle. Each plugin in the chain (kit base,
 * this subclass) ships ONLY its own keys — the kit's plugin registration
 * walks the prototype chain so both bundles end up in the table.
 *
 * Everything else — SDK probe, session lifecycle, RemotePlayer event
 * mirroring, forward* helpers, resume-on-disconnect — lives in the kit.
 */
export class CastSenderPlugin<T extends VideoPlaylistItem = VideoPlaylistItem> extends BaseCastSenderPlugin<NMVideoPlayer<T>, T> {
	static override readonly id: string = 'cast-sender';
	static override readonly description: string = 'Chromecast sender — full media bridge for video';
	static override readonly translations: Translations = translationsFromGlob('./i18n/*.ts');

	/** Returns `'video/mp4'` as the default content type for video items. */
	protected override defaultContentType(): string {
		return 'video/mp4';
	}

	/** Builds a `TvShowMediaMetadata` or `GenericMediaMetadata` from the video item. */
	protected override async buildMetadata(
		item: T,
		ctors: ChromeCastMediaCtors & {
			TvShowMediaMetadata?: new () => CastMediaMetadata;
			MovieMediaMetadata?: new () => CastMediaMetadata;
		},
	): Promise<unknown> {
		const isEpisode = item.show !== undefined && item.show !== '';
		const MetadataCtor: new () => CastMediaMetadata = isEpisode
			? (ctors.TvShowMediaMetadata ?? ctors.GenericMediaMetadata)
			: ctors.GenericMediaMetadata;
		const meta = new MetadataCtor();

		meta.title = item.title ?? '';
		if (isEpisode) {
			meta.seriesTitle = item.show;
			if (item.season !== undefined)
				meta.season = Number(item.season);
			if (item.episode !== undefined)
				meta.episode = Number(item.episode);
		}
		else if (item.show) {
			meta.subtitle = item.show;
		}
		// Same order the rest of the kit reads cover art in: `image` is the
		// cross-library canonical field, `poster` and `thumbnail` are the video
		// aliases. Reading `poster` alone left a consumer who populated only
		// `image` with lock-screen artwork and a blank cast receiver.
		const artwork = item.image ?? item.poster ?? item.thumbnail;
		if (artwork) {
			const posterUrl = (await this.resolveUrl(artwork, 'poster')).href;
			meta.images = [{ url: posterUrl }];
		}
		return meta;
	}
}

/** Plugin alias for the video {@link CastSenderPlugin}. Pass to `addPlugin(castSenderPlugin)`. */
export const castSenderPlugin = CastSenderPlugin;
