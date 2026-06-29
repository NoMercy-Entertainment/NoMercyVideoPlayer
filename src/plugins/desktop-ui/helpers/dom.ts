// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Pure DOM construction for the desktop UI plugin.
 *
 * Owns: `buildCenter`, `buildBottomBar`, `buildBottomRow`, `buildShortcutsOverlay`,
 * `buildKeyboardDecoration`, `applyButtonOrder`, and `iconBtn`.
 *
 * No lifecycle wiring, no state mutation beyond building and returning refs.
 * Matches the free-function + returned-refs pattern of topBar.ts and menus.ts.
 *
 * Integration: `DesktopUiPlugin.buildDom()` calls these builders and stores
 * the returned refs as class fields.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';
import type { DesktopUiButtonOptions, DesktopUiOptions } from '../index';
import type { SliderBarRefs } from './progressBar';

import { fluentIcons, svgFromIcon } from '../data/icons';
import { buildSliderBar } from './progressBar';

// ── Shared helper ─────────────────────────────────────────────────────────────

const DEFAULT_ON_BUTTONS: ReadonlySet<keyof DesktopUiButtonOptions> = new Set([
	'play',
	'mute',
	'volume',
	'fullscreen',
	'settings',
	'next',
	'previous',
	'chapterPrev',
	'chapterNext',
]);

function buttonVisible(
	key: keyof DesktopUiButtonOptions,
	opts: DesktopUiButtonOptions | undefined,
): boolean {
	if (opts && key in opts)
		return Boolean(opts[key]);
	return DEFAULT_ON_BUTTONS.has(key);
}

// ── iconBtn ───────────────────────────────────────────────────────────────────

/**
 * Create a styled icon button for the control bar.
 * Wraps `player.createButton` and appends a `.btn-icon` span.
 */
export function iconBtn(
	player: IVideoPlayer<VideoPlaylistItem>,
	id: string,
	iconName: keyof typeof fluentIcons,
): HTMLButtonElement {
	const icon = fluentIcons[iconName];
	const btn = player.createButton(id, icon.title || iconName, () => {});
	player.addClasses(btn, ['btn']);
	btn.style.position = 'relative';
	const iconHolder = document.createElement('span');
	iconHolder.className = 'btn-icon';
	iconHolder.innerHTML = svgFromIcon(icon);
	btn.appendChild(iconHolder);
	return btn;
}

// ── Refs ──────────────────────────────────────────────────────────────────────

export interface CenterRefs {
	centerWrap: HTMLDivElement;
	centerBtn: HTMLButtonElement;
	spinner: HTMLDivElement;
}

export interface BottomBarRefs {
	bottomBar: HTMLDivElement;
	topRow: HTMLDivElement;
	bottomRow: HTMLDivElement;
	sliderRefs: SliderBarRefs;
}

export interface BottomRowRefs {
	playBtn: HTMLButtonElement;
	prevBtn: HTMLButtonElement;
	nextBtn: HTMLButtonElement;
	rewindBtn: HTMLButtonElement;
	forwardBtn: HTMLButtonElement;
	chapBackBtn: HTMLButtonElement;
	chapFwdBtn: HTMLButtonElement;
	volBtn: HTMLButtonElement;
	volSlider: HTMLInputElement;
	volSliderVertical: HTMLDivElement;
	/** The raw volume-container element — callers need it to pass to wireVolumeSlider. */
	volContainer: HTMLDivElement;
	/** The raw vertical-popup input — callers need it to pass to wireVolumeSlider. */
	volVertInput: HTMLInputElement;
	volPopupMuteBtn: HTMLButtonElement;
	currentTimeEl: HTMLDivElement;
	remainingTimeEl: HTMLDivElement;
	aspectRatioBtn: HTMLButtonElement;
	theaterBtn: HTMLButtonElement;
	theaterConfigHidden: boolean;
	pipBtn: HTMLButtonElement;
	speedBtn: HTMLButtonElement;
	subsBtn: HTMLButtonElement;
	audioBtn: HTMLButtonElement;
	qualityBtn: HTMLButtonElement;
	playlistBtn: HTMLButtonElement;
	settingsBtn: HTMLButtonElement;
	fsBtn: HTMLButtonElement;
}

// ── Center ────────────────────────────────────────────────────────────────────

/** Build the center spinner + big-play button and return named refs. */
export function buildCenter(
	player: IVideoPlayer<VideoPlaylistItem>,
	parent: HTMLElement,
): CenterRefs {
	const centerWrap = player.createElement('div', 'center')
		.addClasses(['center'])
		.appendTo(parent)
		.get();

	const spinner = player.createElement('div', 'spinner')
		.addClasses(['spinner'])
		.appendTo(centerWrap)
		.get();
	spinner.innerHTML = '<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="100 28"/></svg>';

	const centerBtn = player.createButton('center-btn', fluentIcons.bigPlay.title || 'Play', () => {});
	player.addClasses(centerBtn, ['center-btn']);
	const centerIconHolder = document.createElement('span');
	centerIconHolder.className = 'btn-icon';
	centerIconHolder.innerHTML = svgFromIcon(fluentIcons.bigPlay, 32);
	centerBtn.appendChild(centerIconHolder);
	centerWrap.appendChild(centerBtn);

	return { centerWrap, centerBtn, spinner };
}

// ── Bottom bar ────────────────────────────────────────────────────────────────

/** Build the bottom-bar skeleton (shadow + top-row + slider + bottom-row). */
export function buildBottomBar(
	player: IVideoPlayer<VideoPlaylistItem>,
	parent: HTMLElement,
	opts: DesktopUiOptions | undefined,
	listen: (target: EventTarget, event: string, fn: (e: Event) => void) => void,
	t: (key: string, params?: Record<string, string>) => string,
): BottomBarRefs & BottomRowRefs {
	const bottomBar = player.createElement('div', 'bottom-bar')
		.addClasses(['bottom-bar'])
		.appendTo(parent)
		.get();

	player.createElement('div', 'bottom-bar-shadow')
		.addClasses(['bottom-bar-shadow'])
		.appendTo(bottomBar);

	const topRow = player.createElement('div', 'top-row')
		.addClasses(['top-row'])
		.appendTo(bottomBar)
		.get();

	const sliderRefs = buildSliderBar(player);
	topRow.appendChild(sliderRefs.sliderBar);

	const bottomRow = player.createElement('div', 'bottom-row')
		.addClasses(['bottom-row'])
		.appendTo(bottomBar)
		.get();

	const rowRefs = buildBottomRow(player, bottomRow, opts, listen, t);

	return { bottomBar, topRow, bottomRow, sliderRefs, ...rowRefs };
}

// ── Bottom row ────────────────────────────────────────────────────────────────

/** Build all buttons and controls inside the bottom row. */
export function buildBottomRow(
	player: IVideoPlayer<VideoPlaylistItem>,
	parent: HTMLElement,
	opts: DesktopUiOptions | undefined,
	listen: (target: EventTarget, event: string, fn: (e: Event) => void) => void,
	t: (key: string, params?: Record<string, string>) => string,
): BottomRowRefs {
	const btns = opts?.buttons;
	const show = (key: keyof DesktopUiButtonOptions): boolean => buttonVisible(key, btns);

	const playBtn = iconBtn(player, 'playback', 'play');
	playBtn.hidden = !show('play');
	parent.appendChild(playBtn);

	const prevBtn = iconBtn(player, 'previous', 'previous');
	prevBtn.hidden = !show('previous');
	parent.appendChild(prevBtn);

	const rewindBtn = iconBtn(player, 'seek-back', 'seekBack');
	rewindBtn.hidden = !show('seekBack');
	parent.appendChild(rewindBtn);

	const forwardBtn = iconBtn(player, 'seek-forward', 'seekForward');
	forwardBtn.hidden = !show('seekForward');
	parent.appendChild(forwardBtn);

	const chapBackBtn = iconBtn(player, 'chapter-back', 'chapterBack');
	chapBackBtn.hidden = !show('chapterPrev');
	parent.appendChild(chapBackBtn);

	const chapFwdBtn = iconBtn(player, 'chapter-forward', 'chapterForward');
	chapFwdBtn.hidden = !show('chapterNext');
	parent.appendChild(chapFwdBtn);

	const nextBtn = iconBtn(player, 'next', 'next');
	nextBtn.hidden = !show('next');
	parent.appendChild(nextBtn);

	const volContainer = player.createElement('div', 'volume-container')
		.addClasses(['volume-container'])
		.appendTo(parent)
		.get();
	volContainer.hidden = !show('mute') && !show('volume');

	// Scroll over the volume cluster adjusts volume (v1: ±delta * 0.5).
	listen(volContainer, 'wheel', (e: Event) => {
		const wheel = e as WheelEvent;
		wheel.preventDefault();
		const current = player.volume?.() ?? 100;
		const next = Math.min(100, Math.max(0, current - wheel.deltaY * 0.5));
		player.volume?.(next);
	});

	const volBtn = iconBtn(player, 'volume', 'volumeHigh');
	volBtn.hidden = !show('mute');
	volContainer.appendChild(volBtn);

	const volSlider = player.createElement('input', 'volume-slider')
		.addClasses(['volume-slider'])
		.appendTo(volContainer)
		.get();
	volSlider.type = 'range';
	volSlider.min = '0';
	volSlider.max = '100';
	volSlider.value = '100';
	volSlider.setAttribute('aria-label', t('a11y.volume'));
	volSlider.hidden = !show('volume');

	// Vertical slider popup (hidden initially; activated by wireVolumeSlider).
	const vertPop = player.createElement('div', 'volume-slider-vertical')
		.addClasses(['volume-slider-vertical'])
		.appendTo(volContainer)
		.get();
	const vertInput = player.createElement('input', 'volume-slider-vertical-input')
		.addClasses(['volume-slider-vertical-input'])
		.appendTo(vertPop)
		.get();
	vertInput.type = 'range';
	vertInput.min = '0';
	vertInput.max = '100';
	vertInput.value = '100';
	vertInput.setAttribute('aria-label', t('a11y.volume'));
	vertInput.setAttribute('orient', 'vertical');

	const volPopupMuteBtn = iconBtn(player, 'vol-popup-mute', 'volumeHigh');
	volPopupMuteBtn.classList.add('vol-popup-mute');
	vertPop.appendChild(volPopupMuteBtn);

	const currentTimeEl = player.createElement('div', 'current-time')
		.addClasses(['current-time', 'time'])
		.appendTo(parent)
		.get();
	currentTimeEl.textContent = '0:00';

	player.createElement('div', 'divider')
		.addClasses(['divider'])
		.appendTo(parent);

	const remainingTimeEl = player.createElement('div', 'remaining-time')
		.addClasses(['remaining-time', 'time'])
		.appendTo(parent)
		.get();
	remainingTimeEl.textContent = '0:00';

	const aspectRatioBtn = iconBtn(player, 'aspect-ratio', 'aspectFit');
	aspectRatioBtn.setAttribute('aria-expanded', 'false');
	aspectRatioBtn.hidden = !show('aspectRatio');
	parent.appendChild(aspectRatioBtn);

	const theaterBtn = iconBtn(player, 'theater', 'theater');
	theaterBtn.hidden = !show('theater');
	const theaterConfigHidden = theaterBtn.hidden;
	parent.appendChild(theaterBtn);

	const pipBtn = iconBtn(player, 'pip', 'pipEnter');
	pipBtn.hidden = !show('pip');
	parent.appendChild(pipBtn);

	const speedBtn = iconBtn(player, 'speed', 'speed');
	speedBtn.setAttribute('aria-label', t('tooltip.speed'));
	speedBtn.setAttribute('aria-expanded', 'false');
	speedBtn.hidden = !show('speed');
	parent.appendChild(speedBtn);

	const subsBtn = iconBtn(player, 'subtitles', 'subtitles');
	subsBtn.setAttribute('aria-expanded', 'false');
	subsBtn.hidden = !show('subtitles');
	parent.appendChild(subsBtn);

	const audioBtn = iconBtn(player, 'audio', 'language');
	audioBtn.setAttribute('aria-expanded', 'false');
	audioBtn.hidden = !show('audio');
	parent.appendChild(audioBtn);

	const qualityBtn = iconBtn(player, 'quality', 'quality');
	qualityBtn.setAttribute('aria-expanded', 'false');
	qualityBtn.hidden = !show('quality');
	parent.appendChild(qualityBtn);

	const playlistBtn = iconBtn(player, 'playlist', 'playlist');
	playlistBtn.setAttribute('aria-expanded', 'false');
	playlistBtn.hidden = !show('playlist');
	parent.appendChild(playlistBtn);

	const settingsBtn = iconBtn(player, 'settings', 'settings');
	settingsBtn.setAttribute('aria-expanded', 'false');
	settingsBtn.hidden = !show('settings');
	parent.appendChild(settingsBtn);

	const fsBtn = iconBtn(player, 'fullscreen', 'fullscreen');
	fsBtn.hidden = !show('fullscreen');
	parent.appendChild(fsBtn);

	applyButtonOrder(parent, opts, {
		playBtn,
		prevBtn,
		nextBtn,
		rewindBtn,
		forwardBtn,
		chapBackBtn,
		chapFwdBtn,
		volBtn,
		speedBtn,
		qualityBtn,
		subsBtn,
		audioBtn,
		aspectRatioBtn,
		theaterBtn,
		pipBtn,
		playlistBtn,
		settingsBtn,
		fsBtn,
		volSlider,
		volSliderVertical: vertPop,
		volContainer,
		volVertInput: vertInput,
		volPopupMuteBtn,
		currentTimeEl,
		remainingTimeEl,
		theaterConfigHidden,
	});

	return {
		playBtn,
		prevBtn,
		nextBtn,
		rewindBtn,
		forwardBtn,
		chapBackBtn,
		chapFwdBtn,
		volBtn,
		volSlider,
		volSliderVertical: vertPop,
		volContainer,
		volVertInput: vertInput,
		volPopupMuteBtn,
		currentTimeEl,
		remainingTimeEl,
		aspectRatioBtn,
		theaterBtn,
		theaterConfigHidden,
		pipBtn,
		speedBtn,
		subsBtn,
		audioBtn,
		qualityBtn,
		playlistBtn,
		settingsBtn,
		fsBtn,
	};
}

// ── Button order ──────────────────────────────────────────────────────────────

/**
 * Apply the consumer's `buttonOrder`: every named button is re-anchored to the
 * end of the bar in the given sequence; unnamed buttons keep their natural
 * position. Visual order only — removal priority during resize stays governed
 * by `buttonPriority`.
 */
export function applyButtonOrder(
	parent: HTMLElement,
	opts: DesktopUiOptions | undefined,
	refs: BottomRowRefs,
): void {
	const order = opts?.buttonOrder;
	if (!order || order.length === 0)
		return;

	const byKey: Partial<Record<keyof DesktopUiButtonOptions, HTMLButtonElement | null>> = {
		play: refs.playBtn,
		mute: refs.volBtn,
		fullscreen: refs.fsBtn,
		settings: refs.settingsBtn,
		next: refs.nextBtn,
		previous: refs.prevBtn,
		seekBack: refs.rewindBtn,
		seekForward: refs.forwardBtn,
		chapterPrev: refs.chapBackBtn,
		chapterNext: refs.chapFwdBtn,
		theater: refs.theaterBtn,
		pip: refs.pipBtn,
		speed: refs.speedBtn,
		quality: refs.qualityBtn,
		subtitles: refs.subsBtn,
		audio: refs.audioBtn,
		aspectRatio: refs.aspectRatioBtn,
		playlist: refs.playlistBtn,
	};

	for (const key of order) {
		const btn = byKey[key];
		if (btn)
			parent.appendChild(btn);
	}
}

// ── Keyboard shortcuts overlay ────────────────────────────────────────────────

/**
 * Build the keyboard shortcuts dialog overlay and return it.
 * The caller stores the element reference and uses `listen` so it gets cleaned
 * up on dispose.
 */
export function buildShortcutsOverlay(
	parent: HTMLElement,
	listen: (target: EventTarget, event: string, fn: (e: Event) => void) => void,
	t: (key: string, params?: Record<string, string>) => string,
	hideShortcuts: () => void,
): HTMLDivElement {
	const overlay = document.createElement('div');
	overlay.id = 'nmplayer-keybinds-dialog';
	overlay.className = 'keybinds-dialog';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');
	overlay.setAttribute('aria-label', t('shortcuts.title'));

	const card = document.createElement('div');
	card.className = 'keybinds-card';

	const heading = document.createElement('h2');
	heading.className = 'keybinds-heading';
	heading.textContent = t('shortcuts.title');
	card.appendChild(heading);

	const sections: ReadonlyArray<ReadonlyArray<{
		title: string;
		entries: ReadonlyArray<{ keys: ReadonlyArray<string>; label: string }>;
	}>> = [
		[
			{
				title: t('shortcuts.group.playback'),
				entries: [
					{ keys: ['Space'], label: t('shortcuts.playPause') },
					{ keys: ['S'], label: t('shortcuts.stop') },
					{ keys: ['E'], label: t('shortcuts.frameAdvance') },
				],
			},
			{
				title: t('shortcuts.group.speed'),
				entries: [
					{ keys: [']'], label: t('shortcuts.speedUp') },
					{ keys: ['['], label: t('shortcuts.speedDown') },
					{ keys: ['='], label: t('shortcuts.normalSpeed') },
				],
			},
			{
				title: t('shortcuts.group.volume'),
				entries: [
					{ keys: ['↑'], label: t('shortcuts.volumeUp') },
					{ keys: ['↓'], label: t('shortcuts.volumeDown') },
					{ keys: ['M'], label: t('shortcuts.mute') },
				],
			},
		],
		[
			{
				title: t('shortcuts.group.seeking'),
				entries: [
					{ keys: ['←'], label: t('shortcuts.seekBack5') },
					{ keys: ['→'], label: t('shortcuts.seekForward5') },
					{ keys: ['Shift', '← / →'], label: t('shortcuts.seek3s') },
					{ keys: ['Alt', '← / →'], label: t('shortcuts.seek10s') },
					{ keys: ['Ctrl', '← / →'], label: t('shortcuts.seek60s') },
				],
			},
			{
				title: t('shortcuts.group.quickSeek'),
				entries: [
					{ keys: ['3'], label: t('shortcuts.seek30s') },
					{ keys: ['6'], label: t('shortcuts.seek60sKey') },
					{ keys: ['9'], label: t('shortcuts.seek90s') },
					{ keys: ['1'], label: t('shortcuts.seek120s') },
				],
			},
			{
				title: t('shortcuts.group.navigation'),
				entries: [
					{ keys: ['N'], label: t('shortcuts.next') },
					{ keys: ['P'], label: t('shortcuts.previous') },
					{ keys: ['Shift', 'N'], label: t('shortcuts.nextChapter') },
					{ keys: ['Shift', 'P'], label: t('shortcuts.previousChapter') },
				],
			},
		],
		[
			{
				title: t('shortcuts.group.tracksAndSubtitles'),
				entries: [
					{ keys: ['V'], label: t('shortcuts.cycleSubs') },
					{ keys: ['B'], label: t('shortcuts.cycleAudio') },
					{ keys: ['A'], label: t('shortcuts.cycleAspect') },
					{ keys: ['+'], label: t('shortcuts.subSizeUp') },
					{ keys: ['–'], label: t('shortcuts.subSizeDown') },
				],
			},
			{
				title: t('shortcuts.group.display'),
				entries: [
					{ keys: ['F'], label: t('shortcuts.fullscreen') },
					{ keys: ['F11'], label: t('shortcuts.fullscreen') },
					{ keys: ['Esc'], label: t('shortcuts.exitFullscreen') },
					{ keys: ['T'], label: t('shortcuts.showTime') },
					{ keys: ['?'], label: t('shortcuts.help') },
				],
			},
		],
	];

	const grid = document.createElement('div');
	grid.className = 'keybinds-grid';

	for (const column of sections) {
		const cell = document.createElement('div');
		cell.className = 'keybinds-column';

		for (const group of column) {
			const groupEl = document.createElement('div');

			const groupTitle = document.createElement('h3');
			groupTitle.className = 'keybinds-group-title';
			groupTitle.textContent = group.title;
			groupEl.appendChild(groupTitle);

			for (const entry of group.entries) {
				const row = document.createElement('div');
				row.className = 'keybinds-row';

				const keysContainer = document.createElement('span');
				keysContainer.className = 'keybinds-keys';

				for (let keyIndex = 0; keyIndex < entry.keys.length; keyIndex++) {
					if (keyIndex > 0) {
						const plus = document.createElement('span');
						plus.className = 'keybinds-plus';
						plus.textContent = '+';
						keysContainer.appendChild(plus);
					}

					const kbd = document.createElement('kbd');
					kbd.className = 'keybinds-key';
					kbd.textContent = entry.keys[keyIndex]!;
					keysContainer.appendChild(kbd);
				}

				const labelEl = document.createElement('span');
				labelEl.className = 'keybinds-label';
				labelEl.textContent = entry.label;

				row.appendChild(keysContainer);
				row.appendChild(labelEl);
				groupEl.appendChild(row);
			}

			cell.appendChild(groupEl);
		}

		grid.appendChild(cell);
	}

	card.appendChild(grid);
	card.appendChild(buildKeyboardDecoration());

	const hintEl = document.createElement('p');
	hintEl.className = 'keybinds-hint';
	hintEl.textContent = t('shortcuts.hint');
	card.appendChild(hintEl);

	overlay.appendChild(card);

	listen(overlay, 'click', (e: Event) => {
		if (e.target === overlay)
			hideShortcuts();
	});

	parent.appendChild(overlay);
	return overlay;
}

/**
 * Build the decorative keyboard SVG shown at the bottom of the shortcuts dialog.
 * Highlights the keys used by NOMERCY.
 */
export function buildKeyboardDecoration(): HTMLDivElement {
	const wrap = document.createElement('div');
	wrap.className = 'keybinds-decoration';

	const highlighted = new Set('NOMERCY'.split(''));
	const keyRows = [
		'1234567890-='.split(''),
		'QWERTYUIOP'.split(''),
		'ASDFGHJKL'.split(''),
		'ZXCVBNM'.split(''),
	];
	const rowOffsets = [0, 10, 22, 38];
	let svgKeys = '';
	for (let rowIdx = 0; rowIdx < keyRows.length; rowIdx++) {
		const row = keyRows[rowIdx]!;
		for (let keyIdx = 0; keyIdx < row.length; keyIdx++) {
			const kx = keyIdx * 28 + rowOffsets[rowIdx]!;
			const ky = rowIdx * 30;
			const letter = row[keyIdx]!;
			const opacity = highlighted.has(letter) ? '1' : '0.35';
			svgKeys += `<rect x="${kx}" y="${ky}" width="24" height="24" rx="4" fill="white" opacity="${opacity}"/>`;
			if (highlighted.has(letter)) {
				svgKeys += `<text x="${kx + 12}" y="${ky + 16}" text-anchor="middle" fill="black" font-size="11" font-family="monospace" font-weight="700" opacity="0.7">${letter}</text>`;
			}
		}
	}
	svgKeys += '<rect x="110" y="120" width="160" height="24" rx="4" fill="white" opacity="0.35"/>';
	wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 412 164" width="450" height="180">${svgKeys}</svg>`;
	return wrap;
}
