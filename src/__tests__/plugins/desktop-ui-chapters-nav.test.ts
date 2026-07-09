// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tests for the desktop-ui chapter NAVIGATION helpers (`helpers/chapters.ts`):
 * `findChapterTitle`, `previousChapter`, `nextChapter`. Marker DOM
 * construction lives in `progressBar.ts` and is covered by
 * `desktop-ui-progressbar-ext.test.ts`.
 *
 * Real players + `Object.assign` chapter/time stubs — the same pattern the
 * cycleSubtitles tests use.
 */

import type { Chapter } from '@nomercy-entertainment/nomercy-player-core';
import type { IVideoPlayer, VideoPlaylistItem } from '../../types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { findChapterTitle, nextChapter, previousChapter } from '../../plugins/desktop-ui/helpers/chapters';

const CHAPTERS: Chapter[] = [
	{ index: 0, start: 0, end: 10, title: 'Intro' },
	{ index: 1, start: 10, end: 20, title: 'Verse' },
	{ index: 2, start: 20, end: 30, title: 'Outro' },
];

interface ChapterProbe {
	player: IVideoPlayer<VideoPlaylistItem>;
	seeks: number[];
}

async function buildChapterProbe(chapters: Chapter[], currentTime: number): Promise<ChapterProbe> {
	const player = new NMVideoPlayer('test').setup({});
	await player.ready();

	const seeks: number[] = [];
	Object.assign(player, {
		chapters: () => chapters,
		time: (seconds?: number) => {
			if (seconds === undefined)
				return currentTime;
			seeks.push(seconds);
			return Promise.resolve();
		},
	});

	return { player: player as unknown as IVideoPlayer<VideoPlaylistItem>, seeks };
}

describe('desktop-ui chapters helpers', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	// ── findChapterTitle ────────────────────────────────────────────────────────

	describe('findChapterTitle', () => {
		it('returns the title of the chapter covering the time', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 0);
			expect(findChapterTitle(probe.player, 15)).toBe('Verse');
		});

		it('range bounds are inclusive on both ends', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 0);
			expect(findChapterTitle(probe.player, 20)).toBe('Verse');
			expect(findChapterTitle(probe.player, 0)).toBe('Intro');
			expect(findChapterTitle(probe.player, 30)).toBe('Outro');
		});

		it('returns undefined when no chapter covers the time', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 0);
			expect(findChapterTitle(probe.player, 31)).toBeUndefined();
		});

		it('returns undefined for an empty chapter list', async () => {
			const probe = await buildChapterProbe([], 0);
			expect(findChapterTitle(probe.player, 5)).toBeUndefined();
		});
	});

	// ── previousChapter ─────────────────────────────────────────────────────────

	describe('previousChapter', () => {
		it('seeks to the current chapter start when more than 1 s into it', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 25);
			previousChapter(probe.player);
			expect(probe.seeks).toEqual([20]);
		});

		it('seeks to the chapter BEFORE when within the first second of a chapter', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 20.5);
			previousChapter(probe.player);
			expect(probe.seeks).toEqual([10]);
		});

		it('falls back to time 0 when no earlier chapter start exists', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 0.5);
			previousChapter(probe.player);
			expect(probe.seeks).toEqual([0]);
		});

		it('falls back to time 0 with an empty chapter list', async () => {
			const probe = await buildChapterProbe([], 42);
			previousChapter(probe.player);
			expect(probe.seeks).toEqual([0]);
		});
	});

	// ── nextChapter ─────────────────────────────────────────────────────────────

	describe('nextChapter', () => {
		it('seeks to the first chapter start more than 1 s ahead', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 5);
			nextChapter(probe.player);
			expect(probe.seeks).toEqual([10]);
		});

		it('skips a boundary within the 1 s guard window and lands on the one after', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 9.5);
			nextChapter(probe.player);
			expect(probe.seeks).toEqual([20]);
		});

		it('no-ops when already past the last chapter boundary', async () => {
			const probe = await buildChapterProbe(CHAPTERS, 25);
			nextChapter(probe.player);
			expect(probe.seeks).toEqual([]);
		});

		it('no-ops with an empty chapter list', async () => {
			const probe = await buildChapterProbe([], 5);
			nextChapter(probe.player);
			expect(probe.seeks).toEqual([]);
		});
	});

	// ── Malformed-chapter safety net — real pipeline, not a chapters() stub ────

	describe('backfilled chapters through the real player pipeline', () => {
		it('markers and navigation see a trailing-gap filler backfilled once duration is known', async () => {
			const player = new NMVideoPlayer('test').setup({});
			await player.ready();

			player.queue([{
				id: 'item-backfill',
				title: 'Movie',
				chapters: [{ index: 0, start: 0, end: 10, title: 'Intro' }],
			}] as never);

			const internals = player as unknown as { _resolveAndEmitChapters: (id: string) => Promise<void> };
			await internals._resolveAndEmitChapters('item-backfill');

			// Duration unknown at ingest — the raw single chapter passes through.
			expect(player.chapters()).toHaveLength(1);

			player.emit('duration', { duration: 30 });

			const chapters = player.chapters();
			expect(chapters).toHaveLength(2);
			expect(chapters[1]).toMatchObject({ start: 10, end: 30 });
			// video's pinned core dependency predates the `synthetic` field —
			// opaque structural read, not a hardcoded assumption about its shape.
			expect((chapters[1] as unknown as { synthetic?: boolean }).synthetic).toBe(true);

			const filler = findChapterTitle(player as unknown as IVideoPlayer<VideoPlaylistItem>, 15);
			expect(filler).toBe(chapters[1]!.title);

			const seeks: number[] = [];
			Object.assign(player, {
				time: (seconds?: number) => {
					if (seconds === undefined)
						return 5;
					seeks.push(seconds);
					return Promise.resolve();
				},
			});

			nextChapter(player as unknown as IVideoPlayer<VideoPlaylistItem>);

			expect(seeks).toEqual([10]);
		});
	});
});
