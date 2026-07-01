// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Pins the symmetric default-export contract (S00-R1):
 *   - The default export is a function (not a class constructor that requires `new`).
 *   - Calling it with a DOM id returns a working player instance without `new`.
 *   - The named export `nmplayer` is still reachable.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import DefaultExport, { nmplayer, NMVideoPlayer } from '../index';

describe('video default export — symmetric factory contract (S00-R1)', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	});

	it('default export is a function (not a class requiring new)', () => {
		expect(typeof DefaultExport).toBe('function');
	});

	it('calling DefaultExport(id) without new returns an NMVideoPlayer instance', () => {
		const div = document.createElement('div');
		div.id = 'default-export-video-test';
		document.body.appendChild(div);

		const player = DefaultExport('default-export-video-test');

		expect(player).toBeInstanceOf(NMVideoPlayer);
		expect(player.id).toBe('default-export-video-test');
	});

	it('DefaultExport is the same reference as the named nmplayer export', () => {
		expect(DefaultExport).toBe(nmplayer);
	});

	it('named export nmplayer is still reachable and is a function', () => {
		expect(typeof nmplayer).toBe('function');
	});
});
