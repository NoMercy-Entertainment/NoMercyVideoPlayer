// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tooltip concern for the desktop UI plugin.
 *
 * Owns `addTooltip` (attaches a lazily-evaluated hover tooltip to a button)
 * and `wireTooltips` (calls `addTooltip` for every control-bar button).
 *
 * Integration: `DesktopUiPlugin.use()` calls `wireTooltips(...)` after
 * `buildDom()` has created all the button refs.
 *
 * NOTE: prev/next tooltips read pre-resolved `item.title` directly — no token
 * resolver is involved here.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';
import type { SliderBarRefs } from './progressBar';

// ── Button-refs bag ────────────────────────────────────────────────────────────

export interface TooltipButtonRefs {
	playBtn: HTMLButtonElement;
	rewindBtn: HTMLButtonElement;
	forwardBtn: HTMLButtonElement;
	volBtn: HTMLButtonElement;
	aspectRatioBtn: HTMLButtonElement;
	theaterBtn: HTMLButtonElement;
	pipBtn: HTMLButtonElement;
	speedBtn: HTMLButtonElement;
	subsBtn: HTMLButtonElement;
	audioBtn: HTMLButtonElement;
	qualityBtn: HTMLButtonElement;
	playlistBtn: HTMLButtonElement;
	settingsBtn: HTMLButtonElement;
	fsBtn: HTMLButtonElement;
	prevBtn: HTMLButtonElement;
	nextBtn: HTMLButtonElement;
	chapBackBtn: HTMLButtonElement;
	chapFwdBtn: HTMLButtonElement;
}

// ── Core tooltip primitive ─────────────────────────────────────────────────────

/**
 * Attach a hover tooltip to a button.
 *
 * `getText` is evaluated lazily on each hover so dynamic labels (next chapter
 * title, next item title) stay current. The tooltip appears after 500 ms and
 * is dismissed on click or mouseleave. It is clamped so it never escapes the
 * player container's left/right edge.
 *
 * `listen` must be the plugin's managed listener registrar so that tooltips
 * are cleaned up on dispose without a separate teardown pass.
 * `getTooltipToken` / `setTooltipToken` give the caller control over the
 * debounce timer so all tooltips share one token slot.
 */
export function addTooltip(
	btn: HTMLButtonElement,
	getText: () => string,
	listen: (target: EventTarget, event: string, fn: (e: Event) => void) => void,
	sliderRefs: SliderBarRefs,
	container: HTMLElement,
	getTooltipToken: () => number | null,
	setTooltipToken: (token: number | null) => void,
	scheduleTimeout: (fn: () => void, ms: number) => number,
): void {
	const tip = document.createElement('span');
	tip.className = 'tooltip';

	const show = (): void => {
		tip.textContent = getText();
		tip.classList.add('tooltip-visible');
		clampTooltip(tip, btn, sliderRefs, container);
	};
	const hide = (): void => {
		const token = getTooltipToken();
		if (token !== null) {
			clearTimeout(token);
			setTooltipToken(null);
		}
		tip.classList.remove('tooltip-visible');
	};

	btn.removeAttribute('title');
	btn.appendChild(tip);

	listen(btn, 'mouseenter', () => {
		const token = getTooltipToken();
		if (token !== null)
			clearTimeout(token);
		setTooltipToken(scheduleTimeout(() => show(), 500));
	});
	listen(btn, 'mouseleave', () => hide());
	listen(btn, 'click', () => hide());
}

/**
 * Clamp a tooltip horizontally so it never escapes the slider-bar bounds.
 * Uses the slider-bar's bounding rect as the horizontal fence — same as the
 * slider-pop scrubbing preview.
 */
export function clampTooltip(
	tip: HTMLSpanElement,
	btn: HTMLButtonElement,
	sliderRefs: SliderBarRefs,
	container: HTMLElement,
): void {
	const boundsRect = sliderRefs?.sliderBar.getBoundingClientRect()
		?? container.getBoundingClientRect();
	const btnRect = btn.getBoundingClientRect();
	const tipWidth = tip.offsetWidth;

	const btnCenter = btnRect.left + btnRect.width / 2;
	const halfTip = tipWidth / 2;

	const rawLeft = btnCenter - halfTip;
	const rawRight = btnCenter + halfTip;

	const clampedLeft = Math.max(boundsRect.left, rawLeft);
	const clampedRight = Math.min(boundsRect.right, rawRight);

	let actualLeft: number;
	if (rawLeft < clampedLeft)
		actualLeft = clampedLeft;
	else if (rawRight > clampedRight)
		actualLeft = clampedRight - tipWidth;
	else
		actualLeft = rawLeft;

	const shift = actualLeft - btnCenter + halfTip;
	tip.style.transform = `translateX(calc(-50% + ${shift}px))`;
	tip.style.setProperty('--arrow-x', `calc(50% - ${shift}px)`);
}

// ── Wire all tooltips ──────────────────────────────────────────────────────────

/**
 * Attach tooltips to every control-bar button.
 *
 * Prev/next/chapter tooltips show the resolved `item.title` from the queue
 * directly — no token resolver.
 */
export function wireTooltips(
	player: IVideoPlayer<VideoPlaylistItem>,
	refs: TooltipButtonRefs,
	sliderRefs: SliderBarRefs,
	listen: (target: EventTarget, event: string, fn: (e: Event) => void) => void,
	getTooltipToken: () => number | null,
	setTooltipToken: (token: number | null) => void,
	scheduleTimeout: (fn: () => void, ms: number) => number,
	t: (key: string, params?: Record<string, string>) => string,
	safeCurrentIndex: () => number,
): void {
	const attach = (btn: HTMLButtonElement, getText: () => string): void =>
		addTooltip(btn, getText, listen, sliderRefs, player.container, getTooltipToken, setTooltipToken, scheduleTimeout);

	attach(refs.playBtn, () => t('tooltip.play', {}));
	attach(refs.rewindBtn, () => t('tooltip.seekBack', {}));
	attach(refs.forwardBtn, () => t('tooltip.seekForward', {}));
	attach(refs.volBtn, () => t('tooltip.mute', {}));
	attach(refs.aspectRatioBtn, () => t('tooltip.aspectRatio', {}));
	attach(refs.theaterBtn, () => t('tooltip.theater', {}));
	attach(refs.pipBtn, () => t('tooltip.pip', {}));
	attach(refs.speedBtn, () => t('tooltip.speed', {}));
	attach(refs.subsBtn, () => t('tooltip.subtitles', {}));
	attach(refs.audioBtn, () => t('tooltip.audio', {}));
	attach(refs.qualityBtn, () => t('tooltip.quality', {}));
	attach(refs.playlistBtn, () => t('tooltip.playlist', {}));
	attach(refs.settingsBtn, () => t('tooltip.settings', {}));
	attach(refs.fsBtn, () => t('tooltip.fullscreen', {}));

	attach(refs.prevBtn, () => {
		const idx = safeCurrentIndex();
		const queue = player.queue() ?? [];
		const prevItem = idx > 0 ? queue[idx - 1] : undefined;
		if (prevItem?.title) {
			return t('tooltip.previousWithTitle', { title: prevItem.title });
		}
		return t('tooltip.previous', {});
	});

	attach(refs.nextBtn, () => {
		const idx = safeCurrentIndex();
		const queue = player.queue() ?? [];
		const nextItem = queue[idx + 1];
		if (nextItem?.title) {
			return t('tooltip.nextWithTitle', { title: nextItem.title });
		}
		return t('tooltip.next', {});
	});

	attach(refs.chapBackBtn, () => {
		const chapters = player.chapters();
		const time = player.time?.() ?? 0;
		const prev = [...chapters].reverse().find(ch => ch.start < time - 1);
		if (prev?.title) {
			return t('tooltip.previousChapterWithTitle', { title: prev.title });
		}
		return t('tooltip.chapterPrev', {});
	});

	attach(refs.chapFwdBtn, () => {
		const chapters = player.chapters();
		const time = player.time?.() ?? 0;
		const next = chapters.find(ch => ch.start > time + 1);
		if (next?.title) {
			return t('tooltip.nextChapterWithTitle', { title: next.title });
		}
		return t('tooltip.chapterNext', {});
	});
}
