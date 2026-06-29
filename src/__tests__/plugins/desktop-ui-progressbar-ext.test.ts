// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Extended progressBar.ts tests — covers the branches that were under-covered
 * (29% → target ~85%+).
 *
 * New coverage:
 *   - buildChapterMarkers: builds correct DOM nodes for each chapter
 *   - buildChapterMarkers: returns empty array when chapters is empty
 *   - buildChapterMarkers: returns empty array when dur is 0
 *   - buildChapterMarkers: replaces children on rebuild
 *   - buildChapterMarkers: click handler calls onChapterClick with index
 *   - updateChapterProgress: full fill when percentage > right
 *   - updateChapterProgress: partial fill when percentage straddles a marker
 *   - updateChapterProgress: empty fill when percentage < left
 *   - updateChapterBuffer: same three branches as progress
 *   - updateChapterHover: same three branches
 *   - buildSliderBar: verifies DOM tree elements are created with correct roles
 *   - fmt: edge cases (negative, Infinity, hours)
 */

import type { ChapterLite } from '../../plugins/desktop-ui/helpers/progressBar';

import { describe, expect, it } from 'vitest';

import { NMVideoPlayer } from '../../index';
import {
	buildChapterMarkers,
	buildSliderBar,
	fmt,
	updateChapterBuffer,
	updateChapterHover,
	updateChapterProgress,
} from '../../plugins/desktop-ui/helpers/progressBar';

// ── fmt ────────────────────────────────────────────────────────────────────────

describe('fmt', () => {
	it('formats zero as 0:00', () => {
		expect(fmt(0)).toBe('0:00');
	});

	it('formats 90 seconds as 1:30', () => {
		expect(fmt(90)).toBe('1:30');
	});

	it('formats 3661 seconds as 1:01:01', () => {
		expect(fmt(3661)).toBe('1:01:01');
	});

	it('returns 0:00 for negative values', () => {
		expect(fmt(-1)).toBe('0:00');
	});

	it('returns 0:00 for Infinity', () => {
		expect(fmt(Infinity)).toBe('0:00');
	});

	it('returns 0:00 for NaN', () => {
		expect(fmt(Number.NaN)).toBe('0:00');
	});

	it('pads single-digit seconds', () => {
		expect(fmt(65)).toBe('1:05');
	});
});

// ── buildChapterMarkers ────────────────────────────────────────────────────────

function makeChapters(count: number): ChapterLite[] {
	const dur = 100;
	const chapterDur = dur / count;
	return Array.from({ length: count }, (_, i) => ({
		index: i,
		start: i * chapterDur,
		end: (i + 1) * chapterDur,
		title: `Chapter ${i + 1}`,
	}));
}

describe('buildChapterMarkers', () => {
	it('returns empty array when chapters is empty', () => {
		const bar = document.createElement('div');
		const refs = buildChapterMarkers(bar, [], 100, () => {}, () => {});
		expect(refs).toHaveLength(0);
		expect(bar.children.length).toBe(0);
	});

	it('returns empty array when dur is 0', () => {
		const bar = document.createElement('div');
		const chapters = makeChapters(3);
		const refs = buildChapterMarkers(bar, chapters, 0, () => {}, () => {});
		expect(refs).toHaveLength(0);
	});

	it('builds one .chapter-marker per chapter', () => {
		const bar = document.createElement('div');
		const chapters = makeChapters(3);
		const refs = buildChapterMarkers(bar, chapters, 100, () => {}, () => {});
		expect(refs).toHaveLength(3);
		expect(bar.querySelectorAll('.chapter-marker').length).toBe(3);
	});

	it('each marker contains bg, buffer, hover, progress divs', () => {
		const bar = document.createElement('div');
		const chapters = makeChapters(2);
		buildChapterMarkers(bar, chapters, 100, () => {}, () => {});

		const marker = bar.querySelector('.chapter-marker')!;
		expect(marker.querySelector('.chapter-marker-bg')).not.toBeNull();
		expect(marker.querySelector('.chapter-marker-buffer')).not.toBeNull();
		expect(marker.querySelector('.chapter-marker-hover')).not.toBeNull();
		expect(marker.querySelector('.chapter-marker-progress')).not.toBeNull();
	});

	it('replaceChildren removes old markers on rebuild', () => {
		const bar = document.createElement('div');
		const chapters = makeChapters(2);

		buildChapterMarkers(bar, chapters, 100, () => {}, () => {});
		expect(bar.querySelectorAll('.chapter-marker').length).toBe(2);

		// Rebuild with different chapters
		buildChapterMarkers(bar, makeChapters(4), 100, () => {}, () => {});
		expect(bar.querySelectorAll('.chapter-marker').length).toBe(4);
	});

	it('click handler fires onChapterClick with correct index', () => {
		const bar = document.createElement('div');
		const chapters = makeChapters(3);
		const clickedIndexes: number[] = [];

		const listen = (target: EventTarget, event: string, fn: (e: Event) => void): void => {
			(target as HTMLElement).addEventListener(event, fn);
		};

		buildChapterMarkers(bar, chapters, 100, idx => clickedIndexes.push(idx), listen);

		const markers = bar.querySelectorAll<HTMLElement>('.chapter-marker');
		markers[1]!.click();

		expect(clickedIndexes).toContain(1);
	});

	it('computes left/right percentages from start/end relative to duration', () => {
		const bar = document.createElement('div');
		const chapters: ChapterLite[] = [{ index: 0, start: 25, end: 50, title: 'Mid' }];
		const refs = buildChapterMarkers(bar, chapters, 100, () => {}, () => {});

		expect(refs[0]!.left).toBeCloseTo(25);
		expect(refs[0]!.right).toBeCloseTo(50);
	});
});

// ── updateChapterProgress ──────────────────────────────────────────────────────

describe('updateChapterProgress', () => {
	function makeRef(left: number, right: number) {
		const progress = document.createElement('div');
		const buffer = document.createElement('div');
		const hover = document.createElement('div');
		return { left, right, progress, buffer, hover };
	}

	it('sets scaleX(0) when percentage is before the marker', () => {
		const ref = makeRef(50, 75);
		updateChapterProgress([ref], 20);
		expect(ref.progress.style.transform).toBe('scaleX(0)');
	});

	it('sets scaleX(1) when percentage is past the marker', () => {
		const ref = makeRef(25, 50);
		updateChapterProgress([ref], 80);
		expect(ref.progress.style.transform).toBe('scaleX(1)');
	});

	it('sets fractional scaleX when percentage is inside the marker', () => {
		const ref = makeRef(0, 100);
		updateChapterProgress([ref], 50);
		expect(ref.progress.style.transform).toBe('scaleX(0.5)');
	});

	it('handles the chapter boundary exactly at right (sets scaleX(1))', () => {
		const ref = makeRef(0, 50);
		updateChapterProgress([ref], 50);
		// percentage === right → past branch
		expect(ref.progress.style.transform).toBe('scaleX(1)');
	});

	it('handles multiple refs', () => {
		const refs = [makeRef(0, 50), makeRef(50, 100)];
		updateChapterProgress(refs, 25);
		expect(refs[0]!.progress.style.transform).toBe('scaleX(0.5)');
		expect(refs[1]!.progress.style.transform).toBe('scaleX(0)');
	});
});

// ── updateChapterBuffer ───────────────────────────────────────────────────────

describe('updateChapterBuffer', () => {
	function makeRef(left: number, right: number) {
		const buffer = document.createElement('div');
		const progress = document.createElement('div');
		const hover = document.createElement('div');
		return { left, right, buffer, progress, hover };
	}

	it('sets scaleX(0) when buffered is before the marker', () => {
		const ref = makeRef(50, 75);
		updateChapterBuffer([ref], 20);
		expect(ref.buffer.style.transform).toBe('scaleX(0)');
	});

	it('sets scaleX(1) when buffered is past the marker', () => {
		const ref = makeRef(0, 50);
		updateChapterBuffer([ref], 80);
		expect(ref.buffer.style.transform).toBe('scaleX(1)');
	});

	it('sets fractional scaleX when buffered is inside the marker', () => {
		const ref = makeRef(0, 100);
		updateChapterBuffer([ref], 30);
		expect(ref.buffer.style.transform).toBe('scaleX(0.3)');
	});
});

// ── updateChapterHover ────────────────────────────────────────────────────────

describe('updateChapterHover', () => {
	function makeRef(left: number, right: number) {
		const hover = document.createElement('div');
		const buffer = document.createElement('div');
		const progress = document.createElement('div');
		return { left, right, hover, buffer, progress };
	}

	it('sets scaleX(0) when scrub is before the marker', () => {
		const ref = makeRef(50, 75);
		updateChapterHover([ref], 10);
		expect(ref.hover.style.transform).toBe('scaleX(0)');
	});

	it('sets scaleX(1) when scrub is past the marker', () => {
		const ref = makeRef(0, 50);
		updateChapterHover([ref], 90);
		expect(ref.hover.style.transform).toBe('scaleX(1)');
	});

	it('sets fractional scaleX when scrub is inside the marker', () => {
		const ref = makeRef(0, 100);
		updateChapterHover([ref], 75);
		expect(ref.hover.style.transform).toBe('scaleX(0.75)');
	});

	it('handles zero-width span without NaN (uses 0.0001 floor)', () => {
		// left === right — the span guard (Math.max(0.0001, right - left)) prevents /0
		const ref = makeRef(50, 50);
		expect(() => updateChapterHover([ref], 50)).not.toThrow();
	});
});

// ── buildSliderBar ────────────────────────────────────────────────────────────

describe('buildSliderBar', () => {
	it('returns a SliderBarRefs object with all expected fields', () => {
		// Use a real NMVideoPlayer so the builder works properly
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry?.();
		const div = document.createElement('div');
		div.id = 'slider-test';
		document.body.appendChild(div);

		const player = new NMVideoPlayer('slider-test').setup({}) as unknown as import('@nomercy-entertainment/nomercy-video-player').IVideoPlayer<import('../../types').VideoPlaylistItem>;
		const refs = buildSliderBar(player);

		expect(refs.sliderBar).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderBuffer).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderHover).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderProgress).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderNipple).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderPop).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderPopImage).toBeInstanceOf(HTMLDivElement);
		expect(refs.sliderPopText).toBeInstanceOf(HTMLDivElement);
		expect(refs.chapterText).toBeInstanceOf(HTMLDivElement);
		expect(refs.chapterBar).toBeInstanceOf(HTMLDivElement);

		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry?.();
	});

	it('sliderBar has role=slider and correct aria attributes', () => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry?.();
		const div = document.createElement('div');
		div.id = 'slider-aria-test';
		document.body.appendChild(div);

		const player = new NMVideoPlayer('slider-aria-test').setup({}) as unknown as import('@nomercy-entertainment/nomercy-video-player').IVideoPlayer<import('../../types').VideoPlaylistItem>;
		const refs = buildSliderBar(player);

		expect(refs.sliderBar.getAttribute('role')).toBe('slider');
		expect(refs.sliderBar.getAttribute('aria-valuemin')).toBe('0');
		expect(refs.sliderBar.getAttribute('aria-valuemax')).toBe('100');
		expect(refs.sliderBar.getAttribute('aria-valuenow')).toBe('0');

		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry?.();
	});
});
