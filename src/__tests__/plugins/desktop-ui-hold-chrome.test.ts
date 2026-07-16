// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tests for `holdChrome()` / `releaseChrome()`.
 *
 * An external plugin with its own overlay anchored to the top/bottom bars — a
 * device picker, say — pins the chrome so it can't auto-hide underneath. The
 * hold is counted, so independent holders compose, and a stray release can't
 * wedge the chrome permanently hidden.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DesktopUiPlugin, desktopUiPlugin } from '../../plugins/desktop-ui';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

function fakePlayingState(player: NMVideoPlayer): void {
	Object.assign(player as object, { playState: () => 'playing' });
}

async function makePlayer(): Promise<NMVideoPlayer> {
	const player = new NMVideoPlayer('test').setup({});
	player.addPlugin(desktopUiPlugin, { inactivityMs: 4000 });
	await player.ready();
	return player;
}

describe('DesktopUiPlugin — holdChrome / releaseChrome', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		(globalThis as unknown as Record<string, unknown>).ResizeObserver = MockResizeObserver;
		vi.useFakeTimers();
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		delete (globalThis as unknown as Record<string, unknown>).ResizeObserver;
		vi.useRealTimers();
	});

	it('keeps .active past the inactivity timer while a hold is open', async () => {
		const player = await makePlayer();
		fakePlayingState(player);
		const ui = player.getPlugin(DesktopUiPlugin)!;

		ui.holdChrome();
		vi.advanceTimersByTime(4500);

		expect(player.container.classList.contains('active')).toBe(true);
	});

	it('lets the chrome hide again once the hold is released', async () => {
		const player = await makePlayer();
		fakePlayingState(player);
		const ui = player.getPlugin(DesktopUiPlugin)!;

		ui.holdChrome();
		vi.advanceTimersByTime(4500);
		expect(player.container.classList.contains('active')).toBe(true);

		ui.releaseChrome();
		vi.advanceTimersByTime(4500);
		expect(player.container.classList.contains('active')).toBe(false);
	});

	it('holds until the LAST of several holders releases', async () => {
		const player = await makePlayer();
		fakePlayingState(player);
		const ui = player.getPlugin(DesktopUiPlugin)!;

		ui.holdChrome();
		ui.holdChrome();

		ui.releaseChrome();
		vi.advanceTimersByTime(4500);
		expect(player.container.classList.contains('active'), 'one hold remains, chrome stays').toBe(true);

		ui.releaseChrome();
		vi.advanceTimersByTime(4500);
		expect(player.container.classList.contains('active'), 'last hold gone, chrome hides').toBe(false);
	});

	it('floors extra releases at zero so a double-release cannot wedge it hidden', async () => {
		const player = await makePlayer();
		fakePlayingState(player);
		const ui = player.getPlugin(DesktopUiPlugin)!;

		// Two releases against one hold must not drive the count negative.
		ui.holdChrome();
		ui.releaseChrome();
		ui.releaseChrome();

		// A fresh hold must still pin the chrome — proof the count didn't go to -1.
		ui.holdChrome();
		vi.advanceTimersByTime(4500);
		expect(player.container.classList.contains('active')).toBe(true);
	});
});
