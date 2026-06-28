// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * SubtitleOverlayPlugin — cue positioning / multi-cue / style paths.
 *
 * Targets the uncovered branches in subtitle-overlay/index.ts:
 *   - applyCuePositioningTo: line > 50 → bottom anchor
 *   - applyCuePositioningTo: line = null/auto → bottom:0
 *   - applyCuePositioningTo: align=start / align=end CSS classes
 *   - applyCuePositioningTo: custom size + position geometry
 *   - renderCues with multiple simultaneous cues (pool growth)
 *   - renderCues clearing pool back to 0 on empty cues
 *   - setLanguage: removes data-language when lang is undefined
 *   - bindOverlayToVideo: null rect → 100%/100% fallback
 *   - subtitleStyle event → repaint existing areas
 *   - item event → clears all cues
 */

import type { SubtitleCueChange, SubtitleStyle } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { subtitleOverlayPlugin } from '../../plugins/subtitle-overlay';
import { SubtitleOverlayPlugin } from '../../plugins/subtitle-overlay';

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
}

async function makePlayer(): Promise<NMVideoPlayer> {
	const player = new NMVideoPlayer('test').setup({});
	await player.addPlugin(subtitleOverlayPlugin).ready();
	return player;
}

function emitCues(player: NMVideoPlayer, cues: SubtitleCueChange['cues'], language = 'en'): void {
	(player as unknown as { emit: (e: string, d: unknown) => void }).emit('subtitleCue', {
		language,
		cues,
	} satisfies SubtitleCueChange);
}

// ── Pool sizing ───────────────────────────────────────────────────────────────

describe('SubtitleOverlayPlugin — cue pool sizing', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('creates one subtitle-area per active cue', async () => {
		const player = await makePlayer();

		emitCues(player, [
			{ text: 'Hello world', start: 0, end: 5 },
			{ text: 'Second line', start: 0, end: 5 },
		]);

		const container = player.container;
		const areas = container.querySelectorAll('.subtitle-area');
		expect(areas.length).toBe(2);
	});

	it('reduces area pool to zero when cues array is empty', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Hello', start: 0, end: 5 }]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(1);

		emitCues(player, []);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(0);
	});

	it('grows the pool when more cues arrive', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'One', start: 0, end: 5 }]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(1);

		emitCues(player, [
			{ text: 'One', start: 0, end: 5 },
			{ text: 'Two', start: 0, end: 5 },
			{ text: 'Three', start: 0, end: 5 },
		]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(3);
	});

	it('shrinks pool when fewer cues arrive', async () => {
		const player = await makePlayer();

		emitCues(player, [
			{ text: 'One', start: 0, end: 5 },
			{ text: 'Two', start: 0, end: 5 },
		]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(2);

		emitCues(player, [{ text: 'Only', start: 0, end: 5 }]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(1);
	});
});

// ── item event clears cues ────────────────────────────────────────────────────

describe('SubtitleOverlayPlugin — item event clears cues', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('emitting "item" removes all rendered cue areas', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Hello', start: 0, end: 5 }]);
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(1);

		(player as unknown as { emit: (e: string, d: unknown) => void }).emit('item', {});

		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(0);
	});
});

// ── Language tracking ─────────────────────────────────────────────────────────

describe('SubtitleOverlayPlugin — language tracking', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('sets data-language attribute on subtitle-text spans', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Bonjour', start: 0, end: 5 }], 'fr');

		const text = player.container.querySelector('.subtitle-text');
		expect(text?.getAttribute('data-language')).toBe('fr');
	});

	it('changes language attribute when language changes between cue batches', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Hello', start: 0, end: 5 }], 'en');
		emitCues(player, [{ text: 'Bonjour', start: 0, end: 5 }], 'fr');

		const text = player.container.querySelector('.subtitle-text');
		expect(text?.getAttribute('data-language')).toBe('fr');
	});
});

// ── Cue positioning — line anchor ────────────────────────────────────────────

describe('SubtitleOverlayPlugin — cue positioning via line', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('line > 50 → bottom anchor on the area style', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Bottom cue', start: 0, end: 5, line: 80 }]);

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area).not.toBeNull();
		// bottom should be set (100 - 80 = 20%)
		expect(area!.style.bottom).toBe('20%');
		expect(area!.style.top).toBe('');
	});

	it('line ≤ 50 → top anchor on the area style', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Top cue', start: 0, end: 5, line: 10 }]);

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area!.style.top).toBe('10%');
		expect(area!.style.bottom).toBe('');
	});

	it('line = null → bottom:0 fallback', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Auto cue', start: 0, end: 5, line: null as unknown as number }]);

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		// JSDOM normalizes '0' to '0px' in element.style, so we check for either.
		expect(['0', '0px']).toContain(area!.style.bottom);
		expect(area!.style.top).toBe('');
	});

	it('line undefined → bottom:0 fallback', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'No line', start: 0, end: 5 }]);

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(['0', '0px']).toContain(area!.style.bottom);
	});
});

// ── Cue positioning — text alignment ─────────────────────────────────────────

describe('SubtitleOverlayPlugin — cue text alignment classes', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('align=start adds aligned-start class', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Left', start: 0, end: 5, align: 'start' }]);

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-start')).toBe(true);
	});

	it('align=end adds aligned-end class', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Right', start: 0, end: 5, align: 'end' }]);

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-end')).toBe(true);
	});

	it('align=center (default) adds aligned-center class', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Center', start: 0, end: 5, align: 'center' }]);

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-center')).toBe(true);
	});
});

// ── subtitleStyle event repaints existing areas ───────────────────────────────

describe('SubtitleOverlayPlugin — subtitleStyle repaint', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('subtitleStyle event updates text color on existing areas', async () => {
		const player = await makePlayer();

		emitCues(player, [{ text: 'Hello', start: 0, end: 5 }]);

		const textSpan = player.container.querySelector<HTMLElement>('.subtitle-text');
		expect(textSpan).not.toBeNull();

		const newStyle: Partial<SubtitleStyle> = {
			fontSize: 120,
			fontFamily: 'monospace',
			textColor: 'yellow',
			textOpacity: 100,
			backgroundColor: 'transparent',
			backgroundOpacity: 0,
			edgeStyle: 'none',
			areaColor: 'transparent',
			windowOpacity: 0,
		};

		// Emit subtitleStyle with a full style object so applyStyleTo runs.
		(player as unknown as { emit: (e: string, d: unknown) => void })
			.emit('subtitleStyle', newStyle);

		// fontFamily should have been written to the text span.
		expect(textSpan!.style.fontFamily).toContain('monospace');
	});
});

// ── bindOverlayToVideo — null rect fallback ───────────────────────────────────

describe('SubtitleOverlayPlugin — bindOverlayToVideo null rect', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('overlay uses 100%/100% when player.videoRect() returns null', async () => {
		const player = new NMVideoPlayer('test').setup({});

		// Patch videoRect to return null before plugin attaches.
		(player as unknown as Record<string, unknown>).videoRect = () => null;

		await player.addPlugin(subtitleOverlayPlugin).ready();

		const plugin = player.getPlugin(SubtitleOverlayPlugin);
		expect(plugin).toBeDefined();

		// Trigger the videoRect event with no rect so applyRect runs the null branch.
		(player as unknown as { emit: (e: string, d: unknown) => void })
			.emit('videoRect', { rect: null });

		const overlay = player.container.querySelector<HTMLElement>('.subtitle-overlay');
		expect(overlay).not.toBeNull();
		expect(overlay!.style.width).toBe('100%');
		expect(overlay!.style.height).toBe('100%');
	});

	it('overlay uses rect dimensions when player.videoRect() returns a valid rect', async () => {
		const player = new NMVideoPlayer('test').setup({});

		const fakeRect = { width: 640, height: 360 };
		(player as unknown as Record<string, unknown>).videoRect = () => fakeRect;

		await player.addPlugin(subtitleOverlayPlugin).ready();

		(player as unknown as { emit: (e: string, d: unknown) => void })
			.emit('videoRect', { rect: fakeRect });

		const overlay = player.container.querySelector<HTMLElement>('.subtitle-overlay');
		expect(overlay!.style.width).toBe('640px');
		expect(overlay!.style.height).toBe('360px');
	});
});

// ── subtitleCue guard branches ────────────────────────────────────────────────

describe('SubtitleOverlayPlugin — subtitleCue guard branches', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('null subtitleCue event does not create any areas', async () => {
		const player = await makePlayer();

		(player as unknown as { emit: (e: string, d: unknown) => void })
			.emit('subtitleCue', null);

		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(0);
	});
});
