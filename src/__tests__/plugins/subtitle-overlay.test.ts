// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * SubtitleOverlayPlugin unit tests.
 *
 * Pins the DOM contract: overlay structure created on use(), cue text rendered
 * via subtitleCue event, empty activeCues clears all areas, dispose removes the
 * overlay root.
 *
 * Note: the plugin's `this.on('subtitleCue', ...)` subscribes on the player bus
 * (via the Plugin base class). Triggering it from tests requires emitting
 * `subtitleCue` directly on the player: `(player as any).emit('subtitleCue', ...)`.
 *
 * The `renderCues` code path uses the player's activeCues list to size the pool:
 * it uses `change.cues` (not `change.activeCues`) when rendering. The spec says
 * emit with `activeCues` — but the source code reads `change.cues` in
 * `renderCues()`. We emit both fields for correctness.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { SubtitleOverlayPlugin, subtitleOverlayPlugin } from '../../plugins/subtitle-overlay';

describe('SubtitleOverlayPlugin', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	const setup = (): NMVideoPlayer<any> => new NMVideoPlayer('test').setup({});

	// ── Test 1: overlay DOM structure created on use() ────────────────────────

	it('use() creates .subtitle-overlay containing .subtitle-safezone', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const overlay = player.container.querySelector('.subtitle-overlay');
		expect(overlay).not.toBeNull();

		const safezone = overlay!.querySelector('.subtitle-safezone');
		expect(safezone).not.toBeNull();
	});

	// ── Test 2: subtitleCue with active cues renders .subtitle-area elements ──

	it('subtitleCue event with active cues renders .subtitle-area with cue text', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = { text: 'Hello', start: 1, end: 3, line: 85, size: 80, position: 50, align: 'center' as const };
		(player as any).emit('subtitleCue', {
			cues: [cue],
			activeCues: [cue],
			language: 'en',
		});

		// Allow microtask queue to flush.
		await Promise.resolve();

		const safezone = player.container.querySelector('.subtitle-safezone')!;
		const areas = safezone.querySelectorAll('.subtitle-area');
		expect(areas.length).toBeGreaterThanOrEqual(1);

		const textContent = Array.from(areas).map(a => a.textContent).join(' ');
		expect(textContent).toContain('Hello');
	});

	// ── Test 3: subtitleCue with empty cues removes all .subtitle-area nodes ──

	it('subtitleCue with empty cues removes all .subtitle-area elements', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		// First render an active cue.
		const cue = { text: 'Visible', start: 1, end: 3, line: 85, size: 80, position: 50, align: 'center' as const };
		(player as any).emit('subtitleCue', {
			cues: [cue],
			activeCues: [cue],
			language: 'en',
		});
		await Promise.resolve();

		const safezone = player.container.querySelector('.subtitle-safezone')!;
		expect(safezone.querySelectorAll('.subtitle-area').length).toBeGreaterThanOrEqual(1);

		// Now clear.
		(player as any).emit('subtitleCue', {
			cues: [],
			activeCues: [],
			language: 'en',
		});
		await Promise.resolve();

		expect(safezone.querySelectorAll('.subtitle-area').length).toBe(0);
	});

	// ── Test 4: removePlugin removes .subtitle-overlay from the DOM ──────────

	it('removePlugin removes .subtitle-overlay from DOM', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		expect(player.container.querySelector('.subtitle-overlay')).not.toBeNull();

		player.removePlugin(SubtitleOverlayPlugin);

		expect(player.container.querySelector('.subtitle-overlay')).toBeNull();
	});
});
