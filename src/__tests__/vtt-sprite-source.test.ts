// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * VttSpriteThumbnailSource — uncovered branch coverage.
 *
 * Uncovered lines 38-43 (load returns false when loadSpriteSet returns null),
 * 50-66 (lookup returns null when no cache, and maps cue to ThumbnailFrame).
 *
 * loadSpriteSet is internal (desktop-ui/sprite.ts fetch path) — mock at the
 * module level so we control the return value.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { VttSpriteThumbnailSource } from '../adapters/thumbnail-source/vtt-sprite';

import { loadSpriteSet, lookupCue } from '../plugins/desktop-ui/sprite';

// ── Mock desktop-ui/sprite so no network requests happen ─────────────────────

vi.mock('../plugins/desktop-ui/sprite', () => ({
	loadSpriteSet: vi.fn(),
	lookupCue: vi.fn(),
}));

const mockLoadSpriteSet = loadSpriteSet as ReturnType<typeof vi.fn>;
const mockLookupCue = lookupCue as ReturnType<typeof vi.fn>;

afterEach(() => {
	vi.clearAllMocks();
});

// ── load() ────────────────────────────────────────────────────────────────────

describe('VttSpriteThumbnailSource.load()', () => {
	it('returns false when item has no previewSpriteUrl', async () => {
		const source = new VttSpriteThumbnailSource();
		const result = await source.load({ id: 1, title: 'Movie' } as never);
		expect(result).toBe(false);
		expect(mockLoadSpriteSet).not.toHaveBeenCalled();
	});

	it('returns false when previewSpriteUrl is an empty string', async () => {
		const source = new VttSpriteThumbnailSource();
		const result = await source.load({ id: 1, title: 'Movie', previewSpriteUrl: '' } as never);
		expect(result).toBe(false);
	});

	it('returns false when loadSpriteSet returns null', async () => {
		mockLoadSpriteSet.mockResolvedValue(null);

		const source = new VttSpriteThumbnailSource();
		const result = await source.load({ id: 1, title: 'Movie', previewSpriteUrl: 'https://cdn.example.com/sprites.vtt' } as never);
		expect(result).toBe(false);
	});

	it('returns true when loadSpriteSet returns a SpriteSet', async () => {
		const fakeSet = { cues: [], imageUrl: 'https://cdn.example.com/sprites.webp' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet);

		const source = new VttSpriteThumbnailSource();
		const result = await source.load({ id: 1, title: 'Movie', previewSpriteUrl: 'https://cdn.example.com/sprites.vtt' } as never);
		expect(result).toBe(true);
	});

	it('resets cache before loading a new item', async () => {
		const fakeSet = { cues: [], imageUrl: 'https://cdn.example.com/sprites.webp' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet);

		const source = new VttSpriteThumbnailSource();
		await source.load({ id: 1, previewSpriteUrl: 'https://cdn.example.com/s1.vtt' } as never);

		// Second load — spy resets the cache; lookupCue should work with new set.
		const fakeSet2 = { cues: [], imageUrl: 'https://cdn.example.com/s2.webp' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet2);
		await source.load({ id: 2, previewSpriteUrl: 'https://cdn.example.com/s2.vtt' } as never);

		expect(mockLoadSpriteSet).toHaveBeenCalledTimes(2);
	});
});

// ── lookup() ──────────────────────────────────────────────────────────────────

describe('VttSpriteThumbnailSource.lookup()', () => {
	it('returns null when no sprite set has been loaded', () => {
		const source = new VttSpriteThumbnailSource();
		const result = source.lookup(10);
		expect(result).toBeNull();
	});

	it('returns null when lookupCue finds no matching cue', async () => {
		const fakeSet = { cues: [], imageUrl: '' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet);
		mockLookupCue.mockReturnValue(null);

		const source = new VttSpriteThumbnailSource();
		await source.load({ id: 1, previewSpriteUrl: 'https://cdn.example.com/sprites.vtt' } as never);

		const result = source.lookup(99);
		expect(result).toBeNull();
	});

	it('maps a lookupCue result to a ThumbnailFrame', async () => {
		const fakeSet = { cues: [], imageUrl: '' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet);

		const fakeCue = {
			url: 'https://cdn.example.com/sprites.webp',
			x: 100,
			y: 200,
			w: 160,
			h: 90,
			start: 5,
			end: 10,
		};
		mockLookupCue.mockReturnValue(fakeCue);

		const source = new VttSpriteThumbnailSource();
		await source.load({ id: 1, previewSpriteUrl: 'https://cdn.example.com/sprites.vtt' } as never);

		const frame = source.lookup(7);
		expect(frame).not.toBeNull();
		expect(frame!.spriteUrl).toBe('https://cdn.example.com/sprites.webp');
		expect(frame!.x).toBe(100);
		expect(frame!.y).toBe(200);
		expect(frame!.w).toBe(160);
		expect(frame!.h).toBe(90);
		expect(frame!.start).toBe(5);
		expect(frame!.end).toBe(10);
	});
});

// ── unload() ──────────────────────────────────────────────────────────────────

describe('VttSpriteThumbnailSource.unload()', () => {
	it('clears the cache so lookup returns null after unload', async () => {
		const fakeSet = { cues: [], imageUrl: '' };
		mockLoadSpriteSet.mockResolvedValue(fakeSet);
		mockLookupCue.mockReturnValue({ url: 'x.webp', x: 0, y: 0, w: 160, h: 90, start: 0, end: 5 });

		const source = new VttSpriteThumbnailSource();
		await source.load({ id: 1, previewSpriteUrl: 'https://cdn.example.com/sprites.vtt' } as never);

		// Confirm it worked before unload.
		expect(source.lookup(2)).not.toBeNull();

		source.unload();

		// After unload, lookup returns null regardless of lookupCue mock.
		expect(source.lookup(2)).toBeNull();
	});
});
