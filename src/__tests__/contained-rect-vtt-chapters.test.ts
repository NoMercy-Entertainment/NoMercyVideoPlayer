// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Pure-function + pure-class tests with zero browser dependencies.
 *
 * Covers:
 *   - containedRect() — letterbox math: exact ratio, wider video, taller video,
 *     zero-dimension edge cases, extreme aspect ratios.
 *   - VttChapterSource.current() — boundary conditions: at chapter start,
 *     within chapter, at chapter end (exclusive), time not in any chapter,
 *     empty chapter list.
 */

import { describe, expect, it } from 'vitest';
import { VttChapterSource } from '../adapters/chapter-source/vtt-chapters';
import { containedRect } from '../types';

// ---------------------------------------------------------------------------
// containedRect()
// ---------------------------------------------------------------------------

describe('containedRect()', () => {
	it('video and container have the same aspect ratio — fills container exactly', () => {
		const rect = containedRect(1920, 1080, 1920, 1080);
		expect(rect).not.toBeNull();
		expect(rect!.width).toBe(1920);
		expect(rect!.height).toBe(1080);
		expect(rect!.x).toBe(0);
		expect(rect!.y).toBe(0);
		expect(rect!.scale).toBeCloseTo(1, 5);
	});

	it('wider video than container — constrained by width, letterboxed top/bottom', () => {
		// 16:9 video in a 4:3 container (640×480)
		const rect = containedRect(1920, 1080, 640, 480);
		expect(rect).not.toBeNull();
		expect(rect!.width).toBe(640);
		// height = 640 / (16/9) = 360
		expect(rect!.height).toBe(360);
		// x offset = 0 (fills container width)
		expect(rect!.x).toBe(0);
		// y offset = (480 - 360) / 2 = 60
		expect(rect!.y).toBe(60);
	});

	it('taller video than container — constrained by height, pillarboxed left/right', () => {
		// 4:3 video in a 16:9 container (1280×720)
		const rect = containedRect(640, 480, 1280, 720);
		expect(rect).not.toBeNull();
		expect(rect!.height).toBe(720);
		// width = 720 * (4/3) = 960
		expect(rect!.width).toBe(960);
		// x offset = (1280 - 960) / 2 = 160
		expect(rect!.x).toBe(160);
		expect(rect!.y).toBe(0);
	});

	it('returns null when videoW is 0', () => {
		expect(containedRect(0, 1080, 1920, 1080)).toBeNull();
	});

	it('returns null when videoH is 0', () => {
		expect(containedRect(1920, 0, 1920, 1080)).toBeNull();
	});

	it('returns null when containerW is 0', () => {
		expect(containedRect(1920, 1080, 0, 1080)).toBeNull();
	});

	it('returns null when containerH is 0', () => {
		expect(containedRect(1920, 1080, 1920, 0)).toBeNull();
	});

	it('returns null when all dimensions are 0', () => {
		expect(containedRect(0, 0, 0, 0)).toBeNull();
	});

	it('extreme wide video (21:9) in 16:9 container — pillarboxed', () => {
		// 2560×1080 (21:9) in 1920×1080 (16:9)
		const rect = containedRect(2560, 1080, 1920, 1080);
		expect(rect).not.toBeNull();
		expect(rect!.width).toBe(1920);
		// height = 1920 / (2560/1080) = 1920 * 1080 / 2560 = 810
		expect(rect!.height).toBe(810);
		expect(rect!.x).toBe(0);
		expect(rect!.y).toBe(135); // (1080 - 810) / 2
	});

	it('square video in wide container — pillarboxed', () => {
		// 100×100 video in 200×100 container
		const rect = containedRect(100, 100, 200, 100);
		expect(rect).not.toBeNull();
		expect(rect!.width).toBe(100);
		expect(rect!.height).toBe(100);
		expect(rect!.x).toBe(50);
		expect(rect!.y).toBe(0);
	});

	it('scale is width / videoW', () => {
		const rect = containedRect(1920, 1080, 960, 540);
		expect(rect).not.toBeNull();
		expect(rect!.scale).toBeCloseTo(rect!.width / 1920, 5);
	});

	it('coordinates are rounded integers', () => {
		// Odd container that produces fractional results
		const rect = containedRect(16, 9, 101, 57);
		expect(rect).not.toBeNull();
		expect(Number.isInteger(rect!.x)).toBe(true);
		expect(Number.isInteger(rect!.y)).toBe(true);
		expect(Number.isInteger(rect!.width)).toBe(true);
		expect(Number.isInteger(rect!.height)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// VttChapterSource.current()
// ---------------------------------------------------------------------------

describe('VttChapterSource.current()', () => {
	function makeSource(chapters: Array<{ title: string; start: number; end: number }>): VttChapterSource {
		const source = new VttChapterSource();
		// Prime the internal state via load() — pass chapters inline on the item.
		void source.load({ id: 'test', chapters } as Parameters<typeof source.load>[0]);
		return source;
	}

	const chapters = [
		{ title: 'Opening', start: 0, end: 90 },
		{ title: 'Act 1', start: 90, end: 300 },
		{ title: 'Climax', start: 300, end: 420 },
	];

	it('returns the chapter containing the given time', () => {
		const source = makeSource(chapters);
		const ch = source.current(150);
		expect(ch).not.toBeNull();
		expect(ch!.title).toBe('Act 1');
	});

	it('returns chapter when time equals start (inclusive boundary)', () => {
		const source = makeSource(chapters);
		const ch = source.current(90);
		expect(ch).not.toBeNull();
		expect(ch!.title).toBe('Act 1');
	});

	it('does NOT return chapter when time equals end (exclusive boundary)', () => {
		const source = makeSource(chapters);
		// time=90 is the END of Opening and the START of Act 1
		const ch = source.current(90);
		// Opening ends at 90 (exclusive), so must be Act 1
		expect(ch!.title).not.toBe('Opening');
	});

	it('returns the first chapter at time 0', () => {
		const source = makeSource(chapters);
		const ch = source.current(0);
		expect(ch).not.toBeNull();
		expect(ch!.title).toBe('Opening');
	});

	it('returns null when time is before all chapters', () => {
		const chaps = [{ title: 'Only', start: 10, end: 60 }];
		const source = makeSource(chaps);
		expect(source.current(5)).toBeNull();
	});

	it('returns null when time is after all chapters end', () => {
		const source = makeSource(chapters);
		expect(source.current(999)).toBeNull();
	});

	it('returns null when no chapters are loaded', () => {
		const source = new VttChapterSource();
		expect(source.current(50)).toBeNull();
	});

	it('returns correct chapter at last chapter start', () => {
		const source = makeSource(chapters);
		const ch = source.current(300);
		expect(ch!.title).toBe('Climax');
	});

	it('all() returns loaded chapters', () => {
		const source = makeSource(chapters);
		expect(source.all()).toHaveLength(3);
		expect(source.all()[1]!.title).toBe('Act 1');
	});

	it('unload() clears chapters so current() returns null', () => {
		const source = makeSource(chapters);
		source.unload();
		expect(source.current(150)).toBeNull();
		expect(source.all()).toHaveLength(0);
	});
});
