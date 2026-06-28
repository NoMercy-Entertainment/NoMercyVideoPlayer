// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Regression: desktop-ui must NOT add 'nomercyplayer' to the container.
 * The kit's base-player / initPlayerCoreState owns that class — it is applied
 * before any plugin mounts. If the plugin adds it too, classList has the class
 * twice (DOMTokenList deduplicates, but the intent is wrong and the assertion
 * guards against re-adding the imperative call in future).
 *
 * Contract: after plugin.use() resolves, container.classList has 'nomercyplayer'
 * exactly once, and it was NOT put there by the desktop-ui plugin.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DesktopUiPlugin, desktopUiPlugin } from '../../plugins/desktop-ui';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

describe('DesktopUiPlugin — nomercyplayer class ownership', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('container has nomercyplayer exactly once after plugin use()', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const container = player.container;
		const count = [...container.classList].filter(cls => cls === 'nomercyplayer').length;
		expect(count).toBe(1);
	});

	it('overlay() exposes the overlay root for other plugins to mount into', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const overlay = player.getPlugin(DesktopUiPlugin)!.overlay();
		expect(overlay).toBeInstanceOf(HTMLElement);
		expect(overlay!.classList.contains('overlay')).toBe(true);
		expect(player.container.contains(overlay)).toBe(true);
	});

	it('desktop-ui plugin itself does not add nomercyplayer (class is present pre-mount)', async () => {
		const player = new NMVideoPlayer('test').setup({});

		// Remove the class before plugin mounts so we can detect if the plugin
		// re-adds it independently.
		player.container.classList.remove('nomercyplayer');
		expect(player.container.classList.contains('nomercyplayer')).toBe(false);

		await player.addPlugin(desktopUiPlugin).ready();

		// If the plugin was the culprit it would have added it back; after the
		// fix it must NOT have done so.
		expect(player.container.classList.contains('nomercyplayer')).toBe(false);
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Regression: desktop-ui must NOT toggle .theater on the container.
//
// The core containerClassEmit mixin owns every container STATE class
// (playing / paused / muted / theater / pip / fullscreen / buffering) via
// CONTAINER_CLASS_RULES. When the plugin ALSO called
// container.classList.toggle('theater', d.active) on the 'theater' event,
// the class was toggled twice per call (once by core, once by the plugin),
// which cancelled/inverted the result.
//
// The observable symptom: theater(true) ended up removing .theater (not
// adding it), because toggle(cls, true) → toggle(cls, true) = add then add =
// still present ... but the init path at applyInitialState() also called
// toggle, producing three total calls for an odd-count cancel.
//
// Fix: plugin may update BUTTON state (applyTheaterIcon) only; container
// state class is exclusively core's job.
// ──────────────────────────────────────────────────────────────────────────────

describe('DesktopUiPlugin — theater container class ownership (core-only)', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('theater(true) adds .theater to container with desktop-ui plugin active', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		player.theater(true);

		expect(player.container.classList.contains('theater')).toBe(true);
	});

	it('theater(false) removes .theater from container with desktop-ui plugin active', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		player.theater(true);
		expect(player.container.classList.contains('theater')).toBe(true);

		player.theater(false);
		expect(player.container.classList.contains('theater')).toBe(false);
	});

	it('toggleTheater() adds .theater on first call and removes it on second with plugin active', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		player.toggleTheater();
		expect(player.container.classList.contains('theater')).toBe(true);

		player.toggleTheater();
		expect(player.container.classList.contains('theater')).toBe(false);
	});

	it('theaterDefault:true results in .theater on container after plugin mounts', async () => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '<div id="test2" class="nomercyplayer"></div>';
		const player = new NMVideoPlayer('test2').setup({ theaterDefault: true } as never);
		await player.addPlugin(desktopUiPlugin).ready();

		expect(player.container.classList.contains('theater')).toBe(true);
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Regression: theater button icon must swap to theaterExit (M8.40586) when
// theater is active, and back to theater (M16.4059) when inactive.
//
// The handler reads live state via this.player.theater() === TheaterState.ON
// rather than trusting the event payload d.active, matching the pip pattern
// (pip reads document.pictureInPictureElement).
// ──────────────────────────────────────────────────────────────────────────────

describe('DesktopUiPlugin — theater button icon state', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('theater button shows inactive icon (M16.4059) before any toggle', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, { buttons: { theater: true } }).ready();

		const theaterBtn = document.querySelector<HTMLButtonElement>('#theater')!;
		expect(theaterBtn).not.toBeNull();
		expect(theaterBtn.querySelector('.btn-icon')!.innerHTML).toContain('M16.4059');
	});

	it('theater button swaps to active icon (M8.40586) after theater(true)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, { buttons: { theater: true } }).ready();

		player.theater(true);

		const theaterBtn = document.querySelector<HTMLButtonElement>('#theater')!;
		expect(theaterBtn.querySelector('.btn-icon')!.innerHTML).toContain('M8.40586');
	});

	it('theater button returns to inactive icon (M16.4059) after theater(false)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, { buttons: { theater: true } }).ready();

		player.theater(true);
		player.theater(false);

		const theaterBtn = document.querySelector<HTMLButtonElement>('#theater')!;
		expect(theaterBtn.querySelector('.btn-icon')!.innerHTML).toContain('M16.4059');
	});
});
