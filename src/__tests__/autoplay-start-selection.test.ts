// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Regression: autoPlay start selection vs the queue's default cursor, and
 * setup priming independent of autoPlay.
 *
 * MediaList parks its cursor on item 0 the moment items exist, so
 * `player.item()` is NEVER undefined once a playlist is set. The autoPlay
 * wrapper treated that default as a consumer preselection and skipped
 * `pickStartItem` entirely — every session "resumed" at item 0, position 0.
 * Only an explicit `item(target)` navigation (which bumps `_currentEpoch`)
 * counts as a preselection.
 *
 * Separately: setup() must prime (load) the start-selected item even when
 * `autoPlay: false` — the load was previously gated entirely behind
 * `autoPlay`, so a consumer opting out of autoplay got a player that never
 * loaded anything until a manual `item(target)` call.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nmplayer } from '../index';

vi.mock('hls.js', () => ({
	default: class {
		static isSupported = (): boolean => true;
		static Events: Record<string, string> = {};
		static ErrorTypes: Record<string, string> = {};
		on(): void { /* stub */ }
	},
}));

async function flush(iterations = 10): Promise<void> {
	for (let i = 0; i < iterations; i++) {
		await new Promise<void>(resolve => setTimeout(resolve, 0));
	}
}

function makeContainer(id: string): void {
	const div = document.createElement('div');
	div.id = id;
	document.body.appendChild(div);
}

const PLAYLIST = [
	{ id: 101, url: 'https://server.test/e1.m3u8', progress: { percentage: 92, time: 1262, timestamp: 1000 } },
	{ id: 202, url: 'https://server.test/e2.m3u8', progress: { percentage: 7, time: 95, timestamp: 3000 } },
	{ id: 303, url: 'https://server.test/e3.m3u8' },
];

function setupPlayer(containerId: string, autoPlay = true): ReturnType<typeof nmplayer> & { load: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn> } {
	makeContainer(containerId);
	const player = nmplayer(containerId).setup({
		controls: false,
		autoPlay,
		playlist: PLAYLIST,
		baseUrl: 'https://server.test',
		auth: { bearerToken: () => 'token' },
	} as never);
	// Shadow load()/play() so no real backend/network is exercised — the
	// assertions target WHICH item the start selection picks, the startAt it
	// carries, and whether the setup continuation calls play() at all.
	const loadSpy = vi.fn(async () => {});
	const playSpy = vi.fn(async () => {});
	(player as unknown as { load: typeof loadSpy }).load = loadSpy;
	(player as unknown as { play: typeof playSpy }).play = playSpy;
	return player as ReturnType<typeof nmplayer> & { load: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn> };
}

describe('autoPlay start selection', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('runs pickStartItem despite the default cursor sitting on item 0', async () => {
		const player = setupPlayer('asel-resume');
		await player.ready();
		await flush();

		// Most recent progress (<90%) is item 202 — resume there at 95s.
		expect(player.load).toHaveBeenCalled();
		const [item, opts] = player.load.mock.calls.at(-1)!;
		expect(item.id).toBe(202);
		expect(opts.startAt).toBe(95);
	});

	it('an explicit pre-ready item() navigation wins over progress', async () => {
		const player = setupPlayer('asel-preselect');
		// Index navigation — an explicit choice of the FIRST item, which the
		// progress data would otherwise skip (92% watched → roll-over).
		player.item(0);
		await player.ready();
		await flush();

		const [item, opts] = player.load.mock.calls.at(-1)!;
		expect(item.id).toBe(101);
		expect(opts?.startAt).toBeUndefined();
	});

	it('primes the progress-selected item on setup even with autoPlay: false, and never plays', async () => {
		const player = setupPlayer('asel-no-autoplay', false);
		await player.ready();
		await flush();

		// The load still happens — priming is unconditional — but the setup
		// continuation must never call play() when autoPlay is off.
		expect(player.load).toHaveBeenCalled();
		const [item, opts] = player.load.mock.calls.at(-1)!;
		expect(item.id).toBe(202);
		expect(opts.startAt).toBe(95);

		expect(player.play).not.toHaveBeenCalled();
	});
});
