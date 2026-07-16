// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Activity / auto-hide concern for the desktop UI plugin.
 *
 * Owns the three-state machine: bump → timer → maybe-hide → emit activity event.
 * All functions take the mutable state bag as the first parameter so they are
 * pure of `this`, matching the free-function pattern used by topBar.ts and
 * menus.ts.
 *
 * Integration: `DesktopUiPlugin` stores an `ActivityState` instance, passes it
 * to every call here, and exposes `bumpActivity()` / `maybeHide()` /
 * `dismissOverlay()` as thin wrappers.
 */

import type { IVideoPlayer, VideoPlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

// ── State bag ──────────────────────────────────────────────────────────────────

export interface ActivityState {
	activityActive: boolean;
	inactivityToken: number | null;
	menuOpen: boolean;
	isScrubbing: boolean;
	isControlsHovered: boolean;
	/**
	 * Number of external holders pinning the chrome visible (an outside plugin
	 * with an open overlay of its own — a device picker, say). A count, not a
	 * flag, so independent holders compose: the chrome stays until the last one
	 * releases. `menuOpen` covers this plugin's own menus; this covers everyone
	 * else's.
	 */
	chromeHolds: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Emit `activity` only when the active state actually flips.
 *
 * Desync guard: when showing (`active=true`) the flag may agree but the
 * container class may have been stripped by a direct `player.emit('activity',
 * {active:false})` call (bypassing this function). In that case force-emit so
 * the binary rule re-adds `.active`. The guard is kept for `active=false` so
 * `maybeHide()` calls while already hidden don't fire noisy events.
 */
export function setActivity(
	state: ActivityState,
	player: IVideoPlayer<VideoPlaylistItem>,
	active: boolean,
): void {
	if (active) {
		const domIsActive = player.container.classList.contains('active');
		if (state.activityActive && domIsActive)
			return;

		state.activityActive = true;
		player.emit('activity', { active: true });
	}
	else {
		if (!state.activityActive)
			return;

		state.activityActive = false;
		player.emit('activity', { active: false });
	}
}

/**
 * Show controls immediately and (re-)arm the inactivity countdown.
 * `scheduleHide` must call `maybeHide` after `inactivityMs`.
 */
export function bumpActivity(
	state: ActivityState,
	player: IVideoPlayer<VideoPlaylistItem>,
	inactivityMs: number,
	scheduleHide: (ms: number) => number,
): void {
	setActivity(state, player, true);

	if (state.inactivityToken !== null)
		clearTimeout(state.inactivityToken);
	state.inactivityToken = scheduleHide(inactivityMs);
}

/**
 * Hide controls if playback is active and nothing is blocking the hide.
 * No-op when paused, menu is open, or controls are hovered.
 */
export function maybeHide(
	state: ActivityState,
	player: IVideoPlayer<VideoPlaylistItem>,
): void {
	if (!player.playState || player.playState() !== 'playing')
		return;
	if (state.menuOpen)
		return;
	if (state.chromeHolds > 0)
		return;
	if (state.isControlsHovered)
		return;

	setActivity(state, player, false);
}

/**
 * Deliberate paused-state dismiss; bypasses `maybeHide`'s playing-only guard.
 * Skips when a menu is open or a scrub is releasing.
 */
export function dismissOverlay(
	state: ActivityState,
	player: IVideoPlayer<VideoPlaylistItem>,
): void {
	if (state.menuOpen)
		return;
	if (state.chromeHolds > 0)
		return;
	if (state.isScrubbing)
		return;

	setActivity(state, player, false);
}
