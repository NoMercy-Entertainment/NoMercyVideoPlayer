// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * TvKeyHandlerPlugin unit tests.
 *
 * Pins:
 *  - Plugin registers cleanly; getPlugin returns the instance.
 *  - ArrowLeft → rewind(), ArrowRight → forward() — unconditional, no isTv() gate.
 *    This confirms the documented desktop-gate bypass (JSDoc lines 17-19).
 *  - MediaRecord key emits 'plugin:tv-key-handler:bookmark' with {time}.
 *
 * The base KeyHandlerPlugin attaches the keydown listener to `document` by
 * default (scope defaults to document when no container-scope option is given).
 * Tests dispatch KeyboardEvent on `document` with `bubbles: true`.
 *
 * The cooldown (default 300ms) is bypassed via `cooldownMs: 0` option so
 * consecutive key dispatches in the same test fire without a timer delay.
 *
 * Desktop-gate bypass (GREEN finding): TvKeyHandlerPlugin.addNavigationKeys()
 * overrides the base implementation — the base VideoKeyHandler gates ArrowLeft/
 * ArrowRight on `!isTv()`, but TvKeyHandlerPlugin replaces that body with an
 * unconditional rewind/forward call. In jsdom `isTv()` returns false, so the
 * base handler would block the arrows; the TV override fires them regardless.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { TvKeyHandlerPlugin, tvKeyHandlerPlugin } from '../../plugins/tv-key-handler';

describe('TvKeyHandlerPlugin', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	const setup = (): NMVideoPlayer<any> => new NMVideoPlayer('test').setup({});

	// ── Test 5: registration ──────────────────────────────────────────────────

	it('registers without throwing; getPlugin returns the instance', async () => {
		const player = setup();
		expect(() => player.addPlugin(tvKeyHandlerPlugin)).not.toThrow();
		await player.ready();
		expect(player.getPlugin(TvKeyHandlerPlugin)).toBeInstanceOf(TvKeyHandlerPlugin);
	});

	// ── Test 6: ArrowLeft → rewind(), ArrowRight → forward() ─────────────────
	// Confirms the desktop-gate bypass: the TV override does NOT guard on isTv().

	it('ArrowLeft calls rewind() and ArrowRight calls forward() (desktop-gate bypassed)', async () => {
		const player = setup();
		player.addPlugin(tvKeyHandlerPlugin, { arrowSeekSeconds: 5, cooldownMs: 0 } as any);
		await player.ready();

		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		const forwardSpy = vi.fn().mockResolvedValue(undefined);
		(player as any).rewind = rewindSpy;
		(player as any).forward = forwardSpy;

		// jsdom isTv() returns false — the base class would block arrows here.
		// The TV plugin overrides addNavigationKeys() without the isTv() guard,
		// so both calls must fire unconditionally.
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		expect(rewindSpy).toHaveBeenCalledTimes(1);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		expect(forwardSpy).toHaveBeenCalledTimes(1);
	});

	// ── Test 7: MediaRecord key emits plugin:tv-key-handler:bookmark ─────────

	it('MediaRecord key emits plugin:tv-key-handler:bookmark with {time}', async () => {
		const player = setup();
		player.addPlugin(tvKeyHandlerPlugin, { cooldownMs: 0 } as any);
		await player.ready();

		const timeSpy = vi.fn().mockReturnValue(42);
		(player as any).time = timeSpy;

		const received: unknown[] = [];
		player.on('plugin:tv-key-handler:bookmark' as never, ((data: unknown) => {
			received.push(data);
		}) as never);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'MediaRecord', bubbles: true }));

		// The emit is synchronous inside the binding callback.
		expect(received).toHaveLength(1);
		expect((received[0] as { time: number }).time).toBe(42);
	});
});
