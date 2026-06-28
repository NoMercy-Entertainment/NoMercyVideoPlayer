// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Pure-function helper tests.
 *
 * Covers:
 *  - src/player/utils.ts      — toTitleCase, unique
 *  - src/player/preload.ts    — VideoPreloadStrategy.assetsToPreload
 *  - src/player/itemImage.ts  — readItemImage
 *  - src/player/start-selection.ts  — pickStartItem (missing branch: resumeTime absent)
 *  - src/player/normalize-item.ts   — missing branch: parseDurationSeconds single segment
 *  - src/player/v1-config-normalizer.ts — normalizeVideoConfig branches
 */

import { describe, expect, it } from 'vitest';
import { readItemImage } from '../player/itemImage';
import { normalizeVideoPlaylistItem } from '../player/normalize-item';
import { VideoPreloadStrategy } from '../player/preload';
import { pickStartItem } from '../player/start-selection';
import { toTitleCase, unique } from '../player/utils';
import { normalizeVideoConfig } from '../player/v1-config-normalizer';

// ---------------------------------------------------------------------------
// toTitleCase
// ---------------------------------------------------------------------------

describe('toTitleCase()', () => {
	it('capitalises first letter of each word', () => {
		expect(toTitleCase('hello world')).toBe('Hello World');
	});

	it('lowercases ALL_CAPS input', () => {
		expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
	});

	it('handles single word', () => {
		expect(toTitleCase('foo')).toBe('Foo');
	});

	it('handles empty string', () => {
		expect(toTitleCase('')).toBe('');
	});

	it('uses locale parameter when provided', () => {
		// Turkish: 'i'.toLocaleUpperCase('tr') === 'İ'
		const result = toTitleCase('istanbul', 'tr');
		expect(result.charAt(0)).toBe('İ');
	});
});

// ---------------------------------------------------------------------------
// unique
// ---------------------------------------------------------------------------

describe('unique()', () => {
	it('deduplicates by key, preserving order of first occurrence', () => {
		const input = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 1, name: 'Alice Duplicate' },
		];
		const result = unique(input, 'id');
		expect(result).toHaveLength(2);
		expect(result[0]!.name).toBe('Alice');
		expect(result[1]!.name).toBe('Bob');
	});

	it('returns the full array when all keys are unique', () => {
		const input = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
		expect(unique(input, 'id')).toHaveLength(3);
	});

	it('returns empty array for empty input', () => {
		expect(unique([], 'id')).toHaveLength(0);
	});

	it('deduplicates string keys', () => {
		const input = [{ kind: 'x' }, { kind: 'y' }, { kind: 'x' }];
		expect(unique(input, 'kind')).toHaveLength(2);
	});
});

// ---------------------------------------------------------------------------
// readItemImage
// ---------------------------------------------------------------------------

describe('readItemImage()', () => {
	it('returns undefined for null', () => {
		expect(readItemImage(null)).toBeUndefined();
	});

	it('returns undefined for non-object', () => {
		expect(readItemImage('string')).toBeUndefined();
	});

	it('returns undefined for empty object', () => {
		expect(readItemImage({})).toBeUndefined();
	});

	it('returns image field when present', () => {
		expect(readItemImage({ image: '/img.jpg', poster: '/poster.jpg' })).toBe('/img.jpg');
	});

	it('falls back to poster when image is absent', () => {
		expect(readItemImage({ poster: '/poster.jpg', thumbnail: '/thumb.jpg' })).toBe('/poster.jpg');
	});

	it('falls back to thumbnail when both image and poster are absent', () => {
		expect(readItemImage({ thumbnail: '/thumb.jpg' })).toBe('/thumb.jpg');
	});

	it('skips non-string fields', () => {
		expect(readItemImage({ image: 42, poster: '/poster.jpg' })).toBe('/poster.jpg');
	});
});

// ---------------------------------------------------------------------------
// VideoPreloadStrategy
// ---------------------------------------------------------------------------

describe('VideoPreloadStrategy.assetsToPreload()', () => {
	const strategy = new VideoPreloadStrategy();

	it('returns empty array for an item with no url or poster', () => {
		const assets = strategy.assetsToPreload({ id: 'x' } as never);
		expect(assets).toHaveLength(0);
	});

	it('includes media asset for item.url', () => {
		const assets = strategy.assetsToPreload({ id: 'x', url: '/video.m3u8' } as never);
		expect(assets.some(a => a.url === '/video.m3u8' && a.category === 'media')).toBe(true);
	});

	it('includes poster asset from image field', () => {
		const assets = strategy.assetsToPreload({ id: 'x', url: '/v.m3u8', image: '/img.jpg' } as never);
		expect(assets.some(a => a.url === '/img.jpg' && a.category === 'poster')).toBe(true);
	});

	it('falls back to poster field for poster asset', () => {
		const assets = strategy.assetsToPreload({ id: 'x', poster: '/poster.jpg' } as never);
		expect(assets.some(a => a.url === '/poster.jpg' && a.category === 'poster')).toBe(true);
	});

	it('falls back to thumbnail field for poster asset', () => {
		const assets = strategy.assetsToPreload({ id: 'x', thumbnail: '/thumb.jpg' } as never);
		expect(assets.some(a => a.url === '/thumb.jpg' && a.category === 'poster')).toBe(true);
	});

	it('includes sprite asset for previewSpriteUrl', () => {
		const assets = strategy.assetsToPreload({ id: 'x', previewSpriteUrl: '/sprites.vtt' } as never);
		expect(assets.some(a => a.url === '/sprites.vtt' && a.category === 'sprite')).toBe(true);
	});

	it('includes subtitle assets for each subtitle with a url', () => {
		const item = {
			id: 'x',
			subtitles: [
				{ url: '/en.vtt', language: 'en', label: 'English' },
				{ language: 'fr', label: 'Français' },
			],
		};
		const assets = strategy.assetsToPreload(item as never);
		const subtitleAssets = assets.filter(a => a.category === 'subtitle');
		expect(subtitleAssets).toHaveLength(1);
		expect(subtitleAssets[0]!.url).toBe('/en.vtt');
	});

	it('returns all asset categories in one call', () => {
		const item = {
			id: 'x',
			url: '/v.m3u8',
			image: '/img.jpg',
			previewSpriteUrl: '/sprites.vtt',
			subtitles: [{ url: '/en.vtt', language: 'en', label: 'English' }],
		};
		const assets = strategy.assetsToPreload(item as never);
		const categories = assets.map(a => a.category);
		expect(categories).toContain('media');
		expect(categories).toContain('poster');
		expect(categories).toContain('sprite');
		expect(categories).toContain('subtitle');
	});
});

// ---------------------------------------------------------------------------
// pickStartItem — missing branch: progress.time is falsy
// ---------------------------------------------------------------------------

describe('pickStartItem() — missing branch', () => {
	it('returns { index } without resumeTime when progress.time is 0', () => {
		const items = [
			{ id: '1', progress: { timestamp: 1000, percentage: 50, time: 0 } },
		];
		const result = pickStartItem(items as never);
		expect(result.index).toBe(0);
		expect(result.resumeTime).toBeUndefined();
	});

	it('picks the most recently watched item by timestamp', () => {
		const items = [
			{ id: '1', progress: { timestamp: 500, percentage: 20, time: 60 } },
			{ id: '2', progress: { timestamp: 1000, percentage: 30, time: 120 } },
		];
		const result = pickStartItem(items as never);
		expect(result.index).toBe(1);
		expect(result.resumeTime).toBe(120);
	});

	it('>90% watched rolls over to next item (last item stays at last)', () => {
		const items = [
			{ id: '1', progress: { timestamp: 1000, percentage: 95, time: 1200 } },
		];
		const result = pickStartItem(items as never);
		expect(result.index).toBe(0);
	});

	it('>90% watched rolls over to next item when not last', () => {
		const items = [
			{ id: '1', progress: { timestamp: 1000, percentage: 95, time: 1200 } },
			{ id: '2' },
		];
		const result = pickStartItem(items as never);
		expect(result.index).toBe(1);
	});
});

// ---------------------------------------------------------------------------
// normalizeVideoPlaylistItem — parseDurationSeconds single segment
// ---------------------------------------------------------------------------

describe('normalizeVideoPlaylistItem() — missing branches', () => {
	it('handles single-segment duration string (seconds only)', () => {
		const item = normalizeVideoPlaylistItem({ id: 'x', duration: '90' } as never);
		expect(item.duration).toBe(90);
	});

	it('isLegacyChapter false branch: canonical ChapterRef passes through', () => {
		const item = normalizeVideoPlaylistItem({
			id: 'x',
			chapters: [{ index: 0, start: 0, end: 60, title: 'Intro' }],
		} as never);
		expect(item.chapters![0]!.start).toBe(0);
		expect(item.chapters![0]!.end).toBe(60);
	});

	it('isLegacyProgress false branch: canonical WatchProgress passes through', () => {
		const progress = { timestamp: 1_700_000_000_000, percentage: 50, time: 600 };
		const item = normalizeVideoPlaylistItem({ id: 'x', progress } as never);
		expect(item.progress).toEqual(progress);
	});

	it('normalizeFonts returns undefined for empty fonts array', () => {
		const item = normalizeVideoPlaylistItem({ id: 'x', fonts: [] } as never);
		expect(item.fonts).toBeUndefined();
	});

	it('normalizeFonts filters out entries without a resolvable file', () => {
		const item = normalizeVideoPlaylistItem({
			id: 'x',
			fonts: [{ label: 'no-file' }],
		} as never);
		expect(item.fonts).toBeUndefined();
	});

	it('fontsFromTracks: extracts font files from tracks when fonts field absent', () => {
		const item = normalizeVideoPlaylistItem({
			id: 'x',
			tracks: [
				{ kind: 'fonts', file: '/fonts.json' },
				{ kind: 'fonts', file: '/fonts.json' },
				{ kind: 'subtitles', file: '/en.vtt' },
			],
		} as never);
		expect(item.fonts).toEqual([{ file: '/fonts.json' }]);
	});

	it('normalizeProgress returns undefined for null/undefined', () => {
		const item = normalizeVideoPlaylistItem({ id: 'x', progress: null } as never);
		expect(item.progress).toBeUndefined();
	});

	it('normalizeProgress percentage clamps to 100 when time > duration', () => {
		const item = normalizeVideoPlaylistItem({
			id: 'x',
			duration: 60,
			progress: { time: 100, date: '2026-01-01T00:00:00Z' },
		} as never);
		expect(item.progress!.percentage).toBe(100);
	});
});

// ---------------------------------------------------------------------------
// normalizeVideoConfig
// ---------------------------------------------------------------------------

describe('normalizeVideoConfig()', () => {
	it('strips deprecated basePath, imageBasePath, disableTouchControls, controls fields', () => {
		const result = normalizeVideoConfig({
			basePath: '/base',
			imageBasePath: '/img',
			disableTouchControls: true,
			controls: true,
			controlsTimeout: 3000,
			doubleClickDelay: 200,
			customStorage: {
				set: async () => undefined,
				get: async () => null,
				remove: async () => undefined,
			},
		});
		expect((result as Record<string, unknown>).basePath).toBeUndefined();
		expect((result as Record<string, unknown>).imageBasePath).toBeUndefined();
		expect((result as Record<string, unknown>).disableTouchControls).toBeUndefined();
		expect((result as Record<string, unknown>).controls).toBeUndefined();
	});

	it('preserves Translations object (not URL string)', () => {
		const translations = { en: { play: 'Play' } };
		const result = normalizeVideoConfig({ translations } as never);
		expect((result as Record<string, unknown>).translations).toBe(translations);
	});

	it('drops string URL translations (v1 pattern)', () => {
		const result = normalizeVideoConfig({ translations: '/locales/{lang}/player.json' } as never);
		expect((result as Record<string, unknown>).translations).toBeUndefined();
	});

	it('drops string array URL translations', () => {
		const result = normalizeVideoConfig({ translations: ['/locales/{lang}/player.json'] } as never);
		expect((result as Record<string, unknown>).translations).toBeUndefined();
	});

	it('accessToken → auth.bearerToken via applyKitV1Compat', () => {
		const result = normalizeVideoConfig({ accessToken: 'my-token' });
		const auth = (result as Record<string, unknown>).auth as Record<string, unknown> | undefined;
		expect(auth?.bearerToken ?? (result as Record<string, unknown>).accessToken).toBeTruthy();
	});

	it('playlist is preserved as the config playlist field', () => {
		const playlist = [{ id: 'x', url: '/v.m3u8' }];
		const result = normalizeVideoConfig({ playlist } as never);
		expect((result as Record<string, unknown>).playlist).toBe(playlist);
	});

	it('returns a clean config when passed a minimal empty object', () => {
		expect(() => normalizeVideoConfig({})).not.toThrow();
	});
});
