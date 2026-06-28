// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Extended sprite.ts tests — covers the uncovered branches beyond what
 * the existing desktop-ui-sprite.test.ts already covers.
 *
 * New coverage:
 *   - parseSpriteVtt: BOM stripping, CRLF normalisation, absolute URL passthrough
 *   - parseSpriteVtt: skips blocks without timing, skips timing without xywh fragment
 *   - parseSpriteVtt: hours in timestamp
 *   - loadSpriteSet: returns null when fetchText returns null
 *   - loadSpriteSet: returns null when VTT parses to 0 cues
 *   - loadSpriteSet: uses fetchImageUrl result when provided
 *   - lookupCue: returns last cue when time is past all cues
 *   - lookupCue: returns null on empty set
 *   - lookupCue: finds cue by time range
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadSpriteSet, lookupCue, parseSpriteVtt } from '../../plugins/desktop-ui/sprite';

// ── Image mock — preloadImage calls new Image(); jsdom never fires onload ─────
// Stub Image so it immediately calls onload (avoids test timeouts).
class MockImage {
	private _onload: (() => void) | null = null;
	private _onerror: (() => void) | null = null;
	set onload(fn: (() => void) | null) { this._onload = fn; }
	set onerror(fn: (() => void) | null) { this._onerror = fn; }
	get onload(): (() => void) | null { return this._onload; }
	get onerror(): (() => void) | null { return this._onerror; }
	private _src = '';
	set src(url: string) {
		this._src = url;
		// Resolve asynchronously to let the assignment complete.
		Promise.resolve().then(() => this._onload?.());
	}

	get src(): string { return this._src; }
}

const BASE_URL = 'https://cdn.example.com/thumbs/sprites.vtt';

const VTT_BASIC = `WEBVTT

00:00:00.000 --> 00:00:05.000
sprite.webp#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprite.webp#xywh=160,0,160,90

00:01:40.000 --> 00:01:45.000
sprite.webp#xywh=320,0,160,90
`;

describe('parseSpriteVtt', () => {
	it('parses a basic VTT and returns the correct cue count', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		expect(cues.length).toBe(3);
	});

	it('resolves relative sprite URLs against the VTT base URL', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		expect(cues[0]!.url).toBe('https://cdn.example.com/thumbs/sprite.webp');
	});

	it('passes through absolute sprite URLs unchanged', () => {
		const vtt = `WEBVTT

00:00:00.000 --> 00:00:05.000
https://img.cdn/sprite.webp#xywh=0,0,160,90
`;
		const cues = parseSpriteVtt(vtt, BASE_URL);
		expect(cues[0]!.url).toBe('https://img.cdn/sprite.webp');
	});

	it('strips a leading UTF-8 BOM', () => {
		const vttWithBom = `\uFEFF${VTT_BASIC}`;
		const cues = parseSpriteVtt(vttWithBom, BASE_URL);
		expect(cues.length).toBe(3);
	});

	it('normalises CRLF line endings', () => {
		const crlfVtt = VTT_BASIC.replace(/\n/g, '\r\n');
		const cues = parseSpriteVtt(crlfVtt, BASE_URL);
		expect(cues.length).toBe(3);
	});

	it('skips blocks without a timing line', () => {
		const vtt = `WEBVTT

NOTE This is a comment block, no timing here.

00:00:00.000 --> 00:00:05.000
sprite.webp#xywh=0,0,160,90
`;
		const cues = parseSpriteVtt(vtt, BASE_URL);
		expect(cues.length).toBe(1);
	});

	it('skips cue bodies without a valid xywh fragment', () => {
		const vtt = `WEBVTT

00:00:00.000 --> 00:00:05.000
sprite.webp

00:00:05.000 --> 00:00:10.000
sprite.webp#xywh=160,0,160,90
`;
		const cues = parseSpriteVtt(vtt, BASE_URL);
		expect(cues.length).toBe(1);
		expect(cues[0]!.x).toBe(160);
	});

	it('parses timestamps that include hours', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		// Third cue starts at 1:40 = 100 seconds
		expect(cues[2]!.start).toBe(100);
	});

	it('returns correct x/y/w/h values from xywh fragment', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		expect(cues[1]!.x).toBe(160);
		expect(cues[1]!.y).toBe(0);
		expect(cues[1]!.w).toBe(160);
		expect(cues[1]!.h).toBe(90);
	});

	it('returns empty array for empty input', () => {
		expect(parseSpriteVtt('', BASE_URL)).toEqual([]);
	});

	it('returns empty array for input without any valid cues', () => {
		expect(parseSpriteVtt('WEBVTT\n\nNOTE nothing here', BASE_URL)).toEqual([]);
	});
});

describe('lookupCue', () => {
	it('returns null for an empty cue set', () => {
		expect(lookupCue({ cues: [], spriteUrl: '' }, 5)).toBeNull();
	});

	it('returns the matching cue when time falls within its range', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		const set = { cues, spriteUrl: 'https://cdn.example.com/thumbs/sprite.webp' };

		const cue = lookupCue(set, 3);
		expect(cue).not.toBeNull();
		expect(cue!.start).toBe(0);
		expect(cue!.end).toBe(5);
	});

	it('returns the last cue when time exceeds all cue end times', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		const set = { cues, spriteUrl: '' };

		const cue = lookupCue(set, 9999);
		expect(cue).toBe(cues[cues.length - 1]);
	});

	it('returns the first cue for time=0', () => {
		const cues = parseSpriteVtt(VTT_BASIC, BASE_URL);
		const set = { cues, spriteUrl: '' };

		const cue = lookupCue(set, 0);
		expect(cue!.start).toBe(0);
	});
});

describe('loadSpriteSet', () => {
	beforeEach(() => {
		vi.stubGlobal('Image', MockImage);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns null when fetchText returns null', async () => {
		const result = await loadSpriteSet('https://cdn/missing.vtt', {
			fetchText: async () => null,
		});
		expect(result).toBeNull();
	});

	it('returns null when VTT has no valid cues', async () => {
		const result = await loadSpriteSet('https://cdn/empty.vtt', {
			fetchText: async () => 'WEBVTT\n\n',
		});
		expect(result).toBeNull();
	});

	it('uses fetchImageUrl result when provided', async () => {
		const blobUrl = 'blob:https://cdn/abc123';
		const result = await loadSpriteSet('https://cdn/thumbs.vtt', {
			fetchText: async () => VTT_BASIC,
			fetchImageUrl: async () => blobUrl,
		});
		expect(result).not.toBeNull();
		expect(result!.spriteUrl).toBe(blobUrl);
	});

	it('returns the raw sprite URL when fetchImageUrl returns null', async () => {
		const result = await loadSpriteSet('https://cdn.example.com/thumbs/sprites.vtt', {
			fetchText: async () => VTT_BASIC,
			fetchImageUrl: async () => null,
		});
		expect(result).not.toBeNull();
		expect(result!.spriteUrl).toBe('https://cdn.example.com/thumbs/sprite.webp');
	});

	it('returns a SpriteSet with the correct cue count', async () => {
		const result = await loadSpriteSet(BASE_URL, {
			fetchText: async () => VTT_BASIC,
			fetchImageUrl: async () => null,
		});
		expect(result).not.toBeNull();
		expect(result!.cues.length).toBe(3);
	});

	it('returns null when fetchText throws', async () => {
		const result = await loadSpriteSet('https://cdn/error.vtt', {
			fetchText: async () => { throw new Error('network error'); },
		});
		expect(result).toBeNull();
	});
});
