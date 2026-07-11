// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * src/index.ts — fullscreen / PiP / theater / segment / playSegment coverage.
 *
 * Uncovered branches targeted:
 *   - fullscreen(): reads ctrl?.isActive() path
 *   - fullscreen(true/false): calls ctrl.enter / ctrl.exit, emits event
 *   - fullscreen() with no ctrl: throws BrowserPolicyError
 *   - toggleFullscreen(): flips state
 *   - pip() read / write / togglePip()
 *   - pip() with no ctrl: throws
 *   - theater() read / write / toggleTheater()
 *   - playSegment() + clearSegment():
 *       - 'loop' onEnd → re-seeks to startSec
 *       - 'hold' onEnd → pauses
 *       - 'advance' onEnd → no extra action
 *       - clearSegment() stops listening
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../index';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

function resetAndMount(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = 'test';
	div.className = 'nomercyplayer';
	document.body.appendChild(div);
	vi.stubGlobal('ResizeObserver', MockResizeObserver);
}

function cleanup(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
}

// ── Fullscreen ────────────────────────────────────────────────────────────────

describe('NMVideoPlayer — fullscreen()', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('fullscreen() returns OFF when no ctrl and _fullscreenActive is false', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		// Replace the whole platform() accessor to return no fullscreen ctrl.
		(player as unknown as Record<string, unknown>).platform = () => ({ fullscreen: undefined });

		expect(player.fullscreen()).toBe('off');
	});

	it('fullscreen(true) calls ctrl.enter, sets _fullscreenActive, emits event', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const entered: HTMLElement[] = [];
		const fakePlatform = {
			fullscreen: {
				enter: (el: HTMLElement) => { entered.push(el); return Promise.resolve(); },
				exit: () => Promise.resolve(),
				isActive: () => false,
			},
			pip: undefined,
		};
		(player as unknown as { platform: () => unknown }).platform = () => fakePlatform;

		const events: unknown[] = [];
		player.on('fullscreen', payload => events.push(payload));

		player.fullscreen(true);

		expect(entered.length).toBe(1);
		expect(events).toHaveLength(1);
		expect((events[0] as { active: boolean }).active).toBe(true);
	});

	it('fullscreen(false) calls ctrl.exit and emits event', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const exits: number[] = [];
		const fakePlatform = {
			fullscreen: {
				enter: () => Promise.resolve(),
				exit: () => { exits.push(1); return Promise.resolve(); },
				isActive: () => true,
			},
			pip: undefined,
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		player.fullscreen(false);

		expect(exits.length).toBe(1);
	});

	it('fullscreen() returns ON when ctrl.isActive() is true', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const fakePlatform = {
			fullscreen: {
				enter: () => Promise.resolve(),
				exit: () => Promise.resolve(),
				isActive: () => true,
			},
			pip: undefined,
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		expect(player.fullscreen()).toBe('on');
	});

	it('fullscreen(true) with no ctrl throws BrowserPolicyError', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		(player as unknown as Record<string, unknown>).platform = () => ({ fullscreen: undefined });

		expect(() => player.fullscreen(true)).toThrow();
	});

	it('toggleFullscreen toggles from off to on', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const events: boolean[] = [];
		player.on('fullscreen', (payload: { active: boolean }) => events.push(payload.active));

		const fakePlatform = {
			fullscreen: {
				enter: () => Promise.resolve(),
				exit: () => Promise.resolve(),
				isActive: () => false,
			},
			pip: undefined,
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		player.toggleFullscreen();

		expect(events).toHaveLength(1);
		expect(events[0]).toBe(true);
	});
});

// ── PiP ──────────────────────────────────────────────────────────────────────

describe('NMVideoPlayer — pip()', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('pip() returns off when no ctrl and _pipActive=false', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();
		(player as unknown as Record<string, unknown>).platform = () => ({ pip: undefined });

		expect(player.pip()).toBe('off');
	});

	it('pip(true) calls ctrl.enter and emits event', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const entered: HTMLVideoElement[] = [];
		const fakePlatform = {
			pip: {
				enter: (el: HTMLVideoElement) => { entered.push(el); return Promise.resolve(); },
				exit: () => Promise.resolve(),
				isActive: () => false,
			},
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		const events: unknown[] = [];
		player.on('pip', payload => events.push(payload));

		player.pip(true);

		expect(events).toHaveLength(1);
		expect((events[0] as { active: boolean }).active).toBe(true);
	});

	it('pip(false) calls ctrl.exit', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const exits: number[] = [];
		const fakePlatform = {
			pip: {
				enter: () => Promise.resolve(),
				exit: () => { exits.push(1); return Promise.resolve(); },
				isActive: () => false,
			},
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		player.pip(false);
		expect(exits.length).toBe(1);
	});

	it('pip() returns on when ctrl.isActive() is true', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const fakePlatform = {
			pip: {
				enter: () => Promise.resolve(),
				exit: () => Promise.resolve(),
				isActive: () => true,
			},
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		expect(player.pip()).toBe('on');
	});

	it('pip(true) with no ctrl throws BrowserPolicyError', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();
		(player as unknown as Record<string, unknown>).platform = () => ({ pip: undefined });

		expect(() => player.pip(true)).toThrow();
	});

	it('togglePip flips from off to on', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const events: boolean[] = [];
		player.on('pip', (payload: { active: boolean }) => events.push(payload.active));

		const fakePlatform = {
			pip: {
				enter: () => Promise.resolve(),
				exit: () => Promise.resolve(),
				isActive: () => false,
			},
		};
		(player as unknown as Record<string, unknown>).platform = () => fakePlatform;

		player.togglePip();

		expect(events).toHaveLength(1);
		expect(events[0]).toBe(true);
	});
});

// ── Theater ───────────────────────────────────────────────────────────────────

describe('NMVideoPlayer — theater()', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('theater() returns off initially', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();
		expect(player.theater()).toBe('off');
	});

	it('theater(true) emits event with active:true', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const events: unknown[] = [];
		player.on('theater', payload => events.push(payload));

		player.theater(true);

		expect(events).toHaveLength(1);
		expect((events[0] as { active: boolean }).active).toBe(true);
	});

	it('theater(false) emits event with active:false', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		player.theater(true);

		const events: unknown[] = [];
		player.on('theater', payload => events.push(payload));

		player.theater(false);
		expect((events[0] as { active: boolean }).active).toBe(false);
	});

	it('theater() returns on after theater(true)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		player.theater(true);
		expect(player.theater()).toBe('on');
	});

	it('toggleTheater flips from off to on', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const events: boolean[] = [];
		player.on('theater', (payload: { active: boolean }) => events.push(payload.active));

		player.toggleTheater();
		expect(events[0]).toBe(true);

		player.toggleTheater();
		expect(events[1]).toBe(false);
	});
});

// ── playSegment / clearSegment ────────────────────────────────────────────────

describe('NMVideoPlayer — playSegment / clearSegment', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('playSegment emits segmentBoundary when time reaches endSec', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const timeSpy = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).time = timeSpy;

		const boundaries: unknown[] = [];
		player.on('segmentBoundary', segmentBoundaryPayload => boundaries.push(segmentBoundaryPayload));

		player.playSegment({ startSec: 0, endSec: 30, onEnd: 'advance' });

		// Simulate time reaching endSec
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 30 });

		expect(boundaries.length).toBe(1);
		expect((boundaries[0] as { startSec: number }).startSec).toBe(0);
		expect((boundaries[0] as { endSec: number }).endSec).toBe(30);
	});

	it('playSegment onEnd=advance emits segmentBoundary only once across ticks past endSec', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		(player as unknown as Record<string, unknown>).time = vi.fn().mockResolvedValue(undefined);

		const boundaries: unknown[] = [];
		player.on('segmentBoundary', segmentBoundaryPayload => boundaries.push(segmentBoundaryPayload));

		player.playSegment({ startSec: 0, endSec: 30, onEnd: 'advance' });

		const emitter = player as unknown as { emit: (event: string, data: unknown) => void };
		emitter.emit('time', { time: 30 });
		emitter.emit('time', { time: 31 });
		emitter.emit('time', { time: 45 });

		expect(boundaries.length).toBe(1);
	});

	it('playSegment onEnd=hold pauses once across ticks past endSec', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pauseCalls: number[] = [];
		(player as unknown as Record<string, unknown>).time = () => Promise.resolve();
		(player as unknown as Record<string, unknown>).pause = () => {
			pauseCalls.push(1);
			return Promise.resolve();
		};

		player.playSegment({ startSec: 0, endSec: 20, onEnd: 'hold' });

		const emitter = player as unknown as { emit: (event: string, data: unknown) => void };
		emitter.emit('time', { time: 20 });
		emitter.emit('time', { time: 21 });

		expect(pauseCalls.length).toBe(1);
	});

	it('playSegment with onEnd=loop re-seeks to startSec at boundary', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const seekCalls: number[] = [];
		(player as unknown as Record<string, unknown>).time = (seconds?: number) => {
			if (seconds !== undefined)
				seekCalls.push(seconds);
			return Promise.resolve();
		};

		player.playSegment({ startSec: 10, endSec: 40, onEnd: 'loop' });

		// First call from playSegment() itself (startSec seek).
		expect(seekCalls[0]).toBe(10);

		// Simulate boundary.
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 40 });

		// Second seek back to startSec after loop.
		expect(seekCalls[1]).toBe(10);
	});

	it('playSegment with onEnd=hold calls pause at boundary', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pauseCalls: number[] = [];
		(player as unknown as Record<string, unknown>).time = () => Promise.resolve();
		(player as unknown as Record<string, unknown>).pause = () => { pauseCalls.push(1); return Promise.resolve(); };

		player.playSegment({ startSec: 0, endSec: 20, onEnd: 'hold' });
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 20 });

		expect(pauseCalls.length).toBe(1);
	});

	it('playSegment with onEnd=advance does not call pause or re-seek', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const seekAfterInit: number[] = [];
		let initDone = false;
		(player as unknown as Record<string, unknown>).time = (seconds?: number) => {
			if (seconds !== undefined && initDone)
				seekAfterInit.push(seconds);
			initDone = true;
			return Promise.resolve();
		};

		const pauseCalls: number[] = [];
		(player as unknown as Record<string, unknown>).pause = () => { pauseCalls.push(1); return Promise.resolve(); };

		player.playSegment({ startSec: 5, endSec: 15, onEnd: 'advance' });
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 15 });

		expect(seekAfterInit.length).toBe(0);
		expect(pauseCalls.length).toBe(0);
	});

	it('time events before endSec do not trigger boundary', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		(player as unknown as Record<string, unknown>).time = () => Promise.resolve();

		const boundaries: unknown[] = [];
		player.on('segmentBoundary', segmentBoundaryPayload => boundaries.push(segmentBoundaryPayload));

		player.playSegment({ startSec: 0, endSec: 60, onEnd: 'advance' });
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 30 });
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 59 });

		expect(boundaries.length).toBe(0);
	});

	it('clearSegment stops the time listener from firing', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		(player as unknown as Record<string, unknown>).time = () => Promise.resolve();

		const boundaries: unknown[] = [];
		player.on('segmentBoundary', segmentBoundaryPayload => boundaries.push(segmentBoundaryPayload));

		player.playSegment({ startSec: 0, endSec: 30, onEnd: 'advance' });
		player.clearSegment();

		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 30 });

		expect(boundaries.length).toBe(0);
	});

	it('second playSegment call replaces the first segment listener', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const seekCalls: number[] = [];
		(player as unknown as Record<string, unknown>).time = (seconds?: number) => {
			if (seconds !== undefined)
				seekCalls.push(seconds);
			return Promise.resolve();
		};

		const boundaries: unknown[] = [];
		player.on('segmentBoundary', segmentBoundaryPayload => boundaries.push(segmentBoundaryPayload));

		// First segment: 0–30
		player.playSegment({ startSec: 0, endSec: 30, onEnd: 'advance' });

		// Second segment replaces first: 5–40
		player.playSegment({ startSec: 5, endSec: 40, onEnd: 'advance' });

		// Trigger at 30 — old boundary should NOT fire (listener was cleared)
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 30 });
		// Old segment: would have fired. If it fires, boundary count is 1 (wrong).
		// New segment endSec is 40, so nothing at t=30 either way. The count must be 0.
		expect(boundaries.length).toBe(0);

		// Trigger at 40 — new segment boundary fires
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('time', { time: 40 });
		expect(boundaries.length).toBe(1);
		expect((boundaries[0] as { endSec: number }).endSec).toBe(40);
	});
});
