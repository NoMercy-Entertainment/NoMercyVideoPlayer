// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Regression: shortcuts overlay must be computed-visible after showShortcuts()
 * and computed-hidden after hideShortcuts().
 *
 * Visibility is controlled via the CSS class `keybinds-dialog-visible` on the
 * overlay element. The CSS defines `display:none` by default and `display:flex`
 * when the class is present. Tests verify the class-based toggle mechanism and
 * that the event path wiring is intact.
 *
 * This suite asserts:
 *   1. After `plugin:desktop-ui:shortcuts-toggle` fires, the overlay carries
 *      the `keybinds-dialog-visible` class.
 *   2. After a second toggle, the class is removed.
 *   3. The help key binding in KeyHandlerPlugin is registered as 'shift+?'
 *      (the canonical form the browser actually sends), not as bare '?'.
 *      The key handler reaches the overlay via a direct
 *      `getPlugin(DesktopUiPlugin)?.toggleShortcuts()` call; the event above
 *      remains supported for external emitters.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DesktopUiPlugin, desktopUiPlugin } from '../../plugins/desktop-ui';
import { KeyHandlerPlugin, keyHandlerPlugin } from '../../plugins/key-handler';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

describe('DesktopUiPlugin — shortcuts overlay visibility', () => {
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

	it('overlay gains keybinds-dialog-visible class after shortcuts-toggle fires', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const overlay = document.querySelector<HTMLDivElement>('#nmplayer-keybinds-dialog');
		expect(overlay, 'overlay must be in DOM before toggle').not.toBeNull();

		expect(
			overlay!.classList.contains('keybinds-dialog-visible'),
			'overlay must not have visible class before toggle',
		).toBe(false);

		player.emit('plugin:desktop-ui:shortcuts-toggle', undefined);

		expect(
			overlay!.classList.contains('keybinds-dialog-visible'),
			'overlay must carry keybinds-dialog-visible class after toggle-open',
		).toBe(true);
	});

	it('keybinds-dialog-visible class is removed after a second toggle (hide path)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const overlay = document.querySelector<HTMLDivElement>('#nmplayer-keybinds-dialog');
		expect(overlay).not.toBeNull();

		player.emit('plugin:desktop-ui:shortcuts-toggle', undefined);
		expect(overlay!.classList.contains('keybinds-dialog-visible')).toBe(true);

		player.emit('plugin:desktop-ui:shortcuts-toggle', undefined);
		expect(
			overlay!.classList.contains('keybinds-dialog-visible'),
			'overlay must not have visible class after second toggle',
		).toBe(false);
	});

	it('overlay is removed from DOM when removePlugin disposes the desktop-ui', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();

		const overlay = document.querySelector<HTMLDivElement>('#nmplayer-keybinds-dialog');
		expect(overlay).not.toBeNull();

		player.emit('plugin:desktop-ui:shortcuts-toggle', undefined);
		expect(overlay!.classList.contains('keybinds-dialog-visible')).toBe(true);

		player.removePlugin(DesktopUiPlugin);

		const orphan = document.querySelector('#nmplayer-keybinds-dialog');
		expect(orphan, 'overlay must be removed from DOM after plugin removal').toBeNull();
	});
});

describe('KeyHandlerPlugin — ? keybind uses shift+? canonical form', () => {
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

	it('pressing ? (key="?", shiftKey=true) opens the shortcuts overlay', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin).ready();
		await player.addPlugin(keyHandlerPlugin).ready();

		const overlay = document.querySelector<HTMLDivElement>('#nmplayer-keybinds-dialog');
		expect(overlay).not.toBeNull();

		// Simulate exactly what the browser sends: key='?' with shiftKey=true.
		// The old bind('?') registration missed this because the canonicalizer
		// stored '?' but the event arrived as 'shift+?' (shift is required to
		// produce the ? character on standard keyboards).
		const keyEvent = new KeyboardEvent('keydown', {
			key: '?',
			shiftKey: true,
			bubbles: true,
		});
		document.dispatchEvent(keyEvent);

		expect(
			overlay!.classList.contains('keybinds-dialog-visible'),
			'pressing ? (shiftKey=true) must open the shortcuts overlay — bind("shift+?") fix verification',
		).toBe(true);
	});

	it('bindings() snapshot includes shift+? (not bare ?)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(keyHandlerPlugin).ready();

		const kh = player.getPlugin(KeyHandlerPlugin);
		expect(kh, 'KeyHandlerPlugin must be accessible via getPlugin').toBeDefined();

		const bindings = kh!.bindings();

		expect(
			bindings.has('shift+?'),
			'bindings map must contain "shift+?" — bare "?" is the wrong canonical form',
		).toBe(true);

		expect(
			bindings.has('?'),
			'bindings map must NOT contain bare "?" — it would never match a real keydown event',
		).toBe(false);
	});
});
