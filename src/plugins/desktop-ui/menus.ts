// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Menu DOM builders for the desktop UI plugin.
 *
 * Menu-frame structure:
 *
 *   menu-frame-dialog (<dialog>)
 *     └─ menu-wrapper
 *        └─ menu-frame   (.open when any menu is showing)
 *           └─ menu-content   (.sub-menu-open when a sub-menu replaces main)
 *              ├─ main-menu        (back-button list of categories)
 *              └─ sub-menu         (slot that holds one of the sub-menu-content panes)
 *                  ├─ language-menu        (sub-menu-content.is-open when active)
 *                  ├─ subtitle-menu
 *                  ├─ quality-menu
 *                  └─ speed-menu
 *
 * The plugin owns DOM listener cleanup via `this.listen(...)`, so each
 * builder takes a `listen` helper and a small action-callback bag.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';
import type { AudioTrackRef, QualityLevel, SubtitleTrackRef } from '../../types';
import type { SubtitleStyle } from './buttons';
import { readItemImage } from '../../player/itemImage';
import {
	colors,
	defaultSubtitleStyles,
	edgeStyles,
	fontFamilies,
	subtitleSettingActions,

} from './buttons';
import { fluentIcons, svgFromIcon } from './icons';
import { languageDisplayName, subtitleTrackLabel } from './language-names';
import { fmt } from './progressBar';

export type MenuListen = (target: EventTarget, event: string, fn: (e: Event) => void) => void;

export const SUB_MENU_ID = {
	LANGUAGE: 'language',
	SUBTITLES: 'subtitles',
	QUALITY: 'quality',
	SPEED: 'speed',
	PLAYLIST: 'playlist',
	SUBTITLE_SETTINGS: 'subtitleSettings',
	ASPECT_RATIO: 'aspectRatio',
} as const;

export type SubMenuId = typeof SUB_MENU_ID[keyof typeof SUB_MENU_ID];

export interface MenuActions {
	closeMenu: () => void;
	openSubMenu: (id: SubMenuId) => void;
	backToMain: () => void;
}

/** Build the empty `<dialog>` shell + main-menu + sub-menu containers. */
export interface MenuFrameRefs {
	frameDialog: HTMLDialogElement;
	frame: HTMLDivElement;
	content: HTMLDivElement;
	main: HTMLDivElement;
	sub: HTMLDivElement;
	/**
	 * A map of sub-menu id → its sub-menu-content pane. The plugin
	 *  populates these on demand as data changes.
	 */
	panes: Record<SubMenuId, HTMLDivElement>;
	/**
	 * A map of sub-menu id → its corresponding main-menu button.
	 *  The plugin toggles `display: none` on these when a category has
	 *  no available options.
	 */
	mainButtons: Record<SubMenuId, HTMLButtonElement>;
}

/**
 * Consumer-supplied toggle row for the settings main menu — the menu
 * counterpart of the `buttons` map. `label` resolves at render time so
 * i18n applies; `get`/`set` bind the row to wherever the state lives
 * (a plugin, app storage, ...).
 */
export interface SettingsToggleItem {
	id: string;
	label: () => string;
	get: () => boolean;
	set: (value: boolean) => void;
}

export function buildMenuFrame(
	player: IVideoPlayer,
	parent: HTMLElement,
	listen: MenuListen,
	actions: MenuActions,
	settingsItems?: ReadonlyArray<SettingsToggleItem>,
): MenuFrameRefs {
	const frameDialog = player.createElement('dialog', 'menu-frame-dialog')
		.addClasses(['menu-frame-dialog'])
		.appendTo(parent)
		.get();
	frameDialog.setAttribute('popover', 'manual');
	frameDialog.setAttribute('role', 'modal');

	const wrapper = player.createElement('div', 'menu-wrapper')
		.addClasses(['menu-wrapper'])
		.appendTo(frameDialog)
		.get();

	const frame = player.createElement('div', 'menu-frame')
		.addClasses(['menu-frame'])
		.appendTo(wrapper)
		.get();

	const content = player.createElement('div', 'menu-content')
		.addClasses(['menu-content'])
		.appendTo(frame)
		.get();

	const main = buildMainMenu(player, content, listen, actions, settingsItems);
	const sub = player.createElement('div', 'sub-menu')
		.addClasses(['sub-menu'])
		.appendTo(content)
		.get();

	const panes: Record<SubMenuId, HTMLDivElement> = {
		language: buildSubMenuPane(player, sub, 'language', player.t('plugin.desktop-ui.menu.audio'), listen, actions),
		subtitles: buildSubMenuPane(player, sub, 'subtitles', player.t('plugin.desktop-ui.menu.subtitles'), listen, actions),
		quality: buildSubMenuPane(player, sub, 'quality', player.t('plugin.desktop-ui.menu.quality'), listen, actions),
		speed: buildSubMenuPane(player, sub, 'speed', player.t('plugin.desktop-ui.menu.speed'), listen, actions),
		playlist: buildPlaylistPaneShell(player, sub, listen, actions),
		subtitleSettings: buildSubMenuPane(player, sub, 'subtitleSettings', player.t('plugin.desktop-ui.menu.subtitleSettings'), listen, actions),
		aspectRatio: buildSubMenuPane(player, sub, 'aspectRatio', player.t('plugin.desktop-ui.menu.aspectRatio'), listen, actions),
	};

	return {
		frameDialog,
		frame,
		content,
		main,
		sub,
		panes,
		mainButtons: {
			language: main.querySelector<HTMLButtonElement>('#menu-button-language')!,
			subtitles: main.querySelector<HTMLButtonElement>('#menu-button-subtitles')!,
			quality: main.querySelector<HTMLButtonElement>('#menu-button-quality')!,
			speed: main.querySelector<HTMLButtonElement>('#menu-button-speed')!,
			playlist: main.querySelector<HTMLButtonElement>('#menu-button-playlist')!,
			subtitleSettings: main.querySelector<HTMLButtonElement>('#menu-button-subtitleSettings')!,
			aspectRatio: main.querySelector<HTMLButtonElement>('#menu-button-aspectRatio')!,
		},
	};
}

function buildMainMenu(
	player: IVideoPlayer,
	parent: HTMLElement,
	listen: MenuListen,
	actions: MenuActions,
	settingsItems?: ReadonlyArray<SettingsToggleItem>,
): HTMLDivElement {
	const main = player.createElement('div', 'main-menu')
		.addClasses(['main-menu'])
		.appendTo(parent)
		.get();

	// Header (title + close) — mirrors the sub-menu shell so the main menu
	// has the same visual rhythm as every category pane.
	const header = player.createElement('div', 'menu-header-main')
		.addClasses(['menu-header'])
		.appendTo(main)
		.get();

	const titleSpan = document.createElement('span');
	titleSpan.className = 'menu-button-text';
	titleSpan.textContent = player.t('plugin.desktop-ui.menu.settings');
	header.appendChild(titleSpan);

	const closeBtn = player.createButton('menu-close', player.t('plugin.desktop-ui.menu.close'), () => {});
	closeBtn.classList.add('menu-header-close');
	closeBtn.innerHTML = svgFromIcon(fluentIcons.close);
	header.appendChild(closeBtn);
	listen(closeBtn, 'click', (e: Event) => { e.stopPropagation(); actions.closeMenu(); });

	// Scroll container — same `.scroll-container` styling as the sub-menus.
	const scroll = player.createElement('div', 'main-scroll-container')
		.addClasses(['scroll-container', 'main-scroll-container'])
		.appendTo(main)
		.get();

	// Category buttons: language, subtitles, subtitle settings,
	// quality, speed, aspect ratio, playlist.
	const cats: { id: SubMenuId; labelKey: string; iconKey: keyof typeof fluentIcons }[] = [
		{ id: 'language', labelKey: 'plugin.desktop-ui.menu.audio', iconKey: 'language' },
		{ id: 'subtitles', labelKey: 'plugin.desktop-ui.menu.subtitles', iconKey: 'subtitles' },
		{ id: 'subtitleSettings', labelKey: 'plugin.desktop-ui.menu.subtitleSettings', iconKey: 'subtitleSettings' },
		{ id: 'quality', labelKey: 'plugin.desktop-ui.menu.quality', iconKey: 'quality' },
		{ id: 'speed', labelKey: 'plugin.desktop-ui.menu.speed', iconKey: 'speed' },
		{ id: 'aspectRatio', labelKey: 'plugin.desktop-ui.menu.aspectRatio', iconKey: 'aspectFit' },
		{ id: 'playlist', labelKey: 'plugin.desktop-ui.menu.playlist', iconKey: 'playlist' },
	];
	for (const c of cats) {
		const label = player.t(c.labelKey);
		const btn = player.createButton(`menu-button-${c.id}`, label, () => {});
		btn.classList.add('language-button');
		btn.innerHTML = `
            <span class="menu-button-icon-left">${svgFromIcon(fluentIcons[c.iconKey])}</span>
            <span class="menu-button-text">${label}</span>
            <span class="menu-button-chevron">${svgFromIcon(fluentIcons.chevronR)}</span>
        `;
		scroll.appendChild(btn);
		listen(btn, 'click', (e: Event) => { e.stopPropagation(); actions.openSubMenu(c.id); });
	}

	// Consumer toggle rows — same row chrome as category buttons, with the
	// checkmark reflecting the bound state instead of a chevron.
	for (const item of settingsItems ?? []) {
		const btn = player.createButton(`menu-toggle-${item.id}`, item.label(), () => {});
		btn.classList.add('language-button');
		btn.setAttribute('role', 'switch');
		const paint = (): void => {
			const on = item.get();
			btn.classList.toggle('is-active', on);
			btn.setAttribute('aria-checked', String(on));
			btn.innerHTML = `
            <span class="menu-button-text">${item.label()}</span>
            <span class="menu-button-check">${svgFromIcon(fluentIcons.checkmark, 18)}</span>
        `;
		};
		paint();
		// The menu builds at plugin registration, often before the consumer
		// plugin owning the label's bundle has loaded — repaint on language
		// load so the row never shows a raw key.
		player.on?.('language', paint);
		scroll.appendChild(btn);
		listen(btn, 'click', (e: Event) => {
			e.stopPropagation();
			item.set(!item.get());
			paint();
		});
	}

	return main;
}

/**
 * Build the two-pane playlist shell: a Seasons rail on the left
 * (with its own back/title/close header and an empty scroll container
 * for season buttons) and a wider Episodes rail on the right (with a
 * close-only header and the rich-card episode list).
 *
 * The empty rails are populated by `renderPlaylistPane`.
 */
function buildPlaylistPaneShell(
	player: IVideoPlayer,
	parent: HTMLElement,
	listen: MenuListen,
	actions: MenuActions,
): HTMLDivElement {
	const root = player.createElement('div', 'playlist-menu')
		.addClasses(['sub-menu-content', 'playlist-menu'])
		.appendTo(parent)
		.get();

	// Header — flex column header.
	const header = player.createElement('div', 'menu-header-playlist')
		.addClasses(['menu-header'])
		.appendTo(root)
		.get();

	const back = player.createButton('playlist-back', player.t('plugin.desktop-ui.menu.back'), () => {});
	back.classList.add('menu-header-back');
	back.innerHTML = svgFromIcon(fluentIcons.chevronL);
	header.appendChild(back);
	listen(back, 'click', (e: Event) => { e.stopPropagation(); actions.backToMain(); });

	const title = document.createElement('span');
	title.className = 'menu-button-text playlist-title';
	title.textContent = player.t('plugin.desktop-ui.menu.playlist');
	header.appendChild(title);

	const close = player.createButton('playlist-close', player.t('plugin.desktop-ui.menu.close'), () => {});
	close.classList.add('menu-header-close');
	close.innerHTML = svgFromIcon(fluentIcons.close);
	header.appendChild(close);
	listen(close, 'click', (e: Event) => { e.stopPropagation(); actions.closeMenu(); });

	// Row wrapper — flex-row containing the two columns.
	const cols = player.createElement('div', 'playlist-cols')
		.addClasses(['playlist-cols'])
		.appendTo(root)
		.get();

	// Seasons column.
	const seasons = player.createElement('div', 'playlist-seasons-pane')
		.addClasses(['sub-menu-content', 'seasons-pane'])
		.appendTo(cols)
		.get();
	player.createElement('div', 'playlist-seasons-scroll-container')
		.addClasses(['scroll-container', 'playlist-seasons-scroll-container'])
		.appendTo(seasons);

	// Episode column.
	const episodes = player.createElement('div', 'episode-menu')
		.addClasses(['sub-menu-content', 'episode-menu'])
		.appendTo(cols)
		.get();
	player.createElement('div', 'playlist-scroll-container')
		.addClasses(['scroll-container', 'playlist-scroll-container'])
		.appendTo(episodes);

	return root;
}

function buildSubMenuPane(
	player: IVideoPlayer,
	parent: HTMLElement,
	id: SubMenuId,
	title: string,
	listen: MenuListen,
	actions: MenuActions,
): HTMLDivElement {
	const pane = player.createElement('div', `${id}-menu`)
		.addClasses(['sub-menu-content', `${id}-menu`])
		.appendTo(parent)
		.get();

	const header = player.createElement('div', `menu-header-${id}`)
		.addClasses(['menu-header'])
		.appendTo(pane)
		.get();
	const back = player.createButton(`menu-back-${id}`, player.t('plugin.desktop-ui.menu.back'), () => {});
	back.classList.add('menu-header-back');
	back.innerHTML = svgFromIcon(fluentIcons.chevronL);
	header.appendChild(back);
	listen(back, 'click', (e: Event) => { e.stopPropagation(); actions.backToMain(); });

	const titleSpan = document.createElement('span');
	titleSpan.className = 'menu-button-text';
	titleSpan.textContent = title;
	header.appendChild(titleSpan);

	const close = player.createButton(`menu-close-${id}`, player.t('plugin.desktop-ui.menu.close'), () => {});
	close.classList.add('menu-header-close');
	close.innerHTML = svgFromIcon(fluentIcons.close);
	header.appendChild(close);
	listen(close, 'click', (e: Event) => { e.stopPropagation(); actions.closeMenu(); });

	player.createElement('div', `${id}-scroll-container`)
		.addClasses(['scroll-container', `${id}-scroll-container`])
		.appendTo(pane);
	return pane;
}

// ── Pane content renderers ─────────────────────────────────────────────
// Each renderer wipes the scroll-container of its pane and rebuilds the
// list. Called on initial wire and on every relevant player event change.

export interface MenuRenderState {
	/** Active subtitle index, or -1 / null when subtitles are off. */
	subtitleIdx: number | null;
	/** Active audio track index. -1 = none / default. */
	audioIdx: number;
	/** Active quality level index, or `'auto'` for auto. */
	qualityIdx: number | 'auto';
	/**
	 * Level the backend is actually playing right now. In Auto mode this
	 * differs from `qualityIdx` (which stays `'auto'`); the menu surfaces it
	 * as a lower-importance sublabel on the Auto row. Null before the first
	 * `level-switched` event lands or for non-HLS sources.
	 */
	playingQualityIdx?: number | null;
}

export function renderSpeedPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.speed-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();
	const rates: number[] = player.playbackRates?.() ?? [0.5, 0.75, 1, 1.25, 1.5, 2];
	const cur = player.playbackRate?.() ?? 1;
	for (const r of rates) {
		const btn = player.createButton(`speed-button-${r}`, `${r}×`, () => {});
		btn.classList.add('language-button');
		if (r === cur)
			btn.classList.add('is-active');
		btn.innerHTML = `
            <span class="menu-button-text">${r === 1 ? player.t('plugin.desktop-ui.menu.normal') : `${r}×`}</span>
            <span class="menu-button-check">${svgFromIcon(fluentIcons.checkmark, 18)}</span>
        `;
		scroll.appendChild(btn);
		listen(btn, 'click', () => { player.playbackRate?.(r); onPick(); });
	}
}

export function renderQualityPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
	state: MenuRenderState,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.quality-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();
	const allLevels: QualityLevel[] = player.qualityLevels?.() ?? [];
	// Drop HDR levels when the active display can't render HDR — the browser
	// would decode them but the colours would map back to SDR and look wrong.
	const displayHdr = typeof window !== 'undefined'
		&& typeof window.matchMedia === 'function'
		&& window.matchMedia('(dynamic-range: high)').matches;
	const levels = allLevels.filter(q => q.dynamicRange !== 'hdr' || displayHdr);
	const auto = state.qualityIdx === 'auto';
	// In Auto mode the Auto row gets the primary checkmark. The level the
	// backend is actually playing right now is shown as a lower-importance
	// sublabel — so the user keeps the "I'm in Auto" signal while still
	// seeing what quality is on screen.
	// `playingQualityIdx` is the full HLS level index. `qualityLevels()`
	// returns a filtered subset (unsupported codecs dropped, HDR hidden when
	// the display can't render it), so a positional lookup gives the wrong
	// entry — match by the `index` property carried on each QualityLevel.
	const playingIdx = state.playingQualityIdx ?? null;
	const playingLevel = playingIdx !== null
		? levels.find(q => q.index === playingIdx)
		: undefined;
	const playingLabel = playingLevel
		? (playingLevel.label || (playingLevel.height ? `${playingLevel.height}p` : undefined))
		: undefined;
	appendChoice(scroll, 'quality-auto', player.t('plugin.desktop-ui.menu.auto'), auto, () => { player.quality?.('auto'); onPick(); }, listen, player, {
		sublabel: auto && playingLabel ? playingLabel : undefined,
	});
	levels.forEach((q, i) => {
		const label = q.label || (q.height ? `${q.height}p` : `Level ${i + 1}`);
		const id = `quality-${q.height ?? '?'}-${q.bitrate ?? i}`;
		appendChoice(
			scroll,
			id,
			label,
			!auto && state.qualityIdx === i,
			() => { player.quality?.(i); onPick(); },
			listen,
			player,
		);
	});
}

export function renderSubsPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
	state: MenuRenderState,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.subtitles-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();
	// The kit's `subtitles()` returns the union of HLS-managed and
	// sidecar VTT tracks, so the renderer just consumes one flat list.
	const subs: SubtitleTrackRef[] = player.subtitles?.() ?? [];
	const off = state.subtitleIdx === null || state.subtitleIdx === -1;
	const uiLanguage = typeof player.language?.() === 'string' ? player.language() as unknown as string : 'en';
	appendChoice(scroll, 'off-button-', player.t('plugin.desktop-ui.menu.off'), off, () => { player.subtitle?.(null); onPick(); }, listen, player);
	subs.forEach((s, i) => {
		const langSlug = (s.language ?? s.id).replace(/\W+/g, '-').toLowerCase();
		// The variant lives in `type` ('full' / 'sign' / 'sdh' …); `kind` is the
		// WebVTT kind ('subtitles' / 'captions') and never distinguishes rows.
		const variantSlug = (s.type ?? 'full').replace(/\W+/g, '-').toLowerCase();
		appendChoice(
			scroll,
			`${variantSlug}-button-${langSlug}`,
			subtitleTrackLabel(s, uiLanguage, key => player.t(key), `Track ${i + 1}`),
			!off && state.subtitleIdx === i,
			() => { player.subtitle?.(i); onPick(); },
			listen,
			player,
		);
	});
}

/**
 * Subtitle Settings sub-menu. Lists the configurable subtitle properties
 * (Font, Text size, Text color, Text opacity, Edge style, Area color,
 * Area opacity, Background color, Background opacity) plus a Reset row.
 *
 * Each row shows the current value and a chevron — clicking it swaps
 * the pane's body to a property-specific picker (rendered by
 * `renderSubtitlePropertyPane`). The back arrow returns to this list.
 *
 * `IVideoPlayer` doesn't expose a `subtitleStyle()` API, so the active
 * style is kept in module state and written through to the player only
 * when the method is present.
 */
const SETTING_ROWS: Array<{ labelKey: string; property: keyof SubtitleStyle | '' }> = [
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.font', property: 'fontFamily' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.textSize', property: 'fontSize' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.textColor', property: 'textColor' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.textOpacity', property: 'textOpacity' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.edgeStyle', property: 'edgeStyle' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.backgroundColor', property: 'backgroundColor' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.backgroundOpacity', property: 'backgroundOpacity' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.areaColor', property: 'areaColor' },
	{ labelKey: 'plugin.desktop-ui.menu.subtitle.areaOpacity', property: 'windowOpacity' },
	{ labelKey: 'plugin.desktop-ui.menu.reset', property: '' },
];

/**
 * Read the active subtitle style straight from the kit. The kit
 * lazily seeds defaults on first read, so consumers never have to
 * worry about an uninitialized state.
 */
function readSubtitleStyle(player: IVideoPlayer): SubtitleStyle {
	return player.subtitleStyle?.() ?? { ...defaultSubtitleStyles };
}

function writeSubtitleStyle(player: IVideoPlayer, patch: Partial<SubtitleStyle>): void {
	player.subtitleStyle?.(patch);
}

function writeSubtitleStyleKey<K extends keyof SubtitleStyle>(
	player: IVideoPlayer,
	key: K,
	value: SubtitleStyle[K],
): void {
	const patch: Partial<SubtitleStyle> = {};
	patch[key] = value;
	writeSubtitleStyle(player, patch);
}

/**
 * Format a subtitle-style value for display in the settings menu:
 *   - fontFamily / edgeStyle  → human-readable `name` from `fontFamilies` / `edgeStyles`
 *   - {textColor,
 *      backgroundColor,
 *      areaColor}             → title-cased `label` from the shared `colors` table
 *                               (e.g. `'white'` → `'White'`)
 *   - any other number         → append `'%'` (covers fontSize, textOpacity,
 *                                backgroundOpacity, windowOpacity — all
 *                                percentage scales)
 */
function formatSettingValue(prop: keyof SubtitleStyle, value: unknown): string {
	if (prop === 'fontFamily')
		return fontFamilies.find(f => f.value === value)?.name ?? String(value);
	if (prop === 'edgeStyle')
		return edgeStyles.find(e => e.value === value)?.name ?? String(value);
	if (prop === 'textColor' || prop === 'backgroundColor' || prop === 'areaColor') {
		return colors.find(c => c.value === value)?.label ?? toTitleCase(String(value));
	}
	if (typeof value === 'number')
		return `${value}%`;
	return toTitleCase(String(value));
}

function toTitleCase(s: string): string {
	return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

export function renderSubtitleSettingsPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.subtitleSettings-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();

	const style = readSubtitleStyle(player);

	for (const row of SETTING_ROWS) {
		const rowLabel = player.t(row.labelKey);
		const id = `subtitleSetting-button-${row.labelKey.replace(/\W+/g, '-').toLowerCase()}`;
		const btn = player.createButton(id, rowLabel, () => {});
		btn.classList.add('language-button');
		const valueText = row.property
			? formatSettingValue(row.property, style[row.property as keyof SubtitleStyle])
			: '';
		const chevronOrEmpty = row.property
			? `<span class="menu-button-chevron">${svgFromIcon(fluentIcons.chevronR, 18)}</span>`
			: '';
		btn.innerHTML = `
            <span class="menu-button-text">${escapeHtml(rowLabel)}</span>
            ${valueText ? `<span class="menu-button-subtext">${escapeHtml(valueText)}</span>` : ''}
            ${chevronOrEmpty}
        `;
		scroll.appendChild(btn);

		listen(btn, 'click', (e: Event) => {
			e.stopPropagation();
			if (row.property) {
				renderSubtitlePropertyPane(pane, player, listen, onPick, rowLabel, row.property);
			}
			else {
				// Reset writes back the defaults, then repaints the row list
				// so each value reflects the new state.
				writeSubtitleStyle(player, { ...defaultSubtitleStyles });
				renderSubtitleSettingsPane(pane, player, listen, onPick);
			}
		});
	}
}

/**
 * Property-specific picker (Font / Text size / etc.). Replaces the
 * pane's scroll-container content with the available actions for that
 * property; clicking back returns to the main settings list.
 */
function renderSubtitlePropertyPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
	label: string,
	property: keyof SubtitleStyle,
): void {
	const header = pane.querySelector<HTMLDivElement>('.menu-header');
	const titleEl = header?.querySelector<HTMLSpanElement>('.menu-button-text');
	if (titleEl)
		titleEl.textContent = label;
	const back = header?.querySelector<HTMLButtonElement>('.menu-header-back');
	if (back) {
		// Override the back-to-main behavior on this pane to return to
		// the settings rows. Clone-replace the listener so a fresh
		// closure runs even on subsequent clicks.
		const fresh = back.cloneNode(true) as HTMLButtonElement;
		back.replaceWith(fresh);
		listen(fresh, 'click', (e: Event) => {
			e.stopPropagation();
			if (titleEl)
				titleEl.textContent = player.t('plugin.desktop-ui.menu.subtitleSettings');
			renderSubtitleSettingsPane(pane, player, listen, onPick);
			// Restore the default back-to-main behavior on the next
			// mount of the back button (handled by buildSubMenuPane on
			// next pane open).
		});
	}

	const scroll = pane.querySelector<HTMLDivElement>('.subtitleSettings-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();

	const actions = subtitleSettingActions(player).filter(a => a.property === property);
	const currentValue = readSubtitleStyle(player)[property];

	for (const action of actions) {
		const id = `subtitleSetting-action-${property}-${String(action.value).replace(/\W+/g, '-').toLowerCase()}`;
		const btn = player.createButton(id, action.label, () => {});
		btn.classList.add('language-button');
		const isActive = action.value === currentValue;
		if (isActive)
			btn.classList.add('is-active');
		btn.innerHTML = `
            <span class="menu-button-text">${escapeHtml(action.label)}</span>
            <span class="menu-button-check">${svgFromIcon(fluentIcons.checkmark, 18)}</span>
        `;
		scroll.appendChild(btn);
		listen(btn, 'click', (e: Event) => {
			e.stopPropagation();
			// Each action calls the player API, updates local fallback state,
			// and repaints the picker so the checkmark moves.
			try { action.action?.(); }
			catch { /* tolerate */ }
			if (property)
				writeSubtitleStyleKey(player, property, action.value as SubtitleStyle[typeof property]);
			renderSubtitlePropertyPane(pane, player, listen, onPick, label, property);
		});
	}
}

/**
 * Optional image base — pass via `imageBaseUrl` if your playlist items
 *  carry relative TMDB-style paths (e.g. `/w780/abc.jpg`).
 */
export interface PlaylistRenderOptions {
	imageBaseUrl?: string;
}

/**
 * Playlist sub-menu — rich-card layout.
 *
 * Adaptive layout:
 *   - Flat playlist (no `season` field on any item): the seasons rail is
 *     hidden, the episodes rail fills the full width.
 *   - Seasonal playlist (at least one item carries `season`): the left
 *     rail shows season buttons; clicking a season filters the right rail
 *     to that season's episodes.
 */
export function renderPlaylistPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
	opts: PlaylistRenderOptions = {},
): void {
	const queue: ReadonlyArray<VideoPlaylistItem> = player.queue?.() ?? [];
	const curIdx = player.index?.() ?? 0;

	const hasSeason = queue.some(item => typeof item.season === 'number');

	const episodePane = pane.querySelector<HTMLDivElement>('.episode-menu');
	const seasonScroll = pane.querySelector<HTMLDivElement>('.playlist-seasons-scroll-container');
	const scroll = pane.querySelector<HTMLDivElement>('.playlist-scroll-container');
	const title = pane.querySelector<HTMLSpanElement>('.playlist-title');

	if (title)
		title.textContent = hasSeason ? player.t('plugin.desktop-ui.menu.episodes') : player.t('plugin.desktop-ui.menu.playlist');

	if (!scroll || !episodePane)
		return;

	if (!hasSeason) {
		pane.classList.add('playlist-flat');
		scroll.replaceChildren();
		queue.forEach((item, idx) => {
			scroll.appendChild(buildPlaylistCard(player, item, idx, idx === curIdx, listen, onPick, opts));
		});
		return;
	}

	pane.classList.remove('playlist-flat');

	const seasons = Array.from(new Set(queue.map(it => it.season).filter((s): s is number => typeof s === 'number'))).sort((a, b) => a - b);
	const currentItem = queue[curIdx];
	const activeSeason = typeof currentItem?.season === 'number' ? currentItem.season : (seasons[0] ?? 1);

	if (seasonScroll) {
		seasonScroll.replaceChildren();
		for (const sNum of seasons) {
			const seasonLabel = player.t('plugin.desktop-ui.menu.season', { number: String(sNum) });
			const btn = player.createButton(`season-button-${sNum}`, seasonLabel, () => {});
			btn.classList.add('language-button');
			if (sNum === activeSeason)
				btn.classList.add('is-active');
			btn.innerHTML = `<span class="menu-button-text">${escapeHtml(seasonLabel)}</span>`;
			seasonScroll.appendChild(btn);
			listen(btn, 'click', () => {
				renderSeasonEpisodes(scroll, player, queue, sNum, curIdx, listen, onPick, opts);
				for (const b of Array.from(seasonScroll.querySelectorAll('.language-button'))) {
					b.classList.remove('is-active');
				}
				btn.classList.add('is-active');
			});
		}
	}

	renderSeasonEpisodes(scroll, player, queue, activeSeason, curIdx, listen, onPick, opts);
}

function renderSeasonEpisodes(
	scroll: HTMLDivElement,
	player: IVideoPlayer,
	queue: ReadonlyArray<VideoPlaylistItem>,
	season: number,
	curIdx: number,
	listen: MenuListen,
	onPick: () => void,
	opts: PlaylistRenderOptions,
): void {
	scroll.replaceChildren();
	queue.forEach((item, i) => {
		if (item.season !== season)
			return;
		scroll.appendChild(buildPlaylistCard(player, item, i, i === curIdx, listen, onPick, opts));
	});
}

function buildPlaylistCard(
	player: IVideoPlayer,
	item: VideoPlaylistItem,
	index: number,
	active: boolean,
	listen: MenuListen,
	onPick: () => void,
	opts: PlaylistRenderOptions,
): HTMLButtonElement {
	const safe = String(item.id ?? index).replace(/\W+/g, '-').toLowerCase();
	const btn = player.createButton(`playlist-${safe}`, item.title ?? `Item ${index + 1}`, () => {});
	btn.classList.add('playlist-menu-button');
	if (active)
		btn.classList.add('is-active');

	const left = document.createElement('div');
	left.className = 'episode-menu-button-left';
	btn.appendChild(left);

	const thumbUrl = readItemImage(item);
	if (thumbUrl) {
		const img = document.createElement('img');
		img.className = 'episode-menu-button-image';
		img.loading = 'lazy';
		img.alt = '';
		const isAbs = /^https?:\/\//i.test(thumbUrl);
		img.src = isAbs ? thumbUrl : `${opts.imageBaseUrl ?? ''}${thumbUrl}`;
		// Hide on load failure rather than showing a broken-image icon.
		img.addEventListener('error', () => { img.style.display = 'none'; });
		left.appendChild(img);
	}

	const shadow = document.createElement('div');
	shadow.className = 'episode-menu-button-shadow';
	left.appendChild(shadow);

	const progressContainer = document.createElement('div');
	progressContainer.className = 'episode-menu-progress-container';
	const progressBox = document.createElement('div');
	progressBox.className = 'episode-menu-progress-box';
	const epLabel = document.createElement('div');
	epLabel.className = 'progress-item-text';
	if (typeof item.season === 'number' && typeof item.episode === 'number') {
		epLabel.textContent = `S${item.season}: E${item.episode}`;
	}
	else if (typeof item.episode === 'number') {
		epLabel.textContent = `E${item.episode}`;
	}
	progressBox.appendChild(epLabel);
	const durLabel = document.createElement('div');
	durLabel.className = 'progress-duration';
	durLabel.textContent = formatDuration(item.duration);
	progressBox.appendChild(durLabel);
	progressContainer.appendChild(progressBox);

	const sliderContainer = document.createElement('div');
	sliderContainer.className = 'slider-container';
	const progressBar = document.createElement('div');
	progressBar.className = 'progress-bar';
	if (item.progress && item.progress.percentage > 0) {
		progressBar.style.width = `${Math.min(100, item.progress.percentage)}%`;
		sliderContainer.classList.add('has-progress');
	}
	sliderContainer.appendChild(progressBar);
	progressContainer.appendChild(sliderContainer);
	left.appendChild(progressContainer);

	const right = document.createElement('div');
	right.className = 'playlist-card-right';
	const title = document.createElement('span');
	title.className = 'playlist-menu-button-title';
	title.textContent = item.title ?? `Item ${index + 1}`;
	right.appendChild(title);
	// Watched-date label removed per design — progress bar in the thumbnail
	// already conveys "in progress" / "watched" state; the ISO date string was
	// redundant noise on a small card.
	if (item.description) {
		const overview = document.createElement('span');
		overview.className = 'playlist-menu-button-overview';
		overview.textContent = item.description;
		right.appendChild(overview);
	}
	btn.appendChild(right);

	listen(btn, 'click', () => {
		player.item?.(index, { source: 'user', autoplay: true });
		onPick();
	});

	return btn;
}

function formatDuration(duration: number | string | undefined): string {
	if (duration == null)
		return '';
	if (typeof duration === 'string')
		return duration.replace(/^00:/u, '');
	if (!Number.isFinite(duration) || duration <= 0)
		return '';
	return fmt(duration);
}

export function renderAudioPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
	state: MenuRenderState,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.language-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();
	const tracks: AudioTrackRef[] = player.audioTracks?.() ?? [];
	const uiLanguage = typeof player.language?.() === 'string' ? player.language() as unknown as string : 'en';
	tracks.forEach((t, i) => {
		const langSlug = (t.language ?? t.id).replace(/\W+/g, '-').toLowerCase();
		appendChoice(
			scroll,
			`audio-button-${langSlug}-${i}`,
			t.label ?? languageDisplayName(t.language, uiLanguage) ?? t.language ?? `Track ${i + 1}`,
			state.audioIdx === i,
			() => { player.audioTrack?.(i); onPick(); },
			listen,
			player,
		);
	});
}

function appendChoice(
	scroll: HTMLDivElement,
	id: string,
	label: string,
	active: boolean,
	onClick: () => void,
	listen: MenuListen,
	player: IVideoPlayer,
	opts?: {
		/**
		 * Optional lower-importance text rendered between the label and the
		 * checkmark. Used by the quality pane's Auto row to surface the
		 * level the backend is actually playing without competing with the
		 * primary checkmark.
		 */
		sublabel?: string;
	},
): void {
	const btn = player.createButton(id, label, () => {});
	btn.classList.add('language-button');
	if (active)
		btn.classList.add('is-active');
	// Reuses the existing `.menu-button-subtext` styling (muted colour, 10px,
	// pushed right) so the sublabel sits between the primary label and the
	// checkmark without competing visually.
	const sublabelHtml = opts?.sublabel
		? `<span class="menu-button-subtext">${escapeHtml(opts.sublabel)}</span>`
		: '';
	btn.innerHTML = `
        <span class="menu-button-text">${escapeHtml(label)}</span>
        ${sublabelHtml}
        <span class="menu-button-check">${svgFromIcon(fluentIcons.checkmark, 18)}</span>
    `;
	scroll.appendChild(btn);
	listen(btn, 'click', () => onClick());
}

export const ASPECT_RATIO_VALUE = {
	UNIFORM: 'uniform',
	FILL: 'fill',
	EXACTFIT: 'exactfit',
	NONE: 'none',
} as const;

export type AspectRatioValue = typeof ASPECT_RATIO_VALUE[keyof typeof ASPECT_RATIO_VALUE];

const ASPECT_RATIO_OPTIONS: Array<{ value: AspectRatioValue; labelKey: string }> = [
	{ value: ASPECT_RATIO_VALUE.UNIFORM, labelKey: 'plugin.desktop-ui.menu.original' },
	{ value: ASPECT_RATIO_VALUE.FILL, labelKey: 'plugin.desktop-ui.menu.stretch' },
	{ value: ASPECT_RATIO_VALUE.EXACTFIT, labelKey: 'plugin.desktop-ui.menu.crop' },
	{ value: ASPECT_RATIO_VALUE.NONE, labelKey: 'plugin.desktop-ui.menu.native' },
];

export function renderAspectRatioPane(
	pane: HTMLDivElement,
	player: IVideoPlayer,
	listen: MenuListen,
	onPick: () => void,
): void {
	const scroll = pane.querySelector<HTMLDivElement>('.aspectRatio-scroll-container');
	if (!scroll)
		return;
	scroll.replaceChildren();

	const current = player.aspectRatio?.() ?? 'uniform';

	for (const opt of ASPECT_RATIO_OPTIONS) {
		const label = player.t(opt.labelKey);
		const btn = player.createButton(`aspect-ratio-${opt.value}`, label, () => {});
		btn.classList.add('language-button');
		if (opt.value === current)
			btn.classList.add('is-active');
		btn.innerHTML = `
            <span class="menu-button-text">${escapeHtml(label)}</span>
            <span class="menu-button-check">${svgFromIcon(fluentIcons.checkmark, 18)}</span>
        `;
		scroll.appendChild(btn);
		listen(btn, 'click', () => {
			player.aspectRatio(opt.value);
			onPick();
		});
	}
}

function escapeHtml(s: string): string {
	return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]!));
}
