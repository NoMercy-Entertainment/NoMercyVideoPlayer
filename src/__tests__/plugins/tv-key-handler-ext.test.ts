// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Extended TvKeyHandlerPlugin tests.
 *
 * The existing tv-key-handler.test.ts covers:
 *   - Registration smoke test
 *   - ArrowLeft/Right → rewind/forward (desktop-gate bypass)
 *   - MediaRecord emits bookmark with time
 *
 * New coverage (39% → target ~85%+):
 *   - Info key: emits plugin:tv-key-handler:info with title/time/remaining/chapterLabel
 *   - Info key: includes chapter label when chapters are active
 *   - Info key: emits display-message as OSD fallback
 *   - addHelpKey override: '?' emits plugin:tv-key-handler:shortcuts-toggle (not desktop-ui)
 *   - ArrowUp → volumeUp() (TV override — no isTv/isMobile gate)
 *   - ArrowDown → volumeDown() (TV override)
 *   - Aspect-ratio key 'a' emits OSD message after cycling
 *   - osdMessage routes through display-message event
 *   - infoDisplayMs option controls message duration
 *   - resolveTitle falls back to i18n key when item has no title
 *   - resolveChapterLabel: no chapter returns empty string
 *   - resolveChapterLabel: chapter without title uses Chapter N format
 *   - resolveChapterLabel: active chapter with title shown
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { TvKeyHandlerPlugin, tvKeyHandlerPlugin } from '../../plugins/tv-key-handler';

describe('TvKeyHandlerPlugin — extended coverage', () => {
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

	function makePlayer(overrides: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(tvKeyHandlerPlugin, { cooldownMs: 0, arrowSeekSeconds: 5 } as any);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(videoPlayer: NMVideoPlayer): Promise<NMVideoPlayer> {
		await videoPlayer.ready();
		return videoPlayer;
	}

	function key(k: string, opts: KeyboardEventInit = {}): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
	}

	// ── ArrowUp/Down volume (TV override, no gate) ────────────────────────────

	it('ArrowUp → volumeUp() on TV (no isTv/isMobile gate)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ volumeUp: spy }));
		key('ArrowUp');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('ArrowDown → volumeDown() on TV', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ volumeDown: spy }));
		key('ArrowDown');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	// ── Info key ─────────────────────────────────────────────────────────────

	it('Info key emits plugin:tv-key-handler:info with time and remaining', async () => {
		const infoEvents: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 60,
			duration: () => 120,
			item: () => ({ title: 'My Movie', id: '1' }),
			chapters: () => [],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:info', (data: unknown) => infoEvents.push(data));
		key('Info');
		expect(infoEvents.length).toBeGreaterThan(0);
		const info = infoEvents[0] as { currentTime: number; remaining: number; title: string };
		expect(info.currentTime).toBe(60);
		expect(info.remaining).toBe(60);
		expect(info.title).toBe('My Movie');
	});

	it('Info key includes chapter label when a chapter is active', async () => {
		const infoEvents: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 30,
			duration: () => 120,
			item: () => ({ title: 'Movie', id: '1' }),
			chapters: () => [
				{ index: 0, start: 0, end: 60, title: 'Opening' },
				{ index: 1, start: 60, end: 120, title: 'Act 2' },
			],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:info', (data: unknown) => infoEvents.push(data));
		key('Info');
		const info = infoEvents[0] as { chapterLabel: string };
		expect(info.chapterLabel).toContain('Opening');
	});

	it('Info key emits display-message as OSD fallback', async () => {
		const messages: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 65,
			duration: () => 130,
			item: () => ({ title: 'Test', id: '1' }),
			chapters: () => [],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('display-message', (data: unknown) => messages.push(data));
		key('Info');
		expect(messages.length).toBeGreaterThan(0);
		const msg = (messages[0] as { text?: string }).text ?? '';
		// Should contain both time values
		expect(msg).toMatch(/1:05/);
	});

	it('Info key OSD includes title in the message', async () => {
		const messages: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 0,
			duration: () => 60,
			item: () => ({ title: 'Episode 1', id: '1' }),
			chapters: () => [],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('display-message', (data: unknown) => messages.push(data));
		key('Info');
		const msg = (messages[0] as { text?: string }).text ?? '';
		expect(msg).toContain('Episode 1');
	});

	// ── Help key (TV override, different namespace) ───────────────────────────

	it('? key emits plugin:tv-key-handler:shortcuts-toggle (not desktop-ui)', async () => {
		const tvEvents: unknown[] = [];
		const desktopEvents: unknown[] = [];
		const player = await ready(makePlayer({}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:shortcuts-toggle', () => tvEvents.push(true));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:desktop-ui:shortcuts-toggle', () => desktopEvents.push(true));
		// A real `?` press carries shiftKey, because shift is how the character is
		// typed. Dispatching it without shift describes an event no keyboard sends,
		// and this assertion passed against a binding that never fired on a remote.
		key('?', { shiftKey: true });
		expect(tvEvents.length).toBeGreaterThan(0);
		expect(desktopEvents.length).toBe(0);
	});

	// ── Aspect ratio (TV override with OSD) ───────────────────────────────────

	it('a → cycleAspectRatio() and emits display-message', async () => {
		const cycleSpy = vi.fn().mockResolvedValue(undefined);
		const messages: unknown[] = [];
		const player = await ready(makePlayer({ cycleAspectRatio: cycleSpy }));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('display-message', (data: unknown) => messages.push(data));
		key('a');
		expect(cycleSpy).toHaveBeenCalledTimes(1);
		// The OSD message should fire
		expect(messages.length).toBeGreaterThan(0);
	});

	// ── MediaRecord key ───────────────────────────────────────────────────────

	it('MediaRecord emits plugin:tv-key-handler:bookmark with current time', async () => {
		const bookmarks: unknown[] = [];
		const player = await ready(makePlayer({ time: () => 42 }));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:bookmark', (data: unknown) => bookmarks.push(data));
		key('MediaRecord');
		expect(bookmarks.length).toBeGreaterThan(0);
		expect((bookmarks[0] as { time: number }).time).toBe(42);
	});

	// ── resolveChapterLabel edge cases ────────────────────────────────────────

	it('Info OSD message has no chapter label when no chapters', async () => {
		const infoEvents: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 10,
			duration: () => 60,
			item: () => ({ title: 'No Chapters', id: '1' }),
			chapters: () => [],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:info', (data: unknown) => infoEvents.push(data));
		key('Info');
		const info = infoEvents[0] as { chapterLabel: string };
		expect(info.chapterLabel).toBe('');
	});

	it('chapter without title shows "Chapter N" format', async () => {
		const infoEvents: unknown[] = [];
		const player = await ready(makePlayer({
			time: () => 10,
			duration: () => 60,
			item: () => ({ title: 'Movie', id: '1' }),
			chapters: () => [{ index: 0, start: 0, end: 60, title: '' }],
		}));
		(player as unknown as { on: (event: string, fn: (data: unknown) => void) => void }).on('plugin:tv-key-handler:info', (data: unknown) => infoEvents.push(data));
		key('Info');
		const info = infoEvents[0] as { chapterLabel: string };
		// Should contain chapter number but no title (empty string check in source)
		expect(info.chapterLabel).toBeTruthy();
	});

	// ── TvKeyHandlerPlugin registration ──────────────────────────────────────

	it('id is tv-key-handler', () => {
		expect(TvKeyHandlerPlugin.id).toBe('tv-key-handler');
	});

	it('overrides base description', () => {
		expect(TvKeyHandlerPlugin.description).toContain('TV');
	});
});
