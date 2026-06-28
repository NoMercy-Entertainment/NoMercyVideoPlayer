// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Video-domain feature tests: chapters, thumbnails, subtitle-style, and
 * video dimensions.
 *
 * Tests 1–6 exercise the adapter classes directly (no player instance).
 * Tests 7–10 exercise the NMVideoPlayer public API.
 *
 * FINDINGS recorded at bottom of this file.
 */

import { MemoryStorageBackend } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NMVideoPlayer } from '../index';
import { VttChapterSource } from '../adapters/chapter-source/vtt-chapters';
import { VttSpriteThumbnailSource } from '../adapters/thumbnail-source/vtt-sprite';
import { StorageBackedSubtitleStyleStore } from '../adapters/subtitle-style-store/storage-backed';

// ──────────────────────────────────────────────────────────────────────────────
// Group 1 — VttChapterSource
// ──────────────────────────────────────────────────────────────────────────────

describe('VttChapterSource', () => {
	// Test 1
	it('load(item) returns inline chapters when item.chapters is populated', async () => {
		const src = new VttChapterSource();
		const item = {
			id: '1',
			chapters: [{ index: 0, title: 'Intro', start: 0, end: 90 }],
		};

		const result = await src.load(item as any);

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({ title: 'Intro', start: 0, end: 90 });

		// all() returns the loaded list
		const all = src.all();
		expect(all).toHaveLength(1);
		expect(all[0]).toMatchObject({ title: 'Intro', start: 0, end: 90 });
	});

	// Test 2
	it('load(item) returns [] when item has no chapters and no chaptersUrl', async () => {
		const src = new VttChapterSource();
		const item = { id: '2' };

		const result = await src.load(item as any);

		expect(result).toEqual([]);
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Group 2 — VttSpriteThumbnailSource
// ──────────────────────────────────────────────────────────────────────────────

describe('VttSpriteThumbnailSource', () => {
	// Test 3
	it('load(item) returns false when item.previewSpriteUrl is absent', async () => {
		const src = new VttSpriteThumbnailSource();
		const item = { id: '3' };

		const loaded = await src.load(item as any);

		expect(loaded).toBe(false);
		expect(src.lookup(10)).toBeNull();
	});

	// Test 4
	it('lookup(time) returns null before any load() call', () => {
		const src = new VttSpriteThumbnailSource();

		expect(src.lookup(5)).toBeNull();
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Group 3 — StorageBackedSubtitleStyleStore
// ──────────────────────────────────────────────────────────────────────────────

describe('StorageBackedSubtitleStyleStore', () => {
	// Test 5
	it('save(style) then load() round-trips through IStorage', async () => {
		const storage = new MemoryStorageBackend();
		const store = new StorageBackedSubtitleStyleStore(storage);

		const style = {
			fontSize: 24,
			fontFamily: 'Arial',
			textColor: '#ffffff',
			textOpacity: 100,
			backgroundColor: '#000000',
			backgroundOpacity: 0,
			edgeStyle: 'textShadow' as const,
			areaColor: 'black',
			windowOpacity: 0,
		};

		await store.save(style);
		const loaded = await store.load();

		expect(loaded).not.toBeNull();
		expect(loaded!.fontSize).toBe(24);
		expect(loaded!.textColor).toBe('#ffffff');
	});

	// Test 6
	it('clear() removes the stored style so load() returns null', async () => {
		const storage = new MemoryStorageBackend();
		const store = new StorageBackedSubtitleStyleStore(storage);

		const style = {
			fontSize: 20,
			fontFamily: 'Arial',
			textColor: '#ffffff',
			textOpacity: 100,
			backgroundColor: '#000000',
			backgroundOpacity: 0,
			edgeStyle: 'none' as const,
			areaColor: 'black',
			windowOpacity: 0,
		};

		await store.save(style);
		await store.clear();

		const loaded = await store.load();

		expect(loaded).toBeNull();
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Group 4 — NMVideoPlayer player-level API
// ──────────────────────────────────────────────────────────────────────────────

describe('NMVideoPlayer — video domain API', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'vd-test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	const setup = (cfg: Record<string, unknown> = {}): NMVideoPlayer =>
		new NMVideoPlayer('vd-test').setup(cfg);

	// Test 7
	it('subtitleStyle() read returns default style with canonical fields', () => {
		const player = setup();
		const style = player.subtitleStyle();

		expect(typeof style.fontSize).toBe('number');
		expect(typeof style.fontFamily).toBe('string');
		expect(typeof style.textColor).toBe('string');
		expect(typeof style.textOpacity).toBe('number');
		expect(typeof style.backgroundColor).toBe('string');
		expect(typeof style.backgroundOpacity).toBe('number');
		expect(typeof style.edgeStyle).toBe('string');
		expect(typeof style.areaColor).toBe('string');
		expect(typeof style.windowOpacity).toBe('number');
	});

	// Test 8
	it('subtitleStyle(patch) merges and emits subtitleStyle event with merged result', () => {
		const player = setup();

		const events: Array<Record<string, unknown>> = [];
		player.on('subtitleStyle', (payload) => { events.push(payload as Record<string, unknown>); });

		player.subtitleStyle({ fontSize: 32 });

		expect(events).toHaveLength(1);
		expect((events[0] as { fontSize: number }).fontSize).toBe(32);

		const current = player.subtitleStyle();
		expect(current.fontSize).toBe(32);
	});

	// Test 9
	it('chapters() returns an array before any item is loaded', () => {
		const player = setup();

		const result = player.chapters();

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(0);
	});

	// Test 10 — MEDIUM FINDING: videoWidth / videoHeight are NOT direct properties
	// on NMVideoPlayer. The player exposes videoRect() which reads from the
	// <video> element internally. Direct .videoWidth / .videoHeight accessors are
	// absent from the public API. The test asserts videoRect() returns null in
	// jsdom (no media element loaded) and documents the missing property finding.
	it('videoRect() returns null before media is loaded (jsdom); videoWidth/videoHeight absent as direct props', () => {
		const player = setup();

		// videoRect() is the available surface — returns null when no video loaded
		expect(player.videoRect()).toBeNull();

		// Direct videoWidth/videoHeight properties do not exist on NMVideoPlayer.
		// This is a MEDIUM finding — see Findings table in slice-06 spec.
		expect((player as unknown as Record<string, unknown>).videoWidth).toBeUndefined();
		expect((player as unknown as Record<string, unknown>).videoHeight).toBeUndefined();
	});
});

/*
 * FINDINGS (slice 06 — confirmed + updated)
 *
 * MEDIUM | setChapterSource / setThumbnailSource / setSubtitleStyleStore absent
 *        | Confirmed absent by exhaustive grep of both packages. Config-time only.
 *        | v1 parity (also config-time). Future: add bare-noun overload API.
 *
 * MEDIUM | videoWidth / videoHeight not exposed as direct NMVideoPlayer properties
 *        | NMVideoPlayer exposes videoRect() which internally reads
 *        | video.videoWidth and video.videoHeight. There are no .videoWidth /
 *        | .videoHeight accessors on the player class itself. v1 exposed these
 *        | directly. Consumer workaround: read videoRect() dimensions or subscribe
 *        | to the 'videoRect' event. Future: add videoWidth()/videoHeight() bare
 *        | getters that delegate to videoRect() for v1 parity.
 *
 * GREEN  | chapters() returns [] before any item loaded — v1 parity confirmed.
 *        | No fix needed. The mixin reads item?.() and returns [] when null.
 */
