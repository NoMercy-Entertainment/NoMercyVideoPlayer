// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Desktop UI overlay plugin for the video player.
 *
 * File map (desktop-ui/ folder):
 *
 *   index.ts        — DesktopUiPlugin class: lifecycle (use/dispose), DOM
 *                     composition, event wiring, menu state.
 *   activity.ts     — setActivity / bumpActivity / maybeHide / dismissOverlay.
 *   dom.ts          — buildCenter / buildBottomBar / buildBottomRow /
 *                     buildShortcutsOverlay / iconBtn / applyButtonOrder.
 *   responsive.ts   — wireResponsive / wireOrientation / wireNoHover /
 *                     wireVolumeSlider / applyAllVisibilityRules + constants.
 *   tooltips.ts     — addTooltip / clampTooltip / wireTooltips.
 *   topBar.ts       — Top-bar DOM + title/show-info update + back-button logic.
 *   progressBar.ts  — Slider-bar DOM, chapter-marker rendering, time formatting,
 *                     chapter state updaters (progress/buffer/hover).
 *   buttonState.ts  — apply* helpers: volume, mute, rate, quality, fullscreen,
 *                     theater, subtitles, PiP, aspect-ratio icon/aria updates.
 *   menus.ts        — Menu-frame DOM + all sub-pane renderers (speed, quality,
 *                     subtitles, audio, playlist, subtitleSettings, aspectRatio).
 *   buttons.ts      — Fluent UI icon SVG path data table.
 *   icons.ts        — svgFromIcon() renderer on top of buttons.ts.
 *   sprite.ts       — Sprite VTT parser + thumbnail lookup for slider-pop.
 *   styles.ts       — CSS injection (ensureDesktopUiStyles).
 *
 * UX rule — menu vs. cycle:
 *   Pointer-input buttons (control bar) open menus for multi-state features.
 *   The cycle action (cycleAspectRatio, etc.) is for remote-control and key-bind
 *   contexts where the user cannot pick from a list. Quality, subtitles, audio,
 *   speed, and aspect-ratio are all menu-driven on click. Theater / PiP /
 *   Fullscreen are binary toggles — direct action on click is correct for those.
 *
 * DOM tree:
 *
 *   overlay
 *     ├─ top-bar > title              (topBar.ts)
 *     ├─ center > spinner + center-btn
 *     ├─ bottom-bar
 *     │   ├─ bottom-bar-shadow
 *     │   ├─ top-row                        (progressBar.ts)
 *     │   │   └─ slider-bar
 *     │   │       ├─ slider-buffer
 *     │   │       ├─ slider-hover
 *     │   │       ├─ slider-progress
 *     │   │       ├─ chapter-progress × N
 *     │   │       ├─ slider-nipple
 *     │   │       └─ slider-pop
 *     │   └─ bottom-row
 *     │       ├─ transport buttons          (buttonState.ts for icon state)
 *     │       ├─ volume-container
 *     │       ├─ current-time + remaining-time
 *     │       └─ feature buttons
 *     └─ menu-frame-dialog                  (menus.ts)
 *
 * Segmented-buffer rendering: when the item has chapters, sliderBuffer is
 * hidden and each chapter-marker carries its own buffer div. See progressBar.ts
 * for the scaleX fill math. The 2 px gap from `calc(width% - 2px)` aligns
 * segments with chapter dividers automatically.
 */

import type { Translations } from '@nomercy-entertainment/nomercy-player-core';
import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';
import type { ActivityState } from './activity';
import type { BottomBarRefs, BottomRowRefs, CenterRefs } from './dom';
import type { MenuFrameRefs, MenuRenderState, SettingsToggleItem, SubMenuId } from './menus';
import type { ChapterMarkerRef, SliderBarRefs } from './progressBar';

import type { ResponsiveState } from './responsive';
import type { SpriteSet } from './sprite';
import type { TooltipButtonRefs } from './tooltips';
import type { TopBarRefs } from './topBar';
import { Plugin, translationsFromGlob } from '@nomercy-entertainment/nomercy-player-core';
import { TheaterState, VolumeState } from '../../types';
import {

	bumpActivity,
	dismissOverlay,
	maybeHide,
	setActivity,
} from './activity';
import {
	applyAspectRatioIcon,
	applyAudioIcon,
	applyFullscreen,
	applyMuted,
	applyMutedIcon,
	applyPipIcon,
	applyQualityIcon,
	applyRate,
	applySubsIcon,
	applyTheaterIcon,
	applyVolume,
} from './buttonState';
import {

	buildBottomBar,
	buildCenter,
	buildShortcutsOverlay,
} from './dom';
import { fluentIcons, svgFromIcon } from './icons';
import {
	buildMenuFrame,
	renderAspectRatioPane,
	renderAudioPane,
	renderPlaylistPane,
	renderQualityPane,
	renderSpeedPane,
	renderSubsPane,
	renderSubtitleSettingsPane,
} from './menus';
import {
	buildChapterMarkers,
	fmt,
	updateChapterBuffer,
	updateChapterHover,
	updateChapterProgress,
} from './progressBar';
import {
	applyAllVisibilityRules,
	makeResponsiveState,

	wireNoHover,
	wireOrientation,
	wireResponsive,
	wireVolumeSlider,
} from './responsive';
import { loadSpriteSet, lookupCue } from './sprite';
import {

	wireTooltips,
} from './tooltips';
import { buildTitleBar, updateTitleBar } from './topBar';

/**
 * Per-button visibility overrides for the desktop UI control bar.
 *
 * Default-ON buttons (omit or set `true` to show): play, mute, volume,
 * fullscreen, settings, chapterPrev, chapterNext.
 * Chapter buttons are hidden automatically when the current item has no chapters
 * (content gating via `data-content-hidden`).
 *
 * Default-OFF buttons (set `true` to enable): theater, pip, speed, quality,
 * subtitles, audio, playlist, seekBack, seekForward, aspectRatio.
 * `seekBack` / `seekForward` default to false because ±10 s seek is available
 * on touch zones (double-tap) and keyboard (ArrowLeft/Right). Chapter buttons
 * are the unique value in the control bar.
 *
 * Navigation (always-on when queue has multiple items): next, previous.
 */
export interface DesktopUiButtonOptions {
	play?: boolean;
	mute?: boolean;
	volume?: boolean;
	fullscreen?: boolean;
	settings?: boolean;
	next?: boolean;
	previous?: boolean;
	theater?: boolean;
	pip?: boolean;
	speed?: boolean;
	quality?: boolean;
	subtitles?: boolean;
	audio?: boolean;
	playlist?: boolean;
	chapterPrev?: boolean;
	chapterNext?: boolean;
	seekBack?: boolean;
	seekForward?: boolean;
	aspectRatio?: boolean;
}

/**
 * Priority order for responsive button removal. When the container narrows,
 * buttons at the END of the array are hidden first. The default order puts
 * the most essential buttons first so they survive longest.
 *
 * Only include buttons that are enabled via `buttons`. Buttons not in the list
 * keep whatever visibility the content rules gave them.
 */
export type ButtonPriorityList = ReadonlyArray<keyof DesktopUiButtonOptions>;

/**
 * A single responsive breakpoint. Below `maxWidth` (container pixels), only
 * buttons up to `hideAfterRank` in the priority list are shown. Rank 0 means
 * only the first button in the priority list survives; `Infinity` means
 * show all buttons.
 *
 * @example
 * // Hide everything past the 4th-priority button below 480 px:
 * { name: 'sm', maxWidth: 480, hideAfterRank: 3 }
 */
export interface Breakpoint {
	/** Human-readable name, also set as a `data-breakpoint` attribute on the container. */
	name: string;
	/** Container width (px) at which this breakpoint activates. Use `Infinity` for the largest tier. */
	maxWidth: number;
	/** Buttons with a priority rank strictly greater than this value are hidden at this breakpoint. */
	hideAfterRank: number;
}

/**
 * Payload emitted on every breakpoint transition.
 *
 * Subscribe cross-plugin style:
 * ```ts
 * this.on(DesktopUiPlugin, 'layout:breakpoint', (data) => {
 *     console.log(data.to, data.hiddenButtons);
 * });
 * ```
 */
export interface LayoutBreakpointPayload {
	/** Name of the breakpoint that was active before this resize. */
	from: string;
	/** Name of the breakpoint now active. */
	to: string;
	/** Button keys still visible at the new breakpoint. */
	visibleButtons: ReadonlyArray<keyof DesktopUiButtonOptions>;
	/** Button keys hidden by the new breakpoint (excludes always-hidden buttons). */
	hiddenButtons: ReadonlyArray<keyof DesktopUiButtonOptions>;
}

export interface DesktopUiOptions {
	hideTitle?: boolean;
	disableClickToPause?: boolean;
	inactivityMs?: number;
	imageBaseUrl?: string;

	/** Per-button opt-in / opt-out. Unset keys use the button's own default. */
	buttons?: DesktopUiButtonOptions;

	/**
	 * Visual order override. Buttons named here are re-anchored to the end
	 * of the bar in the given sequence; unnamed buttons keep their natural
	 * position. Independent of `buttonPriority` (responsive removal order).
	 *
	 * @example
	 * buttonOrder: ['playlist', 'subtitles', 'audio', 'quality', 'pip', 'settings', 'fullscreen']
	 */
	buttonOrder?: ReadonlyArray<keyof DesktopUiButtonOptions>;

	/**
	 * Consumer toggle rows appended to the settings main menu (e.g. an
	 * app's auto-skip switch). Labels resolve at render time; `get`/`set`
	 * bind each row to wherever the state lives.
	 */
	settingsItems?: ReadonlyArray<SettingsToggleItem>;

	/**
	 * Priority order for responsive removal when the container is narrow.
	 * Buttons at the end are removed first. Override to change the default order.
	 *
	 * Default order: play → mute → volume → fullscreen → settings → next →
	 * previous → chapterPrev → chapterNext → seekBack → seekForward →
	 * theater → pip → speed → quality → subtitles → audio → aspectRatio → playlist.
	 */
	buttonPriority?: ButtonPriorityList;

	/**
	 * Full breakpoint progression. When provided, takes precedence over
	 * `collapseStages`. Each entry says "below `maxWidth` px, hide buttons
	 * whose priority rank exceeds `hideAfterRank`."
	 *
	 * Entries must be ordered from smallest `maxWidth` to largest.
	 * The last entry should use `maxWidth: Infinity` to cover all wider sizes.
	 *
	 * @example
	 * breakpoints: [
	 *   { name: 'xs', maxWidth: 320,      hideAfterRank: 1 },
	 *   { name: 'sm', maxWidth: 480,      hideAfterRank: 4 },
	 *   { name: 'md', maxWidth: 720,      hideAfterRank: 8 },
	 *   { name: 'lg', maxWidth: 1024,     hideAfterRank: 13 },
	 *   { name: 'xl', maxWidth: Infinity, hideAfterRank: Infinity },
	 * ]
	 */
	breakpoints?: Breakpoint[];

	/**
	 * Shorthand alternative to `breakpoints`. Provide an array of `hideAfterRank`
	 * values for the sm / md / lg tiers (xs is always rank 1, xl always shows all).
	 * Ignored when `breakpoints` is provided.
	 *
	 * @example
	 * // Hide after rank 2 at sm, rank 4 at md, rank 6 at lg:
	 * collapseStages: [2, 4, 6]
	 */
	collapseStages?: [number, number, number];

	/**
	 * Volume slider orientation.
	 * - `'horizontal'` — inline slider that expands on hover (default).
	 * - `'vertical'`   — popup slider above the mute button, toggle on click.
	 * - `'auto'`       — vertical when the player width is ≤ 520 px, else horizontal.
	 */
	volumeSlider?: 'horizontal' | 'vertical' | 'auto';
}

interface SidecarTrackEntry {
	kind?: string;
	file?: string;
}

interface ItemWithSidecarTracks {
	tracks: SidecarTrackEntry[];
}

function hasTrackArray(item: unknown): item is ItemWithSidecarTracks {
	return (
		item !== null
		&& typeof item === 'object'
		&& 'tracks' in item
		&& Array.isArray((item as Record<string, unknown>).tracks)
	);
}

function readSidecarTracks(item: unknown): SidecarTrackEntry[] | undefined {
	if (!hasTrackArray(item))
		return undefined;
	return item.tracks;
}

/** Events emitted by {@link DesktopUiPlugin} under the `plugin:desktop-ui:` namespace. */
export interface DesktopUiEvents {
	'shortcuts-toggle': undefined;
	'layout:breakpoint': LayoutBreakpointPayload;
	'opts:changed': DesktopUiOptions;
}

export class DesktopUiPlugin extends Plugin<IVideoPlayer<VideoPlaylistItem>, DesktopUiOptions, DesktopUiEvents> {
	static override readonly id: string = 'desktop-ui';
	static override readonly version: string = '2.0.0';
	static override readonly description: string = 'Official desktop UI overlay (v2 rewrite)';
	static override readonly moduleUrl: string = import.meta.url;

	static override readonly translations: Translations = translationsFromGlob('./i18n/*.ts');

	// ── overlay root ────────────────────────────────────────────────
	private overlayRoot!: HTMLElement;

	// ── top bar ─────────────────────────────────────────────────────
	private topBarRefs!: TopBarRefs;

	// ── center ──────────────────────────────────────────────────────
	private centerWrap!: HTMLDivElement;
	private centerBtn!: HTMLButtonElement;
	private spinner!: HTMLDivElement;
	/** Center toast / status line — `display-message` renderer + loading/buffering/error feedback. Lives on the container so it survives overlay auto-hide. */
	private messageEl: HTMLDivElement | null = null;
	private messageTimer: ReturnType<typeof setTimeout> | null = null;
	/** `true` while the current message is playback feedback (loading/buffering/error) rather than a consumer toast — feedback clears automatically when playback recovers. */
	private messageIsFeedback = false;

	// ── bottom bar ──────────────────────────────────────────────────
	private bottomBar!: HTMLDivElement;
	private topRow!: HTMLDivElement;
	private bottomRow!: HTMLDivElement;

	// ── slider-bar tree ─────────────────────────────────────────────
	private sliderRefs!: SliderBarRefs;
	private chapterRefs: ChapterMarkerRef[] = [];

	/** Sprite preview thumbnails for the current playlist item. */
	private spriteSet: SpriteSet | null = null;
	private spriteLoadId = 0;
	private spriteObjectUrl: string | null = null;

	/**
	 * v2's subtitleState/audioTrackMode/qualityMode methods return
	 *  ON/OFF/AUTO/MANUAL enums — not the active track index. The menu
	 *  panes need to know which entry to mark active, so we track the
	 *  selected indexes ourselves from the player's `subtitle` /
	 *  `audioTrack` / `level-switched` events. -1 / null = "off / auto".
	 */
	private activeSubtitleIdx: number | null = -1;
	private activeAudioIdx: number = -1;
	private activeQualityIdx: number | 'auto' = 'auto';

	/**
	 * The level index the backend is actually playing right now. Distinct from
	 *  `activeQualityIdx`: in Auto mode the user's pick is `'auto'` but the
	 *  backend (HLS) auto-switches to a specific level. The menu surfaces this
	 *  as a lower-importance sublabel on the Auto row so the user sees what's
	 *  actually playing without losing the "I'm in Auto mode" signal.
	 *  Null until the first `level-switched` event arrives, and reset on
	 *  `current` (new item).
	 */
	private _playingQualityIdx: number | null = null;

	private isMouseDown = false;
	private isScrubbing = false;
	private _showRemaining = true;

	/**
	 * True when the user explicitly picked a non-auto quality level via the
	 *  menu. Resets to false when "Auto" is picked. HLS level-switched events
	 *  never touch this flag — it tracks user INTENT, not the actual level.
	 */
	private _userPickedQuality = false;

	// ── transport buttons ───────────────────────────────────────────
	private playBtn!: HTMLButtonElement;
	private prevBtn!: HTMLButtonElement;
	private nextBtn!: HTMLButtonElement;
	private rewindBtn!: HTMLButtonElement;
	private forwardBtn!: HTMLButtonElement;
	private chapBackBtn!: HTMLButtonElement;
	private chapFwdBtn!: HTMLButtonElement;
	private volBtn!: HTMLButtonElement;
	private volSlider!: HTMLInputElement;
	/** Vertical volume slider popup. Null until `buildDom` creates it. */
	private volSliderVertical: HTMLDivElement | null = null;
	/** Mute toggle inside the vertical volume popup. Null until `buildDom` creates it. */
	private volPopupMuteBtn: HTMLButtonElement | null = null;
	private currentTimeEl!: HTMLDivElement;
	private remainingTimeEl!: HTMLDivElement;
	private aspectRatioBtn!: HTMLButtonElement;
	private speedBtn!: HTMLButtonElement;
	private qualityBtn!: HTMLButtonElement;
	private subsBtn!: HTMLButtonElement;
	private audioBtn!: HTMLButtonElement;
	private theaterBtn!: HTMLButtonElement;
	/** Theater's config-level visibility, captured at build — state hiding (fullscreen/PiP) composes on top, never overrides an opt-out. */
	private theaterConfigHidden = false;
	private fsActive = false;
	private pipActive = false;
	private pipBtn!: HTMLButtonElement;
	private playlistBtn!: HTMLButtonElement;
	private settingsBtn!: HTMLButtonElement;
	private fsBtn!: HTMLButtonElement;

	// ── menu refs ───────────────────────────────────────────────────
	private menus!: MenuFrameRefs;
	private menuOpen = false;
	private currentSubMenu: SubMenuId | null = null;

	// ── keyboard shortcuts overlay ───────────────────────────────────
	private shortcutsOverlay: HTMLDivElement | null = null;
	private _shortcutsVisible = false;

	// ── extracted-concern state ─────────────────────────────────────
	private _activityState: ActivityState = {
		activityActive: false,
		inactivityToken: null,
		menuOpen: false,
		isScrubbing: false,
		isControlsHovered: false,
	};

	private _responsiveState: ResponsiveState = makeResponsiveState();

	private cachedDuration = 0;
	private _lastMouseX = -1;
	private _lastMouseY = -1;
	private _tooltipHoverToken: number | null = null;

	override use(): void {
		this.appendStyles(new URL('./styles.css', import.meta.url).href, 'desktop-ui-styles');
		this.buildDom();
		this.wireTooltips();
		this.wireEvents();
		this.wireFeedback();
		this.wireMenuKeyboardNav();
		wireOrientation(
			this._responsiveState,
			this.player.container,
			this.opts,
			this.listen.bind(this),
			payload => this.emit('layout:breakpoint', payload),
		);
		wireNoHover(
			this._responsiveState,
			this.player.container,
			this.opts,
			this.listen.bind(this),
			payload => this.emit('layout:breakpoint', payload),
		);
		wireResponsive(
			this._responsiveState,
			{
				playBtn: this.playBtn,
				volBtn: this.volBtn,
				fsBtn: this.fsBtn,
				settingsBtn: this.settingsBtn,
				nextBtn: this.nextBtn,
				prevBtn: this.prevBtn,
				rewindBtn: this.rewindBtn,
				forwardBtn: this.forwardBtn,
				chapBackBtn: this.chapBackBtn,
				chapFwdBtn: this.chapFwdBtn,
				theaterBtn: this.theaterBtn,
				pipBtn: this.pipBtn,
				speedBtn: this.speedBtn,
				qualityBtn: this.qualityBtn,
				subsBtn: this.subsBtn,
				audioBtn: this.audioBtn,
				aspectRatioBtn: this.aspectRatioBtn,
				playlistBtn: this.playlistBtn,
			},
			this.player.container,
			this.opts,
			fn => this.lifecycle.addCleanup(fn),
			payload => this.emit('layout:breakpoint', payload),
		);
		void Promise.resolve(this.storage.getJSON('showRemaining')).then((v) => {
			this._showRemaining = (v as boolean | null) ?? true;
		});
		this.applyInitialState();
		this.bumpActivity();
		this.wireKeybindHint();
	}

	/**
	 * Disabling hides the overlay outright, not just its handlers. A peer that
	 * owns the screen (e.g. a disc-menu interpreter painting the disc's own
	 * chrome) disables this plugin to take over; leaving the rendered control
	 * bar on top would double up the chrome. The inactivity timer is cancelled
	 * and one final `activity:false` is emitted so nothing re-shows it while off.
	 */
	override disable(reason?: string): void {
		if (!this.enabled())
			return;
		super.disable(reason);
		if (this._activityState.inactivityToken !== null) {
			clearTimeout(this._activityState.inactivityToken);
			this._activityState.inactivityToken = null;
		}
		this.overlayRoot.hidden = true;
		setActivity(this._activityState, this.player, false);
	}

	/** Re-enabling restores the overlay and re-arms the auto-hide cycle. */
	override enable(): void {
		if (this.enabled())
			return;
		super.enable();
		this.overlayRoot.hidden = false;
		this.bumpActivity();
	}

	/**
	 * The overlay root — the auto-hiding chrome layer this plugin owns.
	 * Other plugins mount their UI here (via
	 * `player.getPlugin(DesktopUiPlugin)?.overlay()`) so their elements
	 * inherit the overlay's show/hide lifecycle instead of floating over a
	 * hidden chrome. Returns `null` before `use()` has built the DOM — a
	 * field initializer would capture `undefined` forever, hence the method.
	 */
	overlay(): HTMLElement | null {
		return this.overlayRoot ?? null;
	}

	// ── Playback feedback: spinner, loading/buffering/error, toasts ──────

	/**
	 * The user must never stare at a silent black frame. Spinner + status
	 * line on load and on every buffer stall, an error line when playback
	 * dies, and the `display-message` / `remove-message` toast contract for
	 * plugins and consumers (the v1 surface).
	 */
	private wireFeedback(): void {
		const container = this.player.container;

		const showBuffer = (textKey: string): void => {
			container.classList.add('buffering');
			this.showMessage(this.t(textKey), undefined, true);
		};
		const clearFeedback = (): void => {
			container.classList.remove('buffering');
			if (this.messageIsFeedback)
				this.hideMessage();
		};

		// Initial load — the player is mounting media right now.
		showBuffer('message.loading');

		this.on('waiting', () => showBuffer('message.buffering'));
		this.on('stalled', () => showBuffer('message.buffering'));
		this.on('item', () => showBuffer('message.loading'));
		this.on('playing', clearFeedback);
		this.on('time', clearFeedback);

		this.on('error', () => {
			container.classList.remove('buffering');
			this.showMessage(this.t('message.error'), undefined, true);
		});

		this.on('display-message', (data) => {
			const payload = data as { text?: string; ms?: number } | undefined;
			if (payload?.text)
				this.showMessage(payload.text, payload.ms);
		});
		this.on('remove-message', () => this.hideMessage());
	}

	private showMessage(text: string, ms?: number, isFeedback = false): void {
		if (!this.messageEl) {
			const el = document.createElement('div');
			el.className = 'player-message';
			this.player.container.appendChild(el);
			this.messageEl = el;
		}
		this.messageEl.textContent = text;
		this.messageEl.classList.add('visible');
		this.messageIsFeedback = isFeedback;

		if (this.messageTimer !== null) {
			clearTimeout(this.messageTimer);
			this.messageTimer = null;
		}
		if (typeof ms === 'number' && ms > 0) {
			this.messageTimer = this.timeout(() => {
				this.messageTimer = null;
				this.hideMessage();
			}, ms) as unknown as ReturnType<typeof setTimeout>;
		}
	}

	private hideMessage(): void {
		this.messageIsFeedback = false;
		this.messageEl?.classList.remove('visible');
	}

	/**
	 * Display-state visibility: theater is meaningless inside fullscreen or
	 * PiP, and PiP chrome floats over another window — navigation buttons
	 * there act on the wrong surface. Config opt-outs always win.
	 */
	private applyStateVisibility(): void {
		this.theaterBtn.hidden = this.theaterConfigHidden || this.fsActive || this.pipActive;
		if (this.topBarRefs) {
			this.topBarRefs.backBtn.hidden = this.pipActive || !this.player.hasListeners('back');
			this.topBarRefs.closeBtn.hidden = this.pipActive || !this.player.hasListeners('close');
		}
	}

	/** Show a one-shot hint on first play so users discover the shortcuts overlay. */
	private wireKeybindHint(): void {
		if (typeof sessionStorage === 'undefined')
			return;
		if (sessionStorage.getItem('nmplayer-keybinds-hint-shown'))
			return;

		this.once('play', () => {
			this.player.emit('display-message', { text: this.t('shortcuts.hintToast'), ms: 12000 });
			sessionStorage.setItem('nmplayer-keybinds-hint-shown', '1');
		});
	}

	// ── DOM construction ─────────────────────────────────────────────────
	private buildDom(): void {
		const root = this.mount('overlay');
		this.overlayRoot = root;
		this.player.addClasses(root, ['overlay']);

		this.topBarRefs = buildTitleBar(this.player, root);
		// hideTitle hides only the right column (title + show-info), not the
		// whole bar — left column carries back/close buttons that must remain.
		this.topBarRefs.right.hidden = !!this.opts?.hideTitle;

		const centerRefs: CenterRefs = buildCenter(this.player, root);
		this.centerWrap = centerRefs.centerWrap;
		this.centerBtn = centerRefs.centerBtn;
		this.spinner = centerRefs.spinner;

		const bottomRefs: BottomBarRefs & BottomRowRefs = buildBottomBar(
			this.player,
			root,
			this.opts,
			this.listen.bind(this),
			this.t.bind(this),
		);
		this.bottomBar = bottomRefs.bottomBar;
		this.topRow = bottomRefs.topRow;
		this.bottomRow = bottomRefs.bottomRow;
		this.sliderRefs = bottomRefs.sliderRefs;
		this.playBtn = bottomRefs.playBtn;
		this.prevBtn = bottomRefs.prevBtn;
		this.nextBtn = bottomRefs.nextBtn;
		this.rewindBtn = bottomRefs.rewindBtn;
		this.forwardBtn = bottomRefs.forwardBtn;
		this.chapBackBtn = bottomRefs.chapBackBtn;
		this.chapFwdBtn = bottomRefs.chapFwdBtn;
		this.volBtn = bottomRefs.volBtn;
		this.volSlider = bottomRefs.volSlider;
		this.volSliderVertical = bottomRefs.volSliderVertical;
		this.volPopupMuteBtn = bottomRefs.volPopupMuteBtn;
		this.currentTimeEl = bottomRefs.currentTimeEl;
		this.remainingTimeEl = bottomRefs.remainingTimeEl;
		this.aspectRatioBtn = bottomRefs.aspectRatioBtn;
		this.theaterBtn = bottomRefs.theaterBtn;
		this.theaterConfigHidden = bottomRefs.theaterConfigHidden;
		this.pipBtn = bottomRefs.pipBtn;
		this.speedBtn = bottomRefs.speedBtn;
		this.subsBtn = bottomRefs.subsBtn;
		this.audioBtn = bottomRefs.audioBtn;
		this.qualityBtn = bottomRefs.qualityBtn;
		this.playlistBtn = bottomRefs.playlistBtn;
		this.settingsBtn = bottomRefs.settingsBtn;
		this.fsBtn = bottomRefs.fsBtn;

		// Wire the volume slider now that all button refs are stored.
		wireVolumeSlider(
			this._responsiveState,
			this.opts,
			this.player.container,
			bottomRefs.volContainer,
			bottomRefs.volSliderVertical,
			bottomRefs.volVertInput,
			this.volBtn,
			this.volPopupMuteBtn,
			this.listen.bind(this),
			() => this.player.volume?.() ?? 100,
			(level: number) => { this.player.volume?.(level); },
			() => { this.player.toggleMute?.(); },
			fn => this.lifecycle.addCleanup(fn),
		);

		this.menus = buildMenuFrame(this.player, root, this.listen.bind(this), {
			closeMenu: () => this.closeAllMenus(),
			openSubMenu: id => this.openSubMenu(id),
			backToMain: () => this.openMainMenu(),
		}, this.opts?.settingsItems);

		this.shortcutsOverlay = buildShortcutsOverlay(
			root,
			this.listen.bind(this),
			this.t.bind(this),
			() => this.hideShortcuts(),
		);
	}

	private toggleShortcuts(): void {
		if (this._shortcutsVisible) {
			this.hideShortcuts();
		}
		else {
			this.showShortcuts();
		}
	}

	private showShortcuts(): void {
		this._shortcutsVisible = true;
		this.shortcutsOverlay?.classList.add('keybinds-dialog-visible');
	}

	private hideShortcuts(): void {
		this._shortcutsVisible = false;
		this.shortcutsOverlay?.classList.remove('keybinds-dialog-visible');
	}

	private wireTooltips(): void {
		const refs: TooltipButtonRefs = {
			playBtn: this.playBtn,
			rewindBtn: this.rewindBtn,
			forwardBtn: this.forwardBtn,
			volBtn: this.volBtn,
			aspectRatioBtn: this.aspectRatioBtn,
			theaterBtn: this.theaterBtn,
			pipBtn: this.pipBtn,
			speedBtn: this.speedBtn,
			subsBtn: this.subsBtn,
			audioBtn: this.audioBtn,
			qualityBtn: this.qualityBtn,
			playlistBtn: this.playlistBtn,
			settingsBtn: this.settingsBtn,
			fsBtn: this.fsBtn,
			prevBtn: this.prevBtn,
			nextBtn: this.nextBtn,
			chapBackBtn: this.chapBackBtn,
			chapFwdBtn: this.chapFwdBtn,
		};
		wireTooltips(
			this.player,
			refs,
			this.sliderRefs,
			this.listen.bind(this),
			() => this._tooltipHoverToken,
			(v) => { this._tooltipHoverToken = v; },
			(fn, ms) => this.timeout(() => fn(), ms),
			this.t.bind(this),
			() => this.safeCurrentIndex(),
		);
	}

	// ── Event wiring ─────────────────────────────────────────────────────
	private wireEvents(): void {
		// Re-render the quality menu when the display's dynamic-range support
		// flips — e.g. user drags the window from an SDR to an HDR monitor.
		if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
			const hdrMql = window.matchMedia('(dynamic-range: high)');
			this.listen(hdrMql, 'change', () => this.repaintQualityIfOpen());
		}

		const container = this.player.container;
		if (container) {
			this.listen(container, 'mousemove', (e: Event) => {
				const me = e as MouseEvent;
				const dx = me.clientX - this._lastMouseX;
				const dy = me.clientY - this._lastMouseY;
				if (Math.abs(dx) < 2 && Math.abs(dy) < 2)
					return;
				this._lastMouseX = me.clientX;
				this._lastMouseY = me.clientY;
				this.bumpActivity();
			});
			this.listen(container, 'mousedown', () => this.bumpActivity());
			this.listen(container, 'pointerdown', () => this.bumpActivity());
			// On touch devices, touchstart must only SHOW the controls (wake from
			// hidden). When controls are already visible, this must be a no-op so
			// that a subsequent click on a touch-zone can emit activity:false and
			// hide them. If we unconditionally bumped here, every tap would re-show
			// regardless of what touch-zones intended — the mobile tap-toggle breaks.
			//
			// We read the live .active DOM class rather than activityActive because
			// a peer plugin (touch-zones) can call player.emit('activity',{active:false})
			// directly, which updates the DOM class but leaves activityActive=true
			// (it bypasses setActivity). The DOM is always the real source of truth.
			this.listen(container, 'touchstart', () => {
				if (!this.player.container.classList.contains('active'))
					this.bumpActivity();
			});
			this.listen(container, 'keydown', (e: Event) => {
				this.bumpActivity();
				const ke = e as KeyboardEvent;
				if (ke.key === '?' && !ke.ctrlKey && !ke.metaKey && !ke.altKey) {
					ke.preventDefault();
					this.toggleShortcuts();
				}
				else if (ke.key === 'Escape' && this.menuOpen) {
					ke.preventDefault();
					this.closeAllMenus();
				}
				else if (ke.key === 'Escape' && this._shortcutsVisible) {
					ke.preventDefault();
					this.hideShortcuts();
				}
			});
			this.listen(container, 'mouseleave', () => this.maybeHide());
			this.listen(container, 'click', (e: Event) => {
				this.bumpActivity();
				const target = e.target as HTMLElement;
				if (target.tagName === 'VIDEO' && !this.opts?.disableClickToPause) {
					void this.player.togglePlayback();
				}
			});

			// Only a genuine background tap reaches overlayRoot as the target;
			// child controls consume the event first and never let it bubble here.
			this.listen(this.overlayRoot, 'click', (e: Event) => {
				if ((e.target as Node) === this.overlayRoot) {
					this.dismissOverlay();
				}
			});
		}

		// Hovering over the bottom bar or the menu frame suspends the inactivity
		// timer — controls must never hide while the user is actively using them.
		// Use pointerenter/pointerleave filtered to mouse-type so mobile browsers
		// don't lock _isControlsHovered via synthesised mouse events from touch.
		for (const zone of [this.bottomBar, this.menus.frame]) {
			this.listen(zone, 'pointerenter', (e: Event) => {
				if ((e as PointerEvent).pointerType === 'mouse') {
					this._activityState.isControlsHovered = true;
				}
			});
			this.listen(zone, 'pointerleave', (e: Event) => {
				if ((e as PointerEvent).pointerType === 'mouse') {
					this._activityState.isControlsHovered = false;
				}
			});
		}

		this.on(DesktopUiPlugin, 'shortcuts-toggle', () => this.toggleShortcuts());

		this.on('play', () => {
			this.centerWrap.classList.add('dismissed');
			this.setPlayingState(true);
			// Re-arm the inactivity timer whenever playback starts so the
			// controls auto-hide after 4 s even on programmatic play calls.
			this.bumpActivity();
		});
		this.on('pause', () => {
			this.setPlayingState(false);
			// Keep controls visible while paused — cancel any pending hide.
			if (this._activityState.inactivityToken !== null) {
				clearTimeout(this._activityState.inactivityToken);
				this._activityState.inactivityToken = null;
			}
			setActivity(this._activityState, this.player, true);
		});
		this.on('ended', () => this.setPlayingState(false));

		// Only a user-initiated scrub keeps the controls up. Programmatic and
		// relayed seeks carry no `source` and must NOT re-arm the hide timer —
		// that was the rc.10 regression (phantom seeks looping forever).
		// `seeked` never carries `source`, so we gate solely on `seek`.
		this.on('seek', (d) => {
			if (d?.source)
				this.bumpActivity();
		});

		this.on('item', d => this.handleCurrentChange(d.item));

		this.on('listeners-changed', (d) => {
			// applyStateVisibility composes the listener gate with PiP hiding —
			// a bare refresh here would unhide back/close mid-PiP.
			if ((d.name === 'back' || d.name === 'close') && this.topBarRefs)
				this.applyStateVisibility();
		});

		// mediaReady: refresh chapters + duration, then sync all track lists
		// (subtitles / audio / quality) that may have changed with the new source.
		this.on('mediaReady', () => {
			this.refreshChaptersAndDuration();
			this.syncActiveIndexes();
			this.applySubsIcon();
			this.applyQualityIcon();
			this.refreshCapabilityVisibility();
			this.repaintSubsIfOpen();
			this.repaintAudioIfOpen();
			this.repaintQualityIfOpen();
		});

		this.on('chapters', () => {
			this.renderChapterMarkers();
			this.refreshCapabilityVisibility();
		});

		this.on('duration', d => this.applyDuration(d.duration));
		this.on('time', d => this.applyTime(d.time));

		this.on('volume', (d) => {
			const level = typeof d?.level === 'number' ? d.level : this.player.volume?.() ?? 100;
			this.applyVolume(level);
			// Every volume change toasts the new level — same affordance as
			// cycling aspect / audio / subtitles (v1 behaviour).
			this.showMessage(this.t('message.volume', { level: String(Math.round(level)) }), 1200);
		});
		this.on('mute', (d) => {
			const muted = d?.muted ?? this.player.volumeState?.() === 'muted';
			this.applyMuted(muted);
			this.showMessage(this.t(muted ? 'message.muted' : 'message.unmuted'), 1200);
		});

		// 'backend:ratechange' is the correct player-level event — emitted by
		// base-player.ts:playbackRate() and carried on the typed event map.
		this.on('backend:ratechange', () => {
			this.applyRate();
			this.repaintSpeedIfOpen();
		});

		// v2 emits 'subtitle' (not 'subtitleChanged') with `{ track: idx | null }`.
		this.on('subtitle', (d) => {
			const idx = d.track;
			this.activeSubtitleIdx = (typeof idx === 'number' && idx >= 0) ? idx : -1;
			this.applySubsIcon();
			this.repaintSubsIfOpen();
		});

		// v2 emits 'audioTrack' (not 'audioTrackChanged') with `{ id: idx }`.
		this.on('audioTrack', (d) => {
			this.activeAudioIdx = typeof d.id === 'number' ? d.id : -1;
			this.applyAudioIcon();
			this.repaintAudioIfOpen();
		});

		this.on('quality:requested', (d) => {
			this.activeQualityIdx = d.level;
			this._userPickedQuality = d.level !== 'auto';
			this.applyQualityIcon();
			this.repaintQualityIfOpen();
		});

		this.on('level-switched', (d) => {
			// Always record the actually-playing level so the Auto row can
			// surface it as a sublabel and the button aria-label can include it.
			if (typeof d.level === 'number') {
				this._playingQualityIdx = d.level;
			}
			if (!this._userPickedQuality) {
				this.activeQualityIdx = 'auto';
			}
			else {
				this.activeQualityIdx = typeof d.level === 'number' ? d.level : this.activeQualityIdx;
			}
			this.applyQualityIcon();
			this.repaintQualityIfOpen();
		});

		// Track lists arrive asynchronously after HLS manifest parse — may be
		// empty at mediaReady. Refresh capability visibility when they land.
		this.on('levels', () => { this.refreshCapabilityVisibility(); });
		this.on('audioTracks', () => { this.refreshCapabilityVisibility(); });

		this.on('fullscreen', () => {
			this.applyFullscreen();
			this.fsActive = Boolean(document.fullscreenElement);
			this.applyStateVisibility();
		});
		this.on('pip', () => {
			this.pipActive = Boolean(document.pictureInPictureElement);
			this.applyPipIcon(this.pipActive);
			this.applyStateVisibility();
		});
		this.on('theater', () => {
			this.applyTheaterIcon(this.player.theater() === TheaterState.ON);
		});

		this.on('aspectRatio', () => {
			this.applyAspectRatioIcon();
			this.repaintAspectRatioIfOpen();
		});

		this.listen(this.centerBtn, 'click', () => {
			// Center button is a one-shot affordance — once the user clicks
			// it, the touch zones own play/pause from here on.
			this.centerWrap.classList.add('dismissed');
			void this.player.togglePlayback();
			this.bumpActivity();
		});
		this.listen(this.playBtn, 'click', () => { void this.player.togglePlayback(); this.bumpActivity(); });

		this.listen(this.prevBtn, 'click', () => { void this.player.previous?.(); });
		this.listen(this.nextBtn, 'click', () => { void this.player.next?.(); });
		this.listen(this.rewindBtn, 'click', () => { this.player.rewind?.(10); });
		this.listen(this.forwardBtn, 'click', () => { this.player.forward?.(10); });
		this.listen(this.chapBackBtn, 'click', () => this.previousChapter());
		this.listen(this.chapFwdBtn, 'click', () => this.nextChapter());

		this.listen(this.volBtn, 'click', () => {
			// In vertical-slider mode the click opens/closes the popup —
			// skip mute toggle so a single tap on mobile doesn't both mute
			// AND toggle the popup (which leaves mute flipped and slider closed).
			const volContainer = this.volBtn.closest('.volume-container');
			if (volContainer?.classList.contains('volume-container-vertical')) {
				return;
			}
			this.player.toggleMute?.();
		});
		this.listen(this.volSlider, 'input', () => {
			const volume = Number(this.volSlider.value);
			this.player.volume?.(volume);
		});

		this.listen(this.remainingTimeEl, 'click', () => {
			this._showRemaining = !this._showRemaining;
			void Promise.resolve(this.storage.setJSON('showRemaining', this._showRemaining));
			this.applyTime(this.player.time?.() ?? 0);
		});

		this.wireSliderBar();

		this.listen(this.speedBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('speed'); });
		this.listen(this.qualityBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('quality'); });
		this.listen(this.subsBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('subtitles'); });
		this.listen(this.audioBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('language'); });
		this.listen(this.playlistBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('playlist'); });
		this.listen(this.settingsBtn, 'click', (e: Event) => { e.stopPropagation(); this.openMainMenu(); });

		this.listen(this.aspectRatioBtn, 'click', (e: Event) => { e.stopPropagation(); this.openSubMenu('aspectRatio'); });
		this.listen(this.theaterBtn, 'click', () => { this.player.toggleTheater(); });
		this.listen(this.pipBtn, 'click', () => { this.player.togglePip(); });
		this.listen(this.fsBtn, 'click', () => { this.player.toggleFullscreen(); });

		const videoEl = this.player.videoElement;
		if (videoEl) {
			this.listen(videoEl, 'enterpictureinpicture', () => this.applyPipIcon(true));
			this.listen(videoEl, 'leavepictureinpicture', () => this.applyPipIcon(false));
		}

		this.listen(document, 'click', (e: Event) => {
			if (!this.menuOpen)
				return;
			const target = e.target as Node;
			if (this.menus.frame.contains(target))
				return;
			this.closeAllMenus();
		});

		if (!('pictureInPictureEnabled' in document))
			this.pipBtn.hidden = true;

		this.on(DesktopUiPlugin, 'opts:changed', (opts) => {
			this.topBarRefs.right.hidden = !!opts.hideTitle;
		});
	}

	private wireSliderBar(): void {
		// Prevent the browser from intercepting touchmove as a scroll gesture
		// while the user drags over the slider bar.
		this.sliderRefs.sliderBar.style.touchAction = 'none';

		const startScrub = (): void => {
			if (this.isMouseDown)
				return;
			this.isMouseDown = true;
			this.isScrubbing = true;
			this._activityState.isScrubbing = true;
			this.sliderRefs.sliderBar.classList.add('slider-scrubbing');
		};
		this.listen(this.sliderRefs.sliderBar, 'mousedown', startScrub);
		this.listen(this.sliderRefs.sliderBar, 'touchstart', startScrub);

		const finalizeScrub = (e: Event): void => {
			if (!this.isMouseDown)
				return;
			this.isMouseDown = false;
			this.isScrubbing = false;
			this._activityState.isScrubbing = false;
			this.sliderRefs.sliderBar.classList.remove('slider-scrubbing');
			this.sliderRefs.sliderPop.style.setProperty('--visibility', '0');
			const scrub = this.getScrubTime(e);
			this.sliderRefs.sliderNipple.style.left = `${scrub.scrubTime}%`;
			void this.player.time?.(scrub.scrubTimePlayer);
			this.bumpActivity();
		};

		// Mouse: document-level mouseup finalizes the scrub regardless of where
		// the cursor is when the button is released. Without this, releasing
		// outside the slider leaves isMouseDown=true and the seek-preview
		// reappears on the next mousemove over the bar.
		this.listen(document, 'mouseup', finalizeScrub);

		// Mouse: click on the bottom bar also finalizes the seek for the case
		// where no drag preceded the click.
		this.listen(this.bottomBar, 'click', finalizeScrub);

		// Touch: touchend on the slider bar finalizes the seek. Without this,
		// releasing a finger never commits the scrub position because the
		// browser suppresses the synthetic click event after a touchmove.
		this.listen(this.sliderRefs.sliderBar, 'touchend', finalizeScrub);

		const onMove = (e: Event): void => {
			const scrub = this.getScrubTime(e);
			this.sliderRefs.sliderPopText.textContent = fmt(scrub.scrubTimePlayer);
			this.paintSpriteAt(scrub.scrubTimePlayer);

			const popOffsetPct = this.clampPopOffset(scrub.scrubTime);
			this.sliderRefs.sliderPop.style.left = `${popOffsetPct}%`;

			// Always show the pop here: mousemove only fires while hovering the
			// bar, touchmove only during an active scrub. Also brings the pop
			// back after a click-to-seek hid it without leaving the bar first.
			this.sliderRefs.sliderPop.style.setProperty('--visibility', '1');

			const chapters = this.player.chapters();
			if (chapters.length === 0) {
				this.sliderRefs.sliderHover.style.width = `${scrub.scrubTime}%`;
			}
			else {
				this.updateChapterHover(scrub.scrubTime);
			}
			this.sliderRefs.chapterText.textContent = this.findChapterTitle(scrub.scrubTimePlayer) ?? '';

			if (!this.isMouseDown)
				return;
			this.sliderRefs.sliderNipple.style.left = `${scrub.scrubTime}%`;
		};
		this.listen(this.sliderRefs.sliderBar, 'mousemove', onMove);
		this.listen(this.sliderRefs.sliderBar, 'touchmove', onMove);

		this.listen(this.sliderRefs.sliderBar, 'mouseover', (e: Event) => {
			const scrub = this.getScrubTime(e);
			this.sliderRefs.sliderPopText.textContent = fmt(scrub.scrubTimePlayer);
			this.paintSpriteAt(scrub.scrubTimePlayer);
			this.sliderRefs.chapterText.textContent = this.findChapterTitle(scrub.scrubTimePlayer) ?? '';
			this.sliderRefs.sliderPop.style.setProperty('--visibility', '1');
			this.sliderRefs.sliderPop.style.left = `${this.clampPopOffset(scrub.scrubTime)}%`;
		});
		this.listen(this.sliderRefs.sliderBar, 'mouseleave', () => {
			this.sliderRefs.sliderPop.style.setProperty('--visibility', '0');
			this.sliderRefs.sliderHover.style.width = '0';
			for (const ch of this.chapterRefs) ch.hover.style.transform = 'scaleX(0)';
		});
	}

	private getScrubTime(e: Event): { scrubTime: number; scrubTimePlayer: number } {
		const rect = this.sliderRefs.sliderBar.getBoundingClientRect();
		const me = e as MouseEvent;
		const te = e as TouchEvent;
		const x = me.clientX ?? te.touches?.[0]?.clientX ?? te.changedTouches?.[0]?.clientX ?? 0;
		let offsetX = x - rect.left;
		if (offsetX <= 0)
			offsetX = 0;
		if (offsetX >= rect.width)
			offsetX = rect.width;
		const dur = this.resolveDuration();
		return {
			scrubTime: rect.width > 0 ? (offsetX / rect.width) * 100 : 0,
			scrubTimePlayer: rect.width > 0 ? (offsetX / rect.width) * dur : 0,
		};
	}

	private clampPopOffset(pct: number): number {
		const popWidthPct = (this.sliderRefs.sliderPop.offsetWidth / Math.max(1, this.sliderRefs.sliderBar.offsetWidth)) * 100;
		const half = popWidthPct / 2;
		return Math.max(half, Math.min(100 - half, pct));
	}

	// ── Initial state, capability gating, helpers ────────────────────
	private applyInitialState(): void {
		this.applyVolume(this.player.volume?.() ?? 100);
		this.applyMuted(this.player.volumeState() === VolumeState.MUTED);
		this.applyRate();
		this.applySubsIcon();
		this.applyAudioIcon();
		this.applyQualityIcon();
		this.applyAspectRatioIcon();
		this.applyPipIcon(Boolean(document.pictureInPictureElement));
		const theaterActive = this.player.theater() === TheaterState.ON;
		this.applyTheaterIcon(theaterActive);
		const cur = this.player.item?.();
		if (cur)
			this.handleCurrentChange(cur);
		const dur = this.player.duration?.();
		if (dur)
			this.applyDuration(dur);
		this.refreshCapabilityVisibility();
		this.applyStateVisibility();
	}

	private setPlayingState(playing: boolean): void {
		this.centerWrap.classList.toggle('playing', playing);
		const icon = playing ? fluentIcons.pause : fluentIcons.play;
		const playIconHolder = this.playBtn.querySelector('.btn-icon') ?? this.playBtn;
		playIconHolder.innerHTML = svgFromIcon(icon);
		const centerIconHolder = this.centerBtn.querySelector('.btn-icon') ?? this.centerBtn;
		centerIconHolder.innerHTML = svgFromIcon(playing ? fluentIcons.pause : fluentIcons.bigPlay, 32);
		this.playBtn.setAttribute('aria-label', this.t('tooltip.play'));
	}

	private handleCurrentChange(item: VideoPlaylistItem | undefined | null): void {
		if (this.topBarRefs)
			updateTitleBar(this.player, this.topBarRefs, item);

		// Reset cached duration so chapter markers are not computed against
		// the previous item's duration while the new media loads.
		this.cachedDuration = 0;
		// Reset the playing-level cache — the next item's level numbering may
		// not match the previous item's. The first `level-switched` on the
		// new source will repopulate it.
		this._playingQualityIdx = null;

		this.refreshChaptersAndDuration();
		this.refreshCapabilityVisibility();

		// Immediately repaint any open menu pane so stale tracks from the
		// previous item are not displayed while the new source loads. The
		// `mediaReady` event re-fires these after the new tracks arrive; this
		// call clears the old data in the meantime.
		this.repaintPlaylistIfOpen();
		this.repaintSubsIfOpen();
		this.repaintAudioIfOpen();
		this.repaintQualityIfOpen();

		void this.loadSpritesForItem(item);
	}

	private async loadSpritesForItem(item: VideoPlaylistItem | undefined | null): Promise<void> {
		const myToken = ++this.spriteLoadId;
		this.spriteSet = null;
		this._revokeSpriteObjectUrl();

		this.sliderRefs.sliderPopImage.style.backgroundImage = '';
		this.sliderRefs.sliderPopImage.style.backgroundPosition = '';
		this.sliderRefs.sliderPopImage.style.width = '';
		this.sliderRefs.sliderPopImage.style.height = '';

		// Canonical path: typed previewSpriteUrl field on the playlist item.
		// Legacy fallback: tracks[].kind==='thumbnails' for un-normalised items.
		const rawSpriteUrl = this._resolveSpriteUrl(item);
		if (!rawSpriteUrl)
			return;

		// Server-relative paths must resolve against the player's media base,
		// not the page origin — an SPA fallback would feed HTML to the parser.
		const spriteUrl = (await this.resolveUrl(rawSpriteUrl, 'image')).href;

		const set = await loadSpriteSet(spriteUrl, {
			fetchText: async (url) => {
				try {
					return await this.fetch<string>(url);
				}
				catch {
					return null;
				}
			},
			fetchImageUrl: async (url) => {
				try {
					const buffer = await this.fetch<ArrayBuffer>(url, { responseType: 'arrayBuffer' });
					return URL.createObjectURL(new Blob([buffer]));
				}
				catch {
					return null;
				}
			},
		});
		if (myToken !== this.spriteLoadId) {
			if (set?.spriteUrl.startsWith('blob:'))
				URL.revokeObjectURL(set.spriteUrl);
			return;
		}
		if (!set)
			return;

		if (set.spriteUrl.startsWith('blob:'))
			this.spriteObjectUrl = set.spriteUrl;
		this.spriteSet = set;
		this.sliderRefs.sliderPopImage.style.backgroundImage = `url('${set.spriteUrl}')`;
	}

	private _revokeSpriteObjectUrl(): void {
		if (this.spriteObjectUrl) {
			URL.revokeObjectURL(this.spriteObjectUrl);
			this.spriteObjectUrl = null;
		}
	}

	override dispose(): void {
		this._revokeSpriteObjectUrl();
	}

	private _resolveSpriteUrl(item: VideoPlaylistItem | undefined | null): string | undefined {
		if (!item)
			return undefined;

		if (typeof item.previewSpriteUrl === 'string' && item.previewSpriteUrl)
			return item.previewSpriteUrl;

		const tracks = readSidecarTracks(item);
		if (!tracks)
			return undefined;

		const thumbsTrack = tracks.find(t => t?.kind === 'thumbnails' && typeof t.file === 'string');
		return thumbsTrack?.file ?? undefined;
	}

	private paintSpriteAt(time: number): void {
		if (!this.spriteSet)
			return;
		const cue = lookupCue(this.spriteSet, time);
		if (!cue)
			return;
		this.sliderRefs.sliderPopImage.style.backgroundPosition = `-${cue.x}px -${cue.y}px`;
		this.sliderRefs.sliderPopImage.style.width = `${cue.w}px`;
		this.sliderRefs.sliderPopImage.style.height = `${cue.h}px`;
	}

	private refreshChaptersAndDuration(): void {
		const dur = this.player.duration?.() ?? 0;
		if (dur)
			this.applyDuration(dur);
		this.renderChapterMarkers();
	}

	/** Rebuild the segmented chapter-marker DOM for the current item. */
	private renderChapterMarkers(): void {
		const chapters = this.player.chapters();
		const dur = this.resolveDuration();

		if (!dur || chapters.length === 0) {
			this.sliderRefs.sliderBar.classList.remove('has-chapters');
		}
		else {
			this.sliderRefs.sliderBar.classList.add('has-chapters');
		}

		this.chapterRefs = buildChapterMarkers(
			this.sliderRefs.chapterBar,
			chapters,
			dur,
			(index) => { void this.player.seekToChapter?.(index); },
			this.listen.bind(this),
		);
	}

	private updateChapterProgress(percentage: number): void {
		updateChapterProgress(this.chapterRefs, percentage);
	}

	private updateChapterBuffer(bufferedPct: number): void {
		updateChapterBuffer(this.chapterRefs, bufferedPct);
	}

	private updateChapterHover(scrubPct: number): void {
		updateChapterHover(this.chapterRefs, scrubPct);
	}

	private findChapterTitle(time: number): string | undefined {
		return this.player.chapters().find(c => time >= c.start && time <= c.end)?.title;
	}

	private resolveDuration(): number {
		const fromPlayer = this.player.duration?.() ?? 0;
		if (fromPlayer > 0)
			return fromPlayer;
		if (this.cachedDuration > 0)
			return this.cachedDuration;
		const el = this.player.videoElement;
		return Number.isFinite(el?.duration) ? (el!.duration ?? 0) : 0;
	}

	private applyTime(t: number): void {
		const dur = this.resolveDuration();
		const pct = dur > 0 ? (t / dur) * 100 : 0;
		if (!this.isScrubbing) {
			this.sliderRefs.sliderProgress.style.width = `${pct}%`;
			this.sliderRefs.sliderNipple.style.left = `${pct}%`;
			this.sliderRefs.sliderBar.setAttribute('aria-valuenow', String(Math.round(pct)));
			this.updateChapterProgress(pct);
		}
		try {
			const buf = this.player.buffered();
			const bufPct = dur > 0 ? (buf / dur) * 100 : 0;
			if (this.chapterRefs.length > 0) {
				this.updateChapterBuffer(bufPct);
			}
			else {
				this.sliderRefs.sliderBuffer.style.width = `${bufPct}%`;
			}
		}
		catch { /* SourceBuffer detach */ }
		this.currentTimeEl.textContent = fmt(t);
		this.remainingTimeEl.textContent = this._formatRemaining(t, dur);
		this.refreshTransportEnablement();
	}

	private applyDuration(dur: number): void {
		this.cachedDuration = dur;
		const cur = this.player.time?.() ?? 0;
		this.currentTimeEl.textContent = fmt(cur);
		this.remainingTimeEl.textContent = this._formatRemaining(cur, dur);
		this.renderChapterMarkers();
	}

	private _formatRemaining(cur: number, dur: number): string {
		if (dur <= 0)
			return fmt(0);
		if (this._showRemaining)
			return `-${fmt(Math.max(0, dur - cur))}`;
		return fmt(dur);
	}

	private applyVolume(v: number): void {
		applyVolume(this.volSlider, () => this.applyMutedIcon(), v);

		// Keep the vertical popup input in sync when volume changes externally.
		if (this.volSliderVertical) {
			const vertInput = this.volSliderVertical.querySelector<HTMLInputElement>('.volume-slider-vertical-input');
			if (vertInput) {
				const pct = Math.round(Math.max(0, Math.min(100, v)));
				vertInput.value = String(pct);
				vertInput.style.setProperty('--vol-pct', `${pct}%`);
			}
		}
	}

	private applyMuted(muted: boolean): void {
		applyMuted(this.volBtn, () => this.applyMutedIcon(), muted);
		this.applyPopupMuteIcon(muted);
	}

	private applyMutedIcon(): void {
		applyMutedIcon(this.volBtn, this.player, this.t.bind(this));
	}

	private applyPopupMuteIcon(muted: boolean): void {
		if (!this.volPopupMuteBtn)
			return;
		const icon = muted ? fluentIcons.volumeMuted : fluentIcons.volumeHigh;
		const iconHolder = this.volPopupMuteBtn.querySelector('.btn-icon');
		if (iconHolder) {
			iconHolder.innerHTML = svgFromIcon(icon);
		}
		this.volPopupMuteBtn.setAttribute('aria-label', this.t('tooltip.mute', {}));
	}

	private applyRate(): void {
		const rate = this.player.playbackRate?.() ?? 1;
		applyRate(this.speedBtn, rate, this.t.bind(this));
	}

	private applyAudioIcon(): void {
		const audios = this.player.audioTracks?.() ?? [];
		const defaultIdx = audios.findIndex(tr => tr.default === true);
		const manifestDefault = defaultIdx >= 0 ? defaultIdx : 0;
		const isNonDefault = audios.length > 1 && this.activeAudioIdx !== manifestDefault;
		applyAudioIcon(this.audioBtn, this.t.bind(this), isNonDefault);
	}

	private applyQualityIcon(): void {
		applyQualityIcon(this.qualityBtn, this.t.bind(this), this.playingQualityLabel(), this._userPickedQuality);
	}

	/**
	 * Human label for the level the backend is actually playing right now
	 * (e.g. "1080p"). Used by `applyQualityIcon` to surface the level in the
	 * button's aria-label / tooltip. Returns `undefined` when no level info is
	 * available (before `level-switched` lands, or non-HLS sources).
	 */
	private playingQualityLabel(): string | undefined {
		const idx = this.resolvePlayingQualityIdx();
		if (idx === null)
			return undefined;
		// `qualityLevels()` filters out unsupported codecs, so the visible
		// array is a subset of the full HLS level list. Match by the original
		// HLS index carried on each QualityLevel, not by array position.
		const levels = this.player.qualityLevels?.() ?? [];
		const level = levels.find(q => q.index === idx);
		if (!level)
			return undefined;
		return level.label ?? (level.height ? `${level.height}p` : undefined);
	}

	/**
	 * The level index the backend is actually playing. Prefers the cached
	 * `_playingQualityIdx` (updated on every `level-switched` event), and
	 * falls back to peeking the backend's `currentLevel()` for the case
	 * where the user opens the menu before the first `level-switched` fires
	 * (HLS doesn't always emit one before the first fragment lands).
	 * Returns null when no level is known.
	 */
	private resolvePlayingQualityIdx(): number | null {
		if (this._playingQualityIdx !== null)
			return this._playingQualityIdx;
		const backend = this.player.backend?.();
		const idx = backend?.currentLevel?.();
		if (typeof idx === 'number' && idx >= 0)
			return idx;
		return null;
	}

	private applyFullscreen(): void {
		applyFullscreen(this.fsBtn);
	}

	private applyTheaterIcon(active: boolean): void {
		applyTheaterIcon(this.theaterBtn, active, this.t.bind(this));
	}

	private applySubsIcon(): void {
		applySubsIcon(this.subsBtn, this.activeSubtitleIdx, this.t.bind(this));
		this.applyMenuSubsIcon();
	}

	/** Mirror the bottom-bar subtitle on/off state onto the menu category button. */
	private applyMenuSubsIcon(): void {
		const slot = this.menus?.mainButtons?.subtitles?.querySelector('.menu-button-icon-left');
		if (!slot)
			return;
		const on = this.activeSubtitleIdx !== null && this.activeSubtitleIdx !== -1;
		slot.innerHTML = svgFromIcon(on ? fluentIcons.subtitles : fluentIcons.subtitlesOff);
	}

	private applyPipIcon(active: boolean): void {
		applyPipIcon(this.pipBtn, active, this.t.bind(this));
	}

	private applyAspectRatioIcon(): void {
		const aspect = this.player.aspectRatio?.() ?? 'uniform';
		applyAspectRatioIcon(this.aspectRatioBtn, aspect === 'uniform', this.t.bind(this));
	}

	/**
	 * Mark a button as content-gated (no relevant tracks/items) so the fit
	 * algorithm can skip it without counting its width.
	 * Setting `data-content-hidden="true"` causes `applyAllVisibilityRules`
	 * to treat the button as absent from the layout.
	 */
	private setContentHidden(btn: HTMLButtonElement, hidden: boolean): void {
		if (hidden) {
			btn.setAttribute('data-content-hidden', 'true');
			btn.hidden = true;
		}
		else {
			btn.removeAttribute('data-content-hidden');
			// Fit visibility is re-applied by the next `applyAllVisibilityRules`
			// call; don't eagerly show — let the fit pass decide.
		}
	}

	private refreshCapabilityVisibility(): void {
		const subs = this.player.subtitles?.() ?? [];
		const subsCount = subs.length;

		const audios = this.player.audioTracks?.() ?? [];
		const levels = this.player.qualityLevels?.() ?? [];

		this.setContentHidden(this.subsBtn, subsCount === 0);
		this.setContentHidden(this.audioBtn, audios.length <= 1);
		this.setContentHidden(this.qualityBtn, levels.length < 2);

		const chapters = this.player.chapters();
		this.setContentHidden(this.chapBackBtn, chapters.length === 0);
		this.setContentHidden(this.chapFwdBtn, chapters.length === 0);

		const queueLen = this.safeQueueLength();
		this.setContentHidden(this.playlistBtn, queueLen < 2);

		this.menus.mainButtons.subtitles.style.display = subsCount === 0 ? 'none' : 'flex';
		this.menus.mainButtons.language.style.display = audios.length <= 1 ? 'none' : 'flex';
		this.menus.mainButtons.quality.style.display = levels.length < 2 ? 'none' : 'flex';
		this.menus.mainButtons.playlist.style.display = queueLen < 2 ? 'none' : 'flex';

		// A settings menu with nothing in it is noise — hide the button when
		// every section it would show is empty (v1 rule, extended with the
		// consumer-supplied settingsItems rows).
		const speeds = this.player.playbackRates?.() ?? [];
		const settingsEmpty = speeds.length <= 1
			&& audios.length <= 1
			&& subsCount === 0
			&& (this.opts?.settingsItems?.length ?? 0) === 0;
		this.setContentHidden(this.settingsBtn, settingsEmpty);

		// Re-run fit pass now that content-gating may have freed space.
		if (this._responsiveState.lastContainerWidth > 0) {
			applyAllVisibilityRules(
				this._responsiveState,
				this.opts,
				this._responsiveState.lastContainerWidth,
				payload => this.emit('layout:breakpoint', payload),
				this.player.container,
			);
		}

		this.refreshTransportEnablement();
	}

	private refreshTransportEnablement(): void {
		const idx = this.safeCurrentIndex();
		const len = this.safeQueueLength();

		const onFirst = idx <= 0 || len <= 1;
		const onLast = idx >= len - 1 || len <= 1;
		this.setDisabled(this.prevBtn, onFirst);
		this.setDisabled(this.nextBtn, onLast);

		const t = this.player.time?.() ?? 0;
		const dur = this.resolveDuration();
		this.setDisabled(this.rewindBtn, t <= 0);
		this.setDisabled(this.forwardBtn, dur > 0 && t >= dur - 0.25);

		const chapters = this.player.chapters();
		const hasPrevChap = chapters.some(c => c.start < t - 1);
		const hasNextChap = chapters.some(c => c.start > t + 1);
		this.setDisabled(this.chapBackBtn, !hasPrevChap);
		this.setDisabled(this.chapFwdBtn, !hasNextChap);
	}

	private setDisabled(btn: HTMLButtonElement, disabled: boolean): void {
		if (disabled) {
			btn.setAttribute('disabled', 'true');
			btn.setAttribute('aria-disabled', 'true');
		}
		else {
			btn.removeAttribute('disabled');
			btn.removeAttribute('aria-disabled');
		}
	}

	private safeCurrentIndex(): number {
		try {
			return this.player.index();
		}
		catch { /* not implemented */ }
		return 0;
	}

	private safeQueueLength(): number {
		try {
			return this.player.queueLength();
		}
		catch { /* not implemented */ }
		return this.player.queue().length;
	}

	private previousChapter(): void {
		const chapters = this.player.chapters();
		const t = this.player.time?.() ?? 0;
		for (let i = chapters.length - 1; i >= 0; i--) {
			if (chapters[i]!.start < t - 1) { void this.player.time?.(chapters[i]!.start); return; }
		}
		void this.player.time?.(0);
	}

	private nextChapter(): void {
		const chapters = this.player.chapters();
		const t = this.player.time?.() ?? 0;
		for (let i = 0; i < chapters.length; i++) {
			if (chapters[i]!.start > t + 1) { void this.player.time?.(chapters[i]!.start); return; }
		}
	}

	// ── Menu state ──────────────────────────────────────────────────

	private _menuTriggerBtn(id: SubMenuId): HTMLButtonElement | null {
		const map: Partial<Record<SubMenuId, HTMLButtonElement>> = {
			speed: this.speedBtn,
			quality: this.qualityBtn,
			subtitles: this.subsBtn,
			language: this.audioBtn,
			playlist: this.playlistBtn,
			aspectRatio: this.aspectRatioBtn,
		};
		return map[id] ?? null;
	}

	private _setMenuTriggerExpanded(id: SubMenuId | null, expanded: boolean): void {
		if (id !== null) {
			this._menuTriggerBtn(id)?.setAttribute('aria-expanded', String(expanded));
		}
		else {
			this.settingsBtn.setAttribute('aria-expanded', String(expanded));
		}
	}

	private _collapseAllTriggers(): void {
		for (const btn of [
			this.settingsBtn,
			this.speedBtn,
			this.qualityBtn,
			this.subsBtn,
			this.audioBtn,
			this.playlistBtn,
			this.aspectRatioBtn,
		]) {
			btn.setAttribute('aria-expanded', 'false');
		}
	}

	private openMainMenu(): void {
		this._collapseAllTriggers();
		this._setMenuTriggerExpanded(null, true);

		this.menuOpen = true;
		this._activityState.menuOpen = true;
		this.currentSubMenu = null;
		this.menus.frame.classList.add('open');
		this.menus.content.classList.remove('sub-menu-open');
		for (const pane of Object.values(this.menus.panes)) pane.classList.remove('is-open');
		try { this.menus.frameDialog.show?.(); }
		catch { /* not supported */ }
	}

	private openSubMenu(id: SubMenuId): void {
		this._collapseAllTriggers();
		this._setMenuTriggerExpanded(id, true);

		this.menuOpen = true;
		this._activityState.menuOpen = true;
		this.currentSubMenu = id;
		this.menus.frame.classList.add('open');
		this.menus.content.classList.add('sub-menu-open');
		for (const [k, pane] of Object.entries(this.menus.panes)) {
			pane.classList.toggle('is-open', k === id);
		}
		this.repaintPane(id);
		try { this.menus.frameDialog.show?.(); }
		catch { /* not supported */ }
		this.bumpActivity();
	}

	/**
	 * Up/Down moves focus through the open pane's rows (wrapping), keeping
	 * the focused row centered in the scroll container. Handled on the menu
	 * frame with propagation stopped so the player-level key handler never
	 * seeks or changes volume while the user is navigating a menu.
	 */
	private wireMenuKeyboardNav(): void {
		this.listen(this.menus.frame, 'keydown', (e: Event) => {
			const key = (e as KeyboardEvent).key;
			if (key !== 'ArrowDown' && key !== 'ArrowUp')
				return;

			const scope = (this.currentSubMenu && this.menus.panes[this.currentSubMenu]) || this.menus.frame;
			const rows = [...scope.querySelectorAll<HTMLButtonElement>('button:not([hidden]):not([disabled])')]
				.filter(button => button.offsetParent !== null);
			if (rows.length === 0)
				return;

			e.preventDefault();
			e.stopPropagation();

			const activeIdx = rows.indexOf(document.activeElement as HTMLButtonElement);
			const nextIdx = key === 'ArrowDown'
				? (activeIdx + 1) % rows.length
				: (activeIdx - 1 + rows.length) % rows.length;
			const next = rows[nextIdx]!;
			next.focus();
			next.scrollIntoView({ block: 'center' });
		});
	}

	private closeAllMenus(): void {
		this._collapseAllTriggers();

		this.menuOpen = false;
		this._activityState.menuOpen = false;
		this.currentSubMenu = null;
		this.menus.frame.classList.remove('open');
		this.menus.content.classList.remove('sub-menu-open');
		for (const pane of Object.values(this.menus.panes)) pane.classList.remove('is-open');
		try { this.menus.frameDialog.close?.(); }
		catch { /* already closed */ }

		// Restart the inactivity timer now that no menu is blocking it.
		// If paused, emit active immediately (no timer); if playing, arm
		// the 4 s countdown from the moment the menu closes.
		this.bumpActivity();
	}

	/**
	 * Reconcile our locally-cached active indexes with the kit's canonical
	 * state after a new item has finished loading (`mediaReady`).
	 *
	 * Reads the kit's actual selection via `subtitle()` /
	 * `audioTrack()` first — those are the source of truth and stay
	 * correct for plugin-rendered tracks (ASS via Octopus, etc.) that never
	 * appear in the backend's native track lists. Only falls back to a
	 * default-track heuristic when the kit has no selection yet.
	 */
	private syncActiveIndexes(): void {
		const audios = this.player.audioTracks?.() ?? [];
		const audioSelection = this.player.audioTrack?.();
		if (audioSelection != null && typeof audioSelection.index === 'number' && audioSelection.index >= 0) {
			this.activeAudioIdx = audioSelection.index;
		}
		else if (audios.length > 0) {
			const defIdx = audios.findIndex(t => t.default === true);
			this.activeAudioIdx = defIdx >= 0 ? defIdx : 0;
		}

		const subSelection = this.player.subtitle?.();
		this.activeSubtitleIdx = (subSelection != null && typeof subSelection.index === 'number' && subSelection.index >= 0)
			? subSelection.index
			: -1;

		// Read the kit's canonical selection. `quality()` returns either
		// a number (manual pick) or `'auto'` (auto mode); reflect both straight
		// into our cache so a late-attached plugin doesn't have to wait for
		// a level-switched event to converge.
		const qualityChoice = this.player.quality?.();
		if (qualityChoice === 'auto' || qualityChoice == null) {
			this.activeQualityIdx = 'auto';
			this._userPickedQuality = false;
		}
		else {
			this.activeQualityIdx = qualityChoice.index;
			this._userPickedQuality = true;
		}
	}

	private menuState(): MenuRenderState {
		// `syncActiveIndexes` resets indexes to "default track" which would
		// overwrite the user's pick every time the pane repaints. Active indexes
		// are kept current by the `subtitle` / `audioTrack` / `level-switched`
		// event handlers — read them as-is here.
		return {
			subtitleIdx: this.activeSubtitleIdx,
			audioIdx: this.activeAudioIdx,
			qualityIdx: this.activeQualityIdx,
			playingQualityIdx: this.resolvePlayingQualityIdx(),
		};
	}

	private repaintPane(id: SubMenuId): void {
		const closeOnPick = (): void => this.closeAllMenus();
		const keepOpenOnPick = (paneId: SubMenuId) => (): void => { this.repaintPane(paneId); };
		const listen = this.listen.bind(this);
		const st = this.menuState();
		if (id === 'speed')
			renderSpeedPane(this.menus.panes.speed, this.player, listen, keepOpenOnPick('speed'));
		if (id === 'quality')
			renderQualityPane(this.menus.panes.quality, this.player, listen, closeOnPick, st);
		if (id === 'subtitles')
			renderSubsPane(this.menus.panes.subtitles, this.player, listen, closeOnPick, st);
		if (id === 'language')
			renderAudioPane(this.menus.panes.language, this.player, listen, closeOnPick, st);
		if (id === 'playlist') {
			renderPlaylistPane(this.menus.panes.playlist, this.player, listen, closeOnPick, {
				imageBaseUrl: this.opts?.imageBaseUrl,
			});
		}
		if (id === 'subtitleSettings') {
			renderSubtitleSettingsPane(this.menus.panes.subtitleSettings, this.player, listen, closeOnPick);
		}
		if (id === 'aspectRatio') {
			renderAspectRatioPane(this.menus.panes.aspectRatio, this.player, listen, keepOpenOnPick('aspectRatio'));
		}
	}

	private repaintSubsIfOpen(): void {
		if (this.currentSubMenu === 'subtitles')
			this.repaintPane('subtitles');
	}

	private repaintAudioIfOpen(): void {
		if (this.currentSubMenu === 'language')
			this.repaintPane('language');
	}

	private repaintQualityIfOpen(): void {
		if (this.currentSubMenu === 'quality')
			this.repaintPane('quality');
	}

	private repaintSpeedIfOpen(): void {
		if (this.currentSubMenu === 'speed')
			this.repaintPane('speed');
	}

	private repaintPlaylistIfOpen(): void {
		if (this.currentSubMenu === 'playlist')
			this.repaintPane('playlist');
	}

	private repaintAspectRatioIfOpen(): void {
		if (this.currentSubMenu === 'aspectRatio')
			this.repaintPane('aspectRatio');
	}

	// ── Activity / auto-hide ────────────────────────────────────────

	private bumpActivity(): void {
		bumpActivity(
			this._activityState,
			this.player,
			this.opts?.inactivityMs ?? 4000,
			ms => this.timeout(() => this.maybeHide(), ms),
		);
	}

	private maybeHide(): void {
		maybeHide(this._activityState, this.player);
	}

	private dismissOverlay(): void {
		dismissOverlay(this._activityState, this.player);
	}
}

export const desktopUiPlugin = DesktopUiPlugin;
