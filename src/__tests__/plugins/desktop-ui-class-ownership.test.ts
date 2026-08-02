// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Regression: desktop-ui must NOT add 'nomercyplayer' to the container.
 * The player self-applies the class during setup() (S00-R2) before any plugin
 * mounts. If the plugin added it too, classList would carry the class twice
 * (DOMTokenList deduplicates, but the intent is wrong and the assertion guards
 * against re-adding the imperative call in future).
 *
 * Contract (new — S00-R2): setup() self-applies 'nomercyplayer'; consumers no
 * longer need to add it manually. After plugin.use() resolves the container
 * carries 'nomercyplayer' exactly once, put there by setup() NOT the plugin.
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
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('setup() self-applies nomercyplayer — container has it before any plugin mounts', () => {
		const player = new NMVideoPlayer('test').setup({});
		expect(player.container.classList.contains('nomercyplayer')).toBe(true);
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

	it('desktop-ui plugin does not add nomercyplayer — only setup() owns it', async () => {
		const player = new NMVideoPlayer('test').setup({});

		// setup() applied the class; strip it to prove the plugin cannot re-add it.
		player.container.classList.remove('nomercyplayer');
		expect(player.container.classList.contains('nomercyplayer')).toBe(false);

		await player.addPlugin(desktopUiPlugin).ready();

		// Class must remain absent — the plugin must not touch it.
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
		document.body.innerHTML = '<div id="test2"></div>';
		const player = new NMVideoPlayer('test2').setup({ theaterDefault: true } as never);
		await player.addPlugin(desktopUiPlugin).ready();

		expect(player.container.classList.contains('theater')).toBe(true);
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// Regression: desktop-ui must NOT write .buffering on the container either.
//
// Same rule as theater above, and `buffering` was named in that list from the
// start — but wireFeedback kept adding it for its own load feedback. Two owners
// on one class, taking turns: the initial `message.loading` raised the spinner,
// core's phase→paused swap wiped it ~250ms later, the `item` handler put it
// back, and core's `canplay` rule took it away again. Measured on the testbed:
// class went active → buffering → paused → paused buffering → paused, in 700ms.
//
// Fix: the plugin's own load feedback rides `busy` on its own .center wrapper.
// Core stays the only writer of the container's state classes.
// ──────────────────────────────────────────────────────────────────────────────

describe('DesktopUiPlugin — buffering container class ownership (core-only)', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('mounting the plugin does not put .buffering on the container', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		expect(player.container.classList.contains('buffering')).toBe(false);
	});

	it('the plugin shows its own load spinner while the container stays clean', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const center = player.container.querySelector('.center')!;
		expect(center.classList.contains('busy')).toBe(true);
		expect(player.container.classList.contains('buffering')).toBe(false);
	});

	it('core still owns .buffering on waiting, and a time update clears it', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		player.emit('waiting', {} as never);
		expect(player.container.classList.contains('buffering')).toBe(true);

		player.emit('time', { time: 5 } as never);
		expect(player.container.classList.contains('buffering')).toBe(false);
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
