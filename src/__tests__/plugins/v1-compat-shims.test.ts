// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * V1VideoCompatPlugin — shim consequence tests (uncovered gaps).
 *
 * Covers what v1-compat.test.ts + v1-compat-deep.test.ts do NOT test:
 *
 *  speeds():
 *   - The v2 player has no `speeds` method. The shim patches it.
 *   - Delegates to player.playbackRates() and returns the array.
 *   - hasSpeeds(): returns true when length > 1, false otherwise.
 *
 *  playlistItem() getter/setter:
 *   - The v2 player has no `playlistItem` method. The shim patches it.
 *   - Getter returns player.item().
 *   - Setter calls player.seekToIndex(Number(index) + 1) (v1=0-based → v2=1-based).
 *
 * NOT tested here:
 *  - seekByPercentage: exists on v2 — _patchMethod skips it (typeof check).
 *  - load: exists on v2 — _patchMethod skips it.
 *  - Deprecation warnings: _warnedSet is module-level; already covered by
 *    v1-compat-deep.test.ts. Asserting warn here is order-dependent.
 *
 * Spy overrides are installed BEFORE addPlugin so the shim closure captures
 * the spy rather than the original prototype method.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { V1VideoCompatPlugin } from '../../plugins/v1-compat';

type Compat = Record<string, (...args: unknown[]) => unknown>;

beforeEach(() => {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = 'v1-shim-test';
	document.body.appendChild(div);
	vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

// ── speeds() ─────────────────────────────────────────────────────────────────

describe('v1-compat shim: speeds()', () => {
	it('returns the playbackRates() array', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});
		const rates = [0.5, 1, 1.5, 2];

		Object.assign(player, { playbackRates: () => rates });

		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		const result = compat.speeds!();

		expect(result).toEqual(rates);
	});
});

// ── hasSpeeds() ──────────────────────────────────────────────────────────────

describe('v1-compat shim: hasSpeeds()', () => {
	it('returns true when more than one rate exists', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});
		Object.assign(player, { playbackRates: () => [0.5, 1, 1.5, 2] });
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.hasSpeeds!()).toBe(true);
	});

	it('returns false when only one rate exists', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});
		Object.assign(player, { playbackRates: () => [1] });
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.hasSpeeds!()).toBe(false);
	});

	it('returns false when rates array is empty', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});
		Object.assign(player, { playbackRates: () => [] });
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.hasSpeeds!()).toBe(false);
	});
});

// ── playlistItem() getter/setter ─────────────────────────────────────────────

describe('v1-compat shim: playlistItem()', () => {
	it('getter returns player.item() when called with no argument', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});

		const fakeItem = { id: '1', url: 'test.mp4', title: 'Test' };
		Object.assign(player, { item: () => fakeItem });

		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		const result = compat.playlistItem!();

		expect(result).toBe(fakeItem);
	});

	it('setter calls player.seekToIndex(index + 1) for v1 0-based index', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});

		let seekedToPosition: unknown;
		Object.assign(player, {
			item: () => null,
			seekToIndex: (pos: number) => { seekedToPosition = pos; },
		});

		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		compat.playlistItem!(2);

		expect(seekedToPosition).toBe(3);
	});

	it('setter with index 0 calls seekToIndex(1)', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});

		let seekedToPosition: unknown;
		Object.assign(player, {
			item: () => null,
			seekToIndex: (pos: number) => { seekedToPosition = pos; },
		});

		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		(player as unknown as Compat).playlistItem!(0);
		expect(seekedToPosition).toBe(1);
	});

	it('setter coerces string index to number before adding 1', async () => {
		const player = new NMVideoPlayer('v1-shim-test').setup({});

		let seekedToPosition: unknown;
		Object.assign(player, {
			item: () => null,
			seekToIndex: (pos: number) => { seekedToPosition = pos; },
		});

		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		(player as unknown as Compat).playlistItem!('4');
		expect(seekedToPosition).toBe(5);
	});
});
