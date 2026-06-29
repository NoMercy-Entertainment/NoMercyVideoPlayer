// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Button-state concern — all `apply*` helpers that update button icons,
 * aria-labels, and visual state in response to player events.
 *
 * Integration: each helper receives only the DOM refs it touches and any
 * scalar values it needs. No plugin instance is passed; these are pure DOM
 * mutations driven by event data that the plugin class hands in.
 */

import type { ITranslator } from '@nomercy-entertainment/nomercy-player-core';
import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';
import { VolumeState } from '../../types';

import { fluentIcons, svgFromIcon } from './icons';

/**
 * Render an icon into the button's `.btn-icon` child, falling back to the
 * button itself for buttons created before the icon-holder pattern. Keeping
 * the icon in a sibling element prevents `innerHTML` reassignments from
 * destroying the `.tooltip` span attached by `addTooltip()`.
 */
function setBtnIcon(btn: HTMLElement, html: string): void {
	const target = btn.querySelector('.btn-icon') ?? btn;
	target.innerHTML = html;
}

// ── Volume ─────────────────────────────────────────────────────────────────────

/** Sync the volume slider value and CSS custom property. `volume` is 0-100 (kit scale). */
export function applyVolume(
	volSlider: HTMLInputElement,
	applyMutedIconFn: () => void,
	volume: number,
): void {
	const clamped = Math.round(Math.max(0, Math.min(100, volume)));
	volSlider.value = String(clamped);
	volSlider.style.setProperty('--vol-pct', `${clamped}%`);
	applyMutedIconFn();
}

/** Toggle the muted CSS class on the volume button. */
export function applyMuted(volBtn: HTMLButtonElement, applyMutedIconFn: () => void, muted: boolean): void {
	volBtn.classList.toggle('muted', muted);
	applyMutedIconFn();
}

/** Update the volume button icon and aria-label to reflect current mute + level. */
export function applyMutedIcon(
	volBtn: HTMLButtonElement,
	player: IVideoPlayer<VideoPlaylistItem>,
	t: ITranslator['t'],
): void {
	const muted = player.volumeState() === VolumeState.MUTED;
	const volume = player.volume?.() ?? 100;
	let icon: typeof fluentIcons.volumeMuted;
	if (muted || volume === 0)
		icon = fluentIcons.volumeMuted;
	else if (volume < 30)
		icon = fluentIcons.volumeLow;
	else if (volume <= 60)
		icon = fluentIcons.volumeMedium;
	else
		icon = fluentIcons.volumeHigh;
	setBtnIcon(volBtn, svgFromIcon(icon));
	volBtn.setAttribute('aria-label', t('tooltip.mute'));
}

// ── Playback rate ──────────────────────────────────────────────────────────────

/**
 * Update the speed button icon and aria-label.
 * Adds `is-active` when `rate` diverges from the default (1), which forces the
 * filled icon variant via the CSS `.btn.is-active` rule.
 * The aria-label appends the current rate when it is non-default so screen-reader
 * users know the active speed without opening the menu.
 */
export function applyRate(speedBtn: HTMLButtonElement, rate: number, t: ITranslator['t']): void {
	setBtnIcon(speedBtn, svgFromIcon(fluentIcons.speed));
	speedBtn.classList.toggle('is-active', rate !== 1);
	const base = t('tooltip.speed');
	speedBtn.setAttribute('aria-label', rate !== 1 ? `${base} (${rate}×)` : base);
}

// ── Quality ────────────────────────────────────────────────────────────────────

/**
 * Update the quality button icon, `is-active` class, and aria-label.
 * `isManual` is true when the user has pinned a specific quality level (not
 * auto). A manual quality selection is a non-default state that should be
 * indicated via `is-active` — matching the pattern used by aspect, pip, and speed.
 * The aria-label includes the playing level when known.
 */
export function applyQualityIcon(
	qualityBtn: HTMLButtonElement,
	t: ITranslator['t'],
	playingLabel?: string,
	isManual = false,
): void {
	setBtnIcon(qualityBtn, svgFromIcon(fluentIcons.quality));
	qualityBtn.classList.toggle('is-active', isManual);
	const base = t('tooltip.quality');
	qualityBtn.setAttribute('aria-label', playingLabel ? `${base}: ${playingLabel}` : base);
}

// ── Fullscreen ─────────────────────────────────────────────────────────────────

/** Sync the fullscreen button icon to the current fullscreen state. */
export function applyFullscreen(fsBtn: HTMLButtonElement): void {
	const fs = Boolean(document.fullscreenElement);
	setBtnIcon(fsBtn, svgFromIcon(fs ? fluentIcons.exitFullscreen : fluentIcons.fullscreen));
}

// ── Theater ────────────────────────────────────────────────────────────────────

/** Update the theater button icon and aria-label. */
export function applyTheaterIcon(theaterBtn: HTMLButtonElement, active: boolean, t: ITranslator['t']): void {
	setBtnIcon(theaterBtn, svgFromIcon(active ? fluentIcons.theaterExit : fluentIcons.theater));
	theaterBtn.setAttribute('aria-label', t('tooltip.theater'));
}

// ── Subtitles ──────────────────────────────────────────────────────────────────

/**
 * Toggle subtitles button between the on/off icon AND the `is-active` class
 * based on the active track index. An active subtitle track (index >= 0) is
 * non-default, so both the filled icon and `is-active` are applied together.
 */
export function applySubsIcon(subsBtn: HTMLButtonElement, activeSubtitleIdx: number | null, t: ITranslator['t']): void {
	const on = activeSubtitleIdx !== null && activeSubtitleIdx !== -1;
	setBtnIcon(subsBtn, svgFromIcon(on ? fluentIcons.subtitles : fluentIcons.subtitlesOff));
	subsBtn.classList.toggle('is-active', on);
	subsBtn.setAttribute('aria-label', t('tooltip.subtitles'));
}

// ── Picture-in-picture ─────────────────────────────────────────────────────────

/**
 * Update the PiP button icon, `is-active` class, and aria-label.
 * PiP engaged is a non-default state, so `is-active` is added alongside the
 * exit-pip icon — matching the aspect-ratio and speed pattern exactly.
 */
export function applyPipIcon(pipBtn: HTMLButtonElement, active: boolean, t: ITranslator['t']): void {
	setBtnIcon(pipBtn, svgFromIcon(active ? fluentIcons.pipExit : fluentIcons.pipEnter));
	pipBtn.classList.toggle('is-active', active);
	pipBtn.setAttribute('aria-label', t('tooltip.pip'));
}

// ── Audio track ────────────────────────────────────────────────────────────────

/**
 * Update the audio button icon, `is-active` class, and aria-label.
 * `isNonDefault` is true when the playing track is not the manifest's default
 * track (index 0 / default flag). A non-default audio selection is a changed
 * state and should be indicated — matching the pattern used by subtitle, aspect,
 * pip, and speed.
 */
export function applyAudioIcon(audioBtn: HTMLButtonElement, t: ITranslator['t'], isNonDefault = false): void {
	setBtnIcon(audioBtn, svgFromIcon(fluentIcons.language));
	audioBtn.classList.toggle('is-active', isNonDefault);
	audioBtn.setAttribute('aria-label', t('tooltip.audio'));
}

// ── Aspect ratio ───────────────────────────────────────────────────────────────

/**
 * Update the aspect-ratio button icon and aria-label. The hover tooltip is owned by `addTooltip()`.
 * Adds `is-active` when the aspect diverges from the default (`'uniform'`), which forces the
 * filled icon variant via the CSS `.btn.is-active` rule.
 */
export function applyAspectRatioIcon(aspectRatioBtn: HTMLButtonElement, isDefault: boolean, t: ITranslator['t']): void {
	setBtnIcon(aspectRatioBtn, svgFromIcon(fluentIcons.aspectFit));
	aspectRatioBtn.classList.toggle('is-active', !isDefault);
	aspectRatioBtn.setAttribute('aria-label', t('tooltip.aspectRatio'));
}
