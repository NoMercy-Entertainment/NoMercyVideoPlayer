// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Icon-state mixin — all `apply*` helpers that update button icons, aria-labels,
 * and visual state in response to player events.
 *
 * `buttonState.ts` owns the pure DOM-mutation free functions; this mixin binds
 * them to the plugin's button refs, player, and state bags. It also holds the
 * quality-label resolution logic that requires both player and menu state.
 *
 * Owns: applyVolume, applyMuted, applyMutedIcon, applyPopupMuteIcon, applyRate,
 *       applyAudioIcon, applyQualityIcon, playingQualityLabel,
 *       resolvePlayingQualityIdx, applyFullscreen, applyTheaterIcon,
 *       applySubsIcon, applyMenuSubsIcon, applyPipIcon, applyAspectRatioIcon.
 */

import type { DesktopUiInternals } from '../internals';
import { fluentIcons, svgFromIcon } from '../data/icons';
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
} from '../helpers/buttonState';

export const iconStateMethods = {
	applyVolume(this: DesktopUiInternals, v: number): void {
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
	},

	applyMuted(this: DesktopUiInternals, muted: boolean): void {
		applyMuted(this.volBtn, () => this.applyMutedIcon(), muted);
		this.applyPopupMuteIcon(muted);
	},

	applyMutedIcon(this: DesktopUiInternals): void {
		applyMutedIcon(this.volBtn, this.player, this.t.bind(this));
	},

	applyPopupMuteIcon(this: DesktopUiInternals, muted: boolean): void {
		if (!this.volPopupMuteBtn)
			return;
		const icon = muted ? fluentIcons.volumeMuted : fluentIcons.volumeHigh;
		const iconHolder = this.volPopupMuteBtn.querySelector('.btn-icon');
		if (iconHolder) {
			iconHolder.innerHTML = svgFromIcon(icon);
		}
		this.volPopupMuteBtn.setAttribute('aria-label', this.t('tooltip.mute', {}));
	},

	applyRate(this: DesktopUiInternals): void {
		const rate = this.player.playbackRate?.() ?? 1;
		applyRate(this.speedBtn, rate, this.t.bind(this));
	},

	applyAudioIcon(this: DesktopUiInternals): void {
		const audios = this.player.audioTracks?.() ?? [];
		const defaultIdx = audios.findIndex(tr => tr.default === true);
		const manifestDefault = defaultIdx >= 0 ? defaultIdx : 0;
		const isNonDefault = audios.length > 1 && this._menuControlState.activeAudioIdx !== manifestDefault;
		applyAudioIcon(this.audioBtn, this.t.bind(this), isNonDefault);
	},

	applyQualityIcon(this: DesktopUiInternals): void {
		applyQualityIcon(
			this.qualityBtn,
			this.t.bind(this),
			this.playingQualityLabel(),
			this._menuControlState.userPickedQuality,
		);
	},

	/**
	 * Human label for the level the backend is actually playing right now
	 * (e.g. "1080p"). Returns `undefined` when no level info is available
	 * (before `level-switched` lands, or non-HLS sources).
	 */
	playingQualityLabel(this: DesktopUiInternals): string | undefined {
		const idx = this.resolvePlayingQualityIdx();
		if (idx === null)
			return undefined;
		// `qualityLevels()` filters unsupported codecs — match by the original
		// HLS index, not array position.
		const levels = this.player.qualityLevels?.() ?? [];
		const level = levels.find(q => q.index === idx);
		if (!level)
			return undefined;
		return level.label ?? (level.height ? `${level.height}p` : undefined);
	},

	/**
	 * The level index the backend is actually playing. Prefers the cached
	 * `playingQualityIdx` (updated on `level-switched`), falls back to peeking
	 * `backend.currentLevel()` before the first `level-switched` fires.
	 * Returns null when no level is known.
	 */
	resolvePlayingQualityIdx(this: DesktopUiInternals): number | null {
		if (this._menuControlState.playingQualityIdx !== null)
			return this._menuControlState.playingQualityIdx;
		const backend = this.player.backend?.();
		const idx = backend?.currentLevel?.();
		if (typeof idx === 'number' && idx >= 0)
			return idx;
		return null;
	},

	applyFullscreen(this: DesktopUiInternals): void {
		applyFullscreen(this.fsBtn);
	},

	applyTheaterIcon(this: DesktopUiInternals, active: boolean): void {
		applyTheaterIcon(this.theaterBtn, active, this.t.bind(this));
	},

	applySubsIcon(this: DesktopUiInternals): void {
		applySubsIcon(this.subsBtn, this._menuControlState.activeSubtitleIdx, this.t.bind(this));
		this.applyMenuSubsIcon();
	},

	/** Mirror the bottom-bar subtitle on/off state onto the menu category button. */
	applyMenuSubsIcon(this: DesktopUiInternals): void {
		const slot = this.menus?.mainButtons?.subtitles?.querySelector('.menu-button-icon-left');
		if (!slot)
			return;
		const on = this._menuControlState.activeSubtitleIdx !== null
			&& this._menuControlState.activeSubtitleIdx !== -1;
		slot.innerHTML = svgFromIcon(on ? fluentIcons.subtitles : fluentIcons.subtitlesOff);
	},

	applyPipIcon(this: DesktopUiInternals, active: boolean): void {
		applyPipIcon(this.pipBtn, active, this.t.bind(this));
	},

	applyAspectRatioIcon(this: DesktopUiInternals): void {
		const aspect = this.player.aspectRatio?.() ?? 'uniform';
		applyAspectRatioIcon(this.aspectRatioBtn, aspect === 'uniform', this.t.bind(this));
	},
} as const;
