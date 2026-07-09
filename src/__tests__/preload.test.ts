// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tests for `VideoPreloadStrategy` — the video-domain asset list layered on
 * the kit's `DefaultPreloadStrategy` lead-seconds gate. Mirrors the music
 * player's `preload.test.ts` shape.
 */

import type { LegacyTrackEntry } from '../player/normalize-item';
import type { VideoPlaylistItem } from '../types';
import { DefaultPreloadStrategy } from '@nomercy-entertainment/nomercy-player-core';
import { describe, expect, it } from 'vitest';
import { VideoPreloadStrategy } from '../player/preload';

type PreloadableItem = VideoPlaylistItem & { tracks?: LegacyTrackEntry[] };

describe('VideoPreloadStrategy — assetsToPreload', () => {
	it('is a DefaultPreloadStrategy subclass (inherits the lead-seconds gate)', () => {
		expect(new VideoPreloadStrategy()).toBeInstanceOf(DefaultPreloadStrategy);
	});

	it('derives the full asset list from a populated item, media first', () => {
		const strategy = new VideoPreloadStrategy();
		const item: PreloadableItem = {
			id: 'ep1',
			url: 'https://cdn/manifest.m3u8',
			image: 'https://cdn/poster.jpg',
			previewSpriteUrl: 'https://cdn/sprite.vtt',
			subtitles: [
				{ id: 'en', url: 'https://cdn/en.vtt', language: 'en', label: 'English', kind: 'subtitles', default: false },
				{ id: 'nl', url: 'https://cdn/nl.vtt', language: 'nl', label: 'Dutch', kind: 'subtitles', default: false },
			],
			tracks: [{ kind: 'chapters', file: 'https://cdn/chapters.vtt' }],
			fonts: [{ file: 'https://cdn/fonts.json' }],
		};

		const assets = strategy.assetsToPreload(item);

		expect(assets).toEqual([
			{ url: 'https://cdn/manifest.m3u8', category: 'media', mode: 'metadata' },
			{ url: 'https://cdn/poster.jpg', category: 'poster', mode: 'auto' },
			{ url: 'https://cdn/sprite.vtt', category: 'sprite', mode: 'metadata' },
			{ url: 'https://cdn/en.vtt', category: 'subtitle', mode: 'auto' },
			{ url: 'https://cdn/nl.vtt', category: 'subtitle', mode: 'auto' },
			{ url: 'https://cdn/chapters.vtt', category: 'chapter', mode: 'auto' },
			{ url: 'https://cdn/fonts.json', category: 'font', mode: 'auto' },
		]);
	});

	it('omits the media asset when the item has no url', () => {
		const strategy = new VideoPreloadStrategy();
		const item: VideoPlaylistItem = { id: 'no-url', image: 'https://cdn/poster.jpg' };

		const assets = strategy.assetsToPreload(item);

		expect(assets.find(asset => asset.category === 'media')).toBeUndefined();
	});

	it('resolves the poster from image → poster → thumbnail in priority order', () => {
		const strategy = new VideoPreloadStrategy();

		const allThree: VideoPlaylistItem = {
			id: 'p1',
			image: 'https://cdn/image.jpg',
			poster: 'https://cdn/poster.jpg',
			thumbnail: 'https://cdn/thumb.jpg',
		};
		expect(strategy.assetsToPreload(allThree).find(asset => asset.category === 'poster')!.url)
			.toBe('https://cdn/image.jpg');

		const posterAndThumb: VideoPlaylistItem = {
			id: 'p2',
			poster: 'https://cdn/poster.jpg',
			thumbnail: 'https://cdn/thumb.jpg',
		};
		expect(strategy.assetsToPreload(posterAndThumb).find(asset => asset.category === 'poster')!.url)
			.toBe('https://cdn/poster.jpg');

		const thumbOnly: VideoPlaylistItem = { id: 'p3', thumbnail: 'https://cdn/thumb.jpg' };
		expect(strategy.assetsToPreload(thumbOnly).find(asset => asset.category === 'poster')!.url)
			.toBe('https://cdn/thumb.jpg');
	});

	it('omits the poster asset when no artwork field is set', () => {
		const strategy = new VideoPreloadStrategy();
		const assets = strategy.assetsToPreload({ id: 'bare', url: 'https://cdn/a.mp4' });

		expect(assets.find(asset => asset.category === 'poster')).toBeUndefined();
	});

	it('omits the sprite asset when previewSpriteUrl is absent', () => {
		const strategy = new VideoPreloadStrategy();
		const assets = strategy.assetsToPreload({ id: 'no-sprite', url: 'https://cdn/a.mp4' });

		expect(assets.find(asset => asset.category === 'sprite')).toBeUndefined();
	});

	it('drops subtitle entries without a url', () => {
		const strategy = new VideoPreloadStrategy();
		const item: VideoPlaylistItem = {
			id: 'subs',
			subtitles: [
				{ id: 'ok', url: 'https://cdn/en.vtt', language: 'en', label: 'English', kind: 'subtitles', default: false },
				{ id: 'broken', url: '', language: 'nl', label: 'Dutch', kind: 'subtitles', default: false },
			],
		};

		const subtitleAssets = strategy.assetsToPreload(item).filter(asset => asset.category === 'subtitle');

		expect(subtitleAssets).toHaveLength(1);
		expect(subtitleAssets[0]!.url).toBe('https://cdn/en.vtt');
	});

	it('derives chapter VTT assets from legacy tracks with kind "chapters" only', () => {
		const strategy = new VideoPreloadStrategy();
		const item: PreloadableItem = {
			id: 'ch1',
			tracks: [
				{ kind: 'chapters', file: 'https://cdn/chapters.vtt' },
				{ kind: 'chapters' },
				{ kind: 'thumbnails', file: 'https://cdn/sprite.vtt' },
				{ kind: 'fonts', file: 'https://cdn/fonts.json' },
			],
		};

		const chapterAssets = strategy.assetsToPreload(item).filter(asset => asset.category === 'chapter');

		expect(chapterAssets).toEqual([
			{ url: 'https://cdn/chapters.vtt', category: 'chapter', mode: 'auto' },
		]);
	});

	it('derives font assets from the canonical fonts field, dropping entries without a file', () => {
		const strategy = new VideoPreloadStrategy();
		const item: PreloadableItem = {
			id: 'f1',
			fonts: [
				{ file: 'https://cdn/fonts.json' },
				{ file: 'https://cdn/arial.ttf', label: 'Arial' },
				{ file: '' },
			],
		};

		const fontAssets = strategy.assetsToPreload(item).filter(asset => asset.category === 'font');

		expect(fontAssets).toEqual([
			{ url: 'https://cdn/fonts.json', category: 'font', mode: 'auto' },
			{ url: 'https://cdn/arial.ttf', category: 'font', mode: 'auto' },
		]);
	});

	it('emits no chapter or font assets when the item lacks tracks and fonts', () => {
		const strategy = new VideoPreloadStrategy();
		const assets = strategy.assetsToPreload({ id: 'plain', url: 'https://cdn/a.mp4' });

		expect(assets.find(asset => asset.category === 'chapter')).toBeUndefined();
		expect(assets.find(asset => asset.category === 'font')).toBeUndefined();
	});

	it('returns an empty list for an empty item', () => {
		const strategy = new VideoPreloadStrategy();
		expect(strategy.assetsToPreload({ id: 'empty' })).toEqual([]);
	});
});

describe('VideoPreloadStrategy — shouldPreload lead-seconds gate', () => {
	const nextItem: VideoPlaylistItem = { id: 'next', url: 'https://cdn/next.m3u8' };

	it('fires at duration - leadSeconds with the default 10 s lead', () => {
		const strategy = new VideoPreloadStrategy();

		expect(strategy.shouldPreload({ currentTime: 89.9, duration: 100, nextItem })).toBe(false);
		expect(strategy.shouldPreload({ currentTime: 90, duration: 100, nextItem })).toBe(true);
		expect(strategy.shouldPreload({ currentTime: 99, duration: 100, nextItem })).toBe(true);
	});

	it('honors a custom leadSeconds constructor argument', () => {
		const strategy = new VideoPreloadStrategy(30);

		expect(strategy.shouldPreload({ currentTime: 69, duration: 100, nextItem })).toBe(false);
		expect(strategy.shouldPreload({ currentTime: 70, duration: 100, nextItem })).toBe(true);
	});

	it('never fires when there is no next item', () => {
		const strategy = new VideoPreloadStrategy();
		expect(strategy.shouldPreload({ currentTime: 99, duration: 100, nextItem: null })).toBe(false);
	});

	it('never fires when duration is unknown (0)', () => {
		const strategy = new VideoPreloadStrategy();
		expect(strategy.shouldPreload({ currentTime: 50, duration: 0, nextItem })).toBe(false);
	});

	it('cancel() is safe to call with no prefetch in flight', () => {
		const strategy = new VideoPreloadStrategy();
		expect(() => strategy.cancel()).not.toThrow();
	});
});
