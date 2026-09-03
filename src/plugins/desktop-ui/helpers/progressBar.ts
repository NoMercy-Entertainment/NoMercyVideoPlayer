// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Progress bar concern — slider-bar DOM construction, chapter-marker rendering,
 * scrub helper types, and the time-formatting utility.
 *
 * Integration: `buildSliderBar()` returns `SliderBarRefs`. The plugin class
 * keeps the refs as instance fields and passes them into the chapter-marker
 * renderer and update helpers below. Event wiring (`wireSliderBar`) stays on
 * the class because it closes over both `this` state (isMouseDown, isScrubbing)
 * and the plugin lifecycle (`this.listen`, `this.timeout`).
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

import { createElement } from '@nomercy-entertainment/nomercy-player-core';

export { formatSeconds } from '../data/utils';

// ── Slider bar DOM ─────────────────────────────────────────────────────────────

export interface SliderBarRefs {
	sliderBar: HTMLDivElement;
	sliderBuffer: HTMLDivElement;
	sliderHover: HTMLDivElement;
	sliderProgress: HTMLDivElement;
	chapterBar: HTMLDivElement;
	sliderNipple: HTMLDivElement;
	sliderPop: HTMLDivElement;
	sliderPopImage: HTMLDivElement;
	sliderPopText: HTMLDivElement;
	chapterText: HTMLDivElement;
}

/**
 * Build the slider-bar subtree and return all named refs.
 * The caller appends to its parent.
 */
export function buildSliderBar(player: IVideoPlayer<VideoPlaylistItem>): SliderBarRefs {
	const sliderBar = createElement('div', 'slider-bar')
		.addClasses(['slider-bar'])
		.setAttribute('role', 'slider')
		.setAttribute('aria-label', player.t('plugin.desktop-ui.a11y.seek'))
		.setAttribute('aria-valuemin', '0')
		.setAttribute('aria-valuemax', '100')
		.setAttribute('aria-valuenow', '0')
		.get();

	const sliderBuffer = createElement('div', 'slider-buffer')
		.addClasses(['slider-buffer'])
		.appendTo(sliderBar)
		.get();
	const sliderHover = createElement('div', 'slider-hover')
		.addClasses(['slider-hover'])
		.appendTo(sliderBar)
		.get();
	const sliderProgress = createElement('div', 'slider-progress')
		.addClasses(['slider-progress'])
		.appendTo(sliderBar)
		.get();
	const chapterBar = createElement('div', 'chapter-progress')
		.addClasses(['chapter-bar'])
		.appendTo(sliderBar)
		.get();

	const sliderNipple = createElement('div', 'slider-nipple')
		.addClasses(['slider-nipple'])
		.appendTo(sliderBar)
		.get();

	const sliderPop = createElement('div', 'slider-pop')
		.addClasses(['slider-pop'])
		.setProperty('--visibility', '0')
		.appendTo(sliderBar)
		.get();

	const sliderPopImage = createElement('div', 'slider-pop-image')
		.addClasses(['slider-pop-image'])
		.appendTo(sliderPop)
		.get();
	const sliderPopText = createElement('div', 'slider-text')
		.addClasses(['slider-pop-text'])
		.appendTo(sliderPop)
		.get();
	const chapterText = createElement('div', 'chapter-text')
		.addClasses(['chapter-text'])
		.appendTo(sliderPop)
		.get();

	return {
		sliderBar,
		sliderBuffer,
		sliderHover,
		sliderProgress,
		chapterBar,
		sliderNipple,
		sliderPop,
		sliderPopImage,
		sliderPopText,
		chapterText,
	};
}

// ── Chapter marker DOM ─────────────────────────────────────────────────────────

export interface ChapterMarkerRef {
	/** Chapter range, as percentages of total duration. */
	left: number;
	right: number;
	buffer: HTMLDivElement;
	hover: HTMLDivElement;
	progress: HTMLDivElement;
}

/** Chapter data as needed by the marker builder — subset of the player's chapter type. */
export interface ChapterLite {
	index: number;
	start: number;
	end: number;
	title?: string;
}

/**
 * Build segmented chapter-marker DOM inside `chapterBar`. Returns the new
 * chapter refs array. The caller must wire click listeners via their own
 * `listen` helper after calling this.
 */
export function buildChapterMarkers(
	chapterBar: HTMLDivElement,
	chapters: ReadonlyArray<ChapterLite>,
	dur: number,
	onChapterClick: (index: number) => void,
	listen: (el: EventTarget, event: string, handler: (event: Event) => void) => void,
): ChapterMarkerRef[] {
	chapterBar.replaceChildren();

	if (!dur || chapters.length === 0)
		return [];

	const refs: ChapterMarkerRef[] = [];

	for (const ch of chapters) {
		const left = (ch.start / dur) * 100;
		const right = (ch.end / dur) * 100;
		const width = Math.max(0, right - left);

		const marker = document.createElement('div');
		marker.className = 'chapter-marker';
		marker.id = `chapter-marker-${ch.index}`;
		marker.style.left = `${left}%`;
		marker.style.width = `calc(${width}% - 2px)`;

		const bg = document.createElement('div');
		bg.className = 'chapter-marker-bg';
		const buffer = document.createElement('div');
		buffer.className = 'chapter-marker-buffer';
		const hover = document.createElement('div');
		hover.className = 'chapter-marker-hover';
		const progress = document.createElement('div');
		progress.className = 'chapter-marker-progress';

		marker.append(bg, buffer, hover, progress);
		chapterBar.appendChild(marker);

		listen(marker, 'click', (event: Event) => {
			event.stopPropagation();
			onChapterClick(ch.index);
		});

		refs.push({ left, right, buffer, hover, progress });
	}

	return refs;
}

// ── Chapter state updaters ─────────────────────────────────────────────────────

/** Division-by-zero guard: minimum chapter span (percentage points). */
const MIN_CHAPTER_SPAN = 0.0001;

/**
 * Apply a 0→scaleX(0–1)→1 fill to one layer across all chapter markers.
 *
 * @param refs  - Chapter marker ref array.
 * @param value - Current value as a percentage (same scale as `left`/`right`).
 * @param pick  - Selects the target `HTMLDivElement` from a marker ref.
 */
function applyChapterFill(
	refs: ChapterMarkerRef[],
	value: number,
	pick: (chapterMarkerRef: ChapterMarkerRef) => HTMLDivElement,
): void {
	for (const chapterMarkerRef of refs) {
		const target = pick(chapterMarkerRef);
		if (value <= chapterMarkerRef.left) {
			target.style.transform = 'scaleX(0)';
		}
		else if (value >= chapterMarkerRef.right) {
			target.style.transform = 'scaleX(1)';
		}
		else {
			const span = Math.max(MIN_CHAPTER_SPAN, chapterMarkerRef.right - chapterMarkerRef.left);
			target.style.transform = `scaleX(${(value - chapterMarkerRef.left) / span})`;
		}
	}
}

/** Update chapter-marker progress fills for the given playback percentage. */
export function updateChapterProgress(refs: ChapterMarkerRef[], percentage: number): void {
	applyChapterFill(refs, percentage, chapterMarkerRef => chapterMarkerRef.progress);
}

/** Update chapter-marker buffer fills for the given buffered percentage. */
export function updateChapterBuffer(refs: ChapterMarkerRef[], bufferedPct: number): void {
	applyChapterFill(refs, bufferedPct, chapterMarkerRef => chapterMarkerRef.buffer);
}

/** Update chapter-marker hover fills for the given scrub percentage. */
export function updateChapterHover(refs: ChapterMarkerRef[], scrubPct: number): void {
	applyChapterFill(refs, scrubPct, chapterMarkerRef => chapterMarkerRef.hover);
}
