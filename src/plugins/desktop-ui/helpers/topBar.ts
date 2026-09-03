// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Top-bar concern — title bar DOM construction and title/show-info update.
 * Also owns the TV current-item info block (show title, episode, episode
 * title) in the top-right corner.
 *
 * Integration: `buildTitleBar()` is called from `DesktopUiPlugin.buildDom()`.
 * It returns `TopBarRefs` which the plugin stores for later updates via
 * `updateTitleBar()`; back/close visibility is the plugin's
 * `applyStateVisibility()` (listener gate composed with PiP hiding).
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

import type { DesktopUiOptions } from '../index';

import { addClasses, createButton, createElement } from '@nomercy-entertainment/nomercy-player-core';
import { fluentIcons, svgFromIcon } from '../data/icons';

// ── Refs ───────────────────────────────────────────────────────────────────────

export interface TopBarRefs {
	bar: HTMLDivElement;
	/**
	 * Right column containing title + show-info. Toggle this for hideTitle,
	 *  not the whole bar — the left column carries back/cast/close buttons that
	 *  must stay reachable even when titles are hidden.
	 */
	right: HTMLDivElement;
	titleText: HTMLSpanElement;
	showInfoText: HTMLSpanElement;
	backBtn: HTMLButtonElement;
	/**
	 * Opt-in cast affordance. Click only emits the `cast` player event — the
	 * consumer opens its own device picker. Never wire this to
	 * `CastSenderPlugin` / `session.loadMedia()`.
	 */
	castBtn: HTMLButtonElement;
	closeBtn: HTMLButtonElement;
}

// ── DOM construction ───────────────────────────────────────────────────────────

/** Build the top bar (back/cast/close buttons + show info + title + TV current item) and return named refs. */
export function buildTitleBar(
	player: IVideoPlayer<VideoPlaylistItem>,
	parent: HTMLElement,
	opts?: DesktopUiOptions,
): TopBarRefs {
	const bar = createElement('div', 'top-bar')
		.addClasses(['top-bar'])
		.appendTo(parent)
		.get();

	const left = createElement('div', 'top-bar-left')
		.addClasses(['top-bar-left'])
		.appendTo(bar)
		.get();

	const backBtn = createButton('back-btn', player.t('plugin.desktop-ui.menu.back'), () => {
		player.emit('back', undefined);
	});
	addClasses(backBtn, ['back-btn']);
	backBtn.innerHTML = svgFromIcon(fluentIcons.back);
	backBtn.hidden = true;
	left.appendChild(backBtn);

	// Opt-in only — gated by `DesktopUiButtonOptions.cast`, never by listener
	// presence (unlike back/close). The click is purely a surfaced intent;
	// the consumer owns the device picker (`aria-haspopup="dialog"` reflects that).
	const castBtn = createButton('cast-btn', player.t('plugin.desktop-ui.button.cast'), () => {
		player.emit('cast', undefined);
	});
	addClasses(castBtn, ['cast-btn']);
	castBtn.innerHTML = svgFromIcon(fluentIcons.cast);
	castBtn.setAttribute('aria-haspopup', 'dialog');
	castBtn.hidden = !opts?.buttons?.cast;
	left.appendChild(castBtn);

	const closeBtn = createButton('close-btn', player.t('plugin.desktop-ui.menu.close'), () => {
		player.emit('close', undefined);
	});
	addClasses(closeBtn, ['close-btn']);
	closeBtn.innerHTML = svgFromIcon(fluentIcons.close);
	closeBtn.hidden = true;
	left.appendChild(closeBtn);

	const right = createElement('div', 'top-bar-right')
		.addClasses(['top-bar-right'])
		.appendTo(bar)
		.get();

	// Mirrors the Android MobileTopBar two-line layout: primary `title`
	// (show name or movie title) on top, secondary `show-info` (season +
	// episode + episode title) below — only rendered when non-empty.
	const titleText = createElement('span', 'title')
		.addClasses(['title'])
		.appendTo(right)
		.get();

	const showInfoText = createElement('span', 'show-info')
		.addClasses(['show-info'])
		.appendTo(right)
		.get();

	return {
		bar,
		right,
		titleText,
		showInfoText,
		backBtn,
		castBtn,
		closeBtn,
	};
}

// ── Update helpers ─────────────────────────────────────────────────────────────

/**
 * Sync the title bar text content to the current playlist item.
 *  Mirrors `MobileTopBar.kt` (Android): primary line is the show name when the
 *  item belongs to a series, otherwise the movie title; secondary line is
 *  `S{n}E{n} • {episodeTitle}` for TV, `Extras E{n} • {episodeTitle}` for
 *  season-0 specials, blank for movies.
 */
export function updateTitleBar(
	player: IVideoPlayer<VideoPlaylistItem>,
	refs: TopBarRefs,
	item: VideoPlaylistItem | undefined | null,
): void {
	if (!refs.titleText)
		return;

	const show = item?.show?.trim() ?? '';
	const rawTitle = item?.title?.trim() ?? '';
	const hasShow = show.length > 0;
	const hasEpisode = typeof item?.episode === 'number';
	const seasonNum = typeof item?.season === 'number' ? item.season : null;
	const episodeNum = typeof item?.episode === 'number' ? item.episode : null;

	// Primary: show name for series, otherwise the movie/standalone title.
	refs.titleText.textContent = hasShow ? show : rawTitle;

	// Secondary: episode label + episode title (when applicable).
	let secondary = '';
	if (hasShow && hasEpisode) {
		const epTitle = rawTitle && rawTitle !== show ? rawTitle : '';

		if (seasonNum !== null && seasonNum > 0) {
			const seasonLabel = player.t('plugin.desktop-ui.token.season', { number: String(seasonNum) });
			const episodeLabel = player.t('plugin.desktop-ui.token.episode', { number: String(episodeNum) });
			const label = `${seasonLabel}${episodeLabel}`;
			secondary = epTitle ? `${label} • ${epTitle}` : label;
		}
		else if (seasonNum === 0) {
			const extrasLabel = player.t('plugin.desktop-ui.token.extras');
			const episodeLabel = player.t('plugin.desktop-ui.token.episode', { number: String(episodeNum) });
			const label = `${extrasLabel} ${episodeLabel}`;
			secondary = epTitle ? `${label} • ${epTitle}` : label;
		}
		else {
			const label = player.t('plugin.desktop-ui.token.episode', { number: String(episodeNum) });
			secondary = epTitle ? `${label} • ${epTitle}` : label;
		}
	}

	refs.showInfoText.textContent = secondary;
	refs.showInfoText.hidden = secondary.length === 0;
}
