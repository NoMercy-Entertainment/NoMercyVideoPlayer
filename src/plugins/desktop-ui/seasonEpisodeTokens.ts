// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Resolver for the playlist API's season/episode title tokens.
 *
 * `%S<n>` and `%E<n>` are escape-prefixed shorthands for the item's season and
 * episode numbers, embedded inside the title so the `%` guards against clashing
 * with literal text. They expand to the short, locale-aware prefix:
 *
 *   "%S1 %E1 - Now Is Not the End" → "S1 E1 - Now Is Not the End"   (en)
 *   "%S1 %E1 - Now Is Not the End" → "S1 A1 - Now Is Not the End"   (nl)
 *
 * The prefix letter is localized (Dutch episode is `A`, from "aflevering"),
 * which is why the label resolves through `t()` rather than a literal. Tokens
 * anywhere in the string are replaced; surrounding text is preserved verbatim.
 * A string with no tokens is returned unchanged.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

const TOKEN_RE = /%([SE])(\d+)/g;

/**
 * Replace every `%S<n>` and `%E<n>` token in `text` with the locale-aware short
 * label from `player.t()`. If `text` is empty the empty string is returned.
 */
export function resolveSeasonEpisodeTokens(
	player: IVideoPlayer<VideoPlaylistItem>,
	text: string,
): string {
	if (!text)
		return '';

	return text.replace(TOKEN_RE, (_match, kind: string, num: string) => {
		if (kind === 'S')
			return player.t('plugin.desktop-ui.token.season', { number: num });

		return player.t('plugin.desktop-ui.token.episode', { number: num });
	});
}
