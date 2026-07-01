// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Chapter navigation helpers for the desktop UI plugin.
 *
 * Owns: `findChapterTitle`, `previousChapter`, `nextChapter`.
 *
 * Chapter marker DOM construction lives in `progressBar.ts`
 * (`buildChapterMarkers`, `updateChapterProgress`, `updateChapterBuffer`,
 * `updateChapterHover`). This module adds the navigation and lookup
 * layer on top.
 *
 * Integration: called from `DesktopUiPlugin` — the class threads in the
 * player instance rather than exposing internals.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

/**
 * Find the title of the chapter whose range covers `time`.
 * Returns `undefined` when no chapter covers the position.
 */
export function findChapterTitle(
	player: IVideoPlayer<VideoPlaylistItem>,
	time: number,
): string | undefined {
	return player.chapters()
		.find(chapter => time >= chapter.start && time <= chapter.end)
		?.title;
}

/**
 * Seek to the start of the previous chapter relative to `time`.
 * If the current time is within the first second of a chapter, seeks to the
 * chapter before it. Falls back to time 0 when no earlier chapter exists.
 */
export function previousChapter(player: IVideoPlayer<VideoPlaylistItem>): void {
	const chapters = player.chapters();
	const t = player.time?.() ?? 0;
	for (let i = chapters.length - 1; i >= 0; i--) {
		if (chapters[i]!.start < t - 1) {
			void player.time?.(chapters[i]!.start);
			return;
		}
	}
	void player.time?.(0);
}

/**
 * Seek to the start of the next chapter relative to `time`.
 * No-ops when already past the last chapter boundary.
 */
export function nextChapter(player: IVideoPlayer<VideoPlaylistItem>): void {
	const chapters = player.chapters();
	const t = player.time?.() ?? 0;
	for (let i = 0; i < chapters.length; i++) {
		if (chapters[i]!.start > t + 1) {
			void player.time?.(chapters[i]!.start);
			return;
		}
	}
}
