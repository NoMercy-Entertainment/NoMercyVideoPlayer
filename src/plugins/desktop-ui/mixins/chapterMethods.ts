// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Chapter-rendering mixin — duration resolution, chapter-marker DOM rebuild,
 * and per-frame progress/buffer/hover updates.
 *
 * `progressBar.ts` and `chapters.ts` own the pure free functions; this mixin
 * binds them to the plugin's sliderRefs, chapterRefs, player, and
 * cachedDuration fields.
 *
 * Owns: resolveDuration, refreshChaptersAndDuration, renderChapterMarkers,
 *       updateChapterProgress, updateChapterBuffer, updateChapterHover,
 *       findChapterTitle, previousChapter, nextChapter.
 */

import type { DesktopUiInternals } from './internals';

import { findChapterTitle, nextChapter, previousChapter } from './chapters';
import {
	buildChapterMarkers,
	updateChapterBuffer,
	updateChapterHover,
	updateChapterProgress,
} from './progressBar';

export const chapterMethods = {
	resolveDuration(this: DesktopUiInternals): number {
		const fromPlayer = this.player.duration?.() ?? 0;
		if (fromPlayer > 0)
			return fromPlayer;
		if (this.cachedDuration > 0)
			return this.cachedDuration;
		const el = this.player.videoElement;
		return Number.isFinite(el?.duration) ? (el!.duration ?? 0) : 0;
	},

	refreshChaptersAndDuration(this: DesktopUiInternals): void {
		const dur = this.player.duration?.() ?? 0;
		if (dur)
			this.applyDuration(dur);
		this.renderChapterMarkers();
	},

	/** Rebuild the segmented chapter-marker DOM for the current item. */
	renderChapterMarkers(this: DesktopUiInternals): void {
		const chapters = this.player.chapters();
		const dur = this.resolveDuration();

		if (!dur || chapters.length === 0) {
			this.sliderRefs.sliderBar.classList.remove('has-chapters');
		}
		else {
			this.sliderRefs.sliderBar.classList.add('has-chapters');
		}

		this.chapterRefs = buildChapterMarkers(
			this.sliderRefs.chapterBar,
			chapters,
			dur,
			(index) => { void this.player.seekToChapter?.(index); },
			this.listen.bind(this),
		);
	},

	updateChapterProgress(this: DesktopUiInternals, percentage: number): void {
		updateChapterProgress(this.chapterRefs, percentage);
	},

	updateChapterBuffer(this: DesktopUiInternals, bufferedPct: number): void {
		updateChapterBuffer(this.chapterRefs, bufferedPct);
	},

	updateChapterHover(this: DesktopUiInternals, scrubPct: number): void {
		updateChapterHover(this.chapterRefs, scrubPct);
	},

	findChapterTitle(this: DesktopUiInternals, time: number): string | undefined {
		return findChapterTitle(this.player, time);
	},

	previousChapter(this: DesktopUiInternals): void {
		previousChapter(this.player);
	},

	nextChapter(this: DesktopUiInternals): void {
		nextChapter(this.player);
	},
} as const;
