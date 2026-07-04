// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Extended KeyHandlerPlugin (video) tests.
 *
 * The existing video-plugins.test.ts covers the full binding set via
 * `bindings().has(key)`. This file adds consequence tests for the
 * previously-uncovered branches (68% → target ~85%+):
 *
 *   - Space → togglePlayback()
 *   - ArrowLeft/ArrowRight gated on !isTv() (no call when isTv=true)
 *   - ArrowLeft/ArrowRight fire rewind/forward when isTv=false
 *   - 'm' → toggleMute()
 *   - 'v' → cycleSubtitles()
 *   - 'b' → cycleAudioTracks()
 *   - 'n' → next(), 'p' → previous()
 *   - 'f' → toggleFullscreen()
 *   - 'Escape' exits fullscreen when fullscreen is 'on'
 *   - 'Escape' does nothing when fullscreen is off
 *   - ']' steps speed up, '[' steps speed down, '=' resets to 1x
 *   - 'e' advances frame when paused, no-ops when playing
 *   - 't' emits display-message with current time / remaining
 *   - '+' emits subtitle-size-up, '-' emits subtitle-size-down
 *   - 'a' → cycleAspectRatio()
 *   - 'shift+?' toggles the mounted DesktopUiPlugin's shortcuts overlay
 *   - 's' → stop()
 *   - Modifier seeks: shift+ArrowLeft, alt+ArrowRight, ctrl+ArrowLeft
 *   - Color buttons: ColorF0Red → forward(30), ColorF3Blue → forward(120)
 *   - MediaRecord does nothing (key-handler, not tv-handler)
 *   - message() emits display-message event
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DesktopUiPlugin } from '../../plugins/desktop-ui';
import { KeyHandlerPlugin } from '../../plugins/key-handler';

// These tests subscribe to UI/plugin event names that fall outside the player's
// typed event overloads, so they reach the event bus through this minimal
// callable surface instead of an `unknown`-valued index signature.
interface EventBusLike {
	on: (event: string, fn: (data: unknown) => void) => void;
}

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

describe('KeyHandlerPlugin (video) — consequence tests', () => {
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
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	function makePlayer(overrides: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as any);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string, opts: KeyboardEventInit = {}): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
	}

	// ── Playback ──────────────────────────────────────────────────────────────

	it('Space → togglePlayback()', async () => {
		const toggleSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ togglePlayback: toggleSpy }));
		key(' ');
		expect(toggleSpy).toHaveBeenCalledTimes(1);
	});

	it('s → stop()', async () => {
		const stopSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ stop: stopSpy }));
		key('s');
		expect(stopSpy).toHaveBeenCalledTimes(1);
	});

	// ── Navigation (desktop gate) ─────────────────────────────────────────────

	it('ArrowLeft calls rewind() when isTv() returns false', async () => {
		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ rewind: rewindSpy, isTv: () => false }));
		key('ArrowLeft');
		expect(rewindSpy).toHaveBeenCalledTimes(1);
	});

	it('ArrowLeft does NOT call rewind() when isTv() returns true', async () => {
		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ rewind: rewindSpy, isTv: () => true }));
		key('ArrowLeft');
		expect(rewindSpy).not.toHaveBeenCalled();
	});

	it('ArrowRight calls forward() when isTv() returns false', async () => {
		const forwardSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: forwardSpy, isTv: () => false }));
		key('ArrowRight');
		expect(forwardSpy).toHaveBeenCalledTimes(1);
	});

	// ── Volume ────────────────────────────────────────────────────────────────

	it('m → toggleMute()', async () => {
		const muteSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ toggleMute: muteSpy, isTv: () => false, isMobile: () => false }));
		key('m');
		expect(muteSpy).toHaveBeenCalledTimes(1);
	});

	it('ArrowUp calls volumeUp() when not TV and not mobile', async () => {
		const upSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ volumeUp: upSpy, isTv: () => false, isMobile: () => false }));
		key('ArrowUp');
		expect(upSpy).toHaveBeenCalledTimes(1);
	});

	it('ArrowDown calls volumeDown() when not TV and not mobile', async () => {
		const downSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ volumeDown: downSpy, isTv: () => false, isMobile: () => false }));
		key('ArrowDown');
		expect(downSpy).toHaveBeenCalledTimes(1);
	});

	// ── Track cycling ─────────────────────────────────────────────────────────

	it('v → cycleSubtitles()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleSubtitles: spy }));
		key('v');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('b → cycleAudioTracks()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleAudioTracks: spy }));
		key('b');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	// ── Next / Previous ───────────────────────────────────────────────────────

	it('n → next()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ next: spy }));
		key('n');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('p → previous()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ previous: spy }));
		key('p');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	// ── Fullscreen ────────────────────────────────────────────────────────────

	it('f → toggleFullscreen()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ toggleFullscreen: spy }));
		key('f');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('Escape calls fullscreen(false) when fullscreen is "on"', async () => {
		const spy = vi.fn();
		await ready(makePlayer({ fullscreen: (arg?: unknown) => {
			if (arg !== undefined)
				spy(arg); return 'on';
		} }));
		key('Escape');
		expect(spy).toHaveBeenCalledWith(false);
	});

	it('Escape does nothing when fullscreen is off', async () => {
		const spy = vi.fn();
		await ready(makePlayer({ fullscreen: (arg?: unknown) => {
			if (arg !== undefined)
				spy(arg); return 'off';
		} }));
		key('Escape');
		expect(spy).not.toHaveBeenCalled();
	});

	// ── Speed ─────────────────────────────────────────────────────────────────

	it('] steps up to the next rate', async () => {
		let currentRate = 1;
		const rates = [0.5, 1, 1.5, 2];
		await ready(makePlayer({
			playbackRates: () => rates,
			playbackRate: (rate?: number) => {
				if (rate !== undefined)
					currentRate = rate; return currentRate;
			},
		}));
		key(']');
		expect(currentRate).toBe(1.5);
	});

	it('[ steps down to the previous rate', async () => {
		let currentRate = 1.5;
		const rates = [0.5, 1, 1.5, 2];
		await ready(makePlayer({
			playbackRates: () => rates,
			playbackRate: (rate?: number) => {
				if (rate !== undefined)
					currentRate = rate; return currentRate;
			},
		}));
		key('[');
		expect(currentRate).toBe(1);
	});

	it('= resets rate to 1', async () => {
		let currentRate = 2;
		await ready(makePlayer({
			playbackRates: () => [0.5, 1, 1.5, 2],
			playbackRate: (rate?: number) => {
				if (rate !== undefined)
					currentRate = rate; return currentRate;
			},
		}));
		key('=');
		expect(currentRate).toBe(1);
	});

	// ── Frame advance ─────────────────────────────────────────────────────────

	it('e advances time by ~1/30s when paused', async () => {
		let currentTime = 10;
		await ready(makePlayer({
			playState: () => 'paused',
			time: (seconds?: number) => {
				if (seconds !== undefined)
					currentTime = seconds; return currentTime;
			},
		}));
		key('e');
		expect(currentTime).toBeCloseTo(10 + 1 / 30, 5);
	});

	it('e does not advance time when playing', async () => {
		let currentTime = 10;
		await ready(makePlayer({
			playState: () => 'playing',
			time: (seconds?: number) => {
				if (seconds !== undefined)
					currentTime = seconds; return currentTime;
			},
		}));
		key('e');
		expect(currentTime).toBe(10);
	});

	// ── Show time ─────────────────────────────────────────────────────────────

	it('t emits display-message with current/remaining time', async () => {
		const messages: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 65,
			duration: () => 130,
		}));
		(player as unknown as EventBusLike).on('display-message', (data: unknown) => messages.push(data));
		key('t');
		expect(messages.length).toBeGreaterThan(0);
		const msg = (messages[0] as { text: string }).text;
		expect(msg).toMatch(/1:05/);
	});

	// ── Subtitle size ─────────────────────────────────────────────────────────

	it('+ emits subtitle-size-up', async () => {
		const events: unknown[] = [];
		const player = await ready(makePlayer({}));
		(player as unknown as EventBusLike).on('subtitle-size-up', () => events.push('up'));
		key('+');
		expect(events).toContain('up');
	});

	it('- emits subtitle-size-down', async () => {
		const events: unknown[] = [];
		const player = await ready(makePlayer({}));
		(player as unknown as EventBusLike).on('subtitle-size-down', () => events.push('down'));
		key('-');
		expect(events).toContain('down');
	});

	// ── Aspect ratio ─────────────────────────────────────────────────────────

	it('a → cycleAspectRatio()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleAspectRatio: spy }));
		key('a');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	// ── Modifier seeks ────────────────────────────────────────────────────────

	it('shift+ArrowLeft seeks back 3s', async () => {
		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ rewind: rewindSpy }));
		key('ArrowLeft', { shiftKey: true });
		expect(rewindSpy).toHaveBeenCalledWith(3);
	});

	it('alt+ArrowRight seeks forward 10s', async () => {
		const forwardSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: forwardSpy }));
		key('ArrowRight', { altKey: true });
		expect(forwardSpy).toHaveBeenCalledWith(10);
	});

	it('ctrl+ArrowLeft seeks back 60s', async () => {
		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ rewind: rewindSpy }));
		key('ArrowLeft', { ctrlKey: true });
		expect(rewindSpy).toHaveBeenCalledWith(60);
	});

	// ── Color buttons ─────────────────────────────────────────────────────────

	it('ColorF0Red → forward(30)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('ColorF0Red');
		expect(spy).toHaveBeenCalledWith(30);
	});

	it('ColorF3Blue → forward(120)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('ColorF3Blue');
		expect(spy).toHaveBeenCalledWith(120);
	});

	// ── Help key ─────────────────────────────────────────────────────────────

	it('shift+? toggles the mounted DesktopUiPlugin\'s shortcuts overlay directly (no event forge)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(DesktopUiPlugin).ready();
		await player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as any).ready();

		const overlay = document.querySelector<HTMLDivElement>('#nmplayer-keybinds-dialog');
		expect(overlay).not.toBeNull();

		key('?', { shiftKey: true });

		expect(overlay!.classList.contains('keybinds-dialog-visible')).toBe(true);
	});

	it('shift+? is a no-op when DesktopUiPlugin is not mounted', async () => {
		await ready(makePlayer({}));
		expect(() => key('?', { shiftKey: true })).not.toThrow();
	});

	// ── Quick-skip ────────────────────────────────────────────────────────────

	it('3 → forward(30)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('3');
		expect(spy).toHaveBeenCalledWith(30);
	});

	it('9 → forward(90)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('9');
		expect(spy).toHaveBeenCalledWith(90);
	});
});
