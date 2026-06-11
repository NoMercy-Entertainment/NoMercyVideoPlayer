/**
 * Regression: desktop-ui subtitle/audio menu must reflect programmatic
 * track selections, not just picks made through the menu itself.
 *
 * Root cause fixed: `syncActiveIndexes` was testing `typeof x === 'number'`
 * on the objects returned by `player.subtitle()` / `player.audioTrack()`.
 * The check always failed, resetting both indexes to -1 on every `mediaReady`.
 * Any programmatic `player.subtitle(idx)` call that fired before `mediaReady`
 * (e.g. from a preferences-restore plugin on the `current` event) was silently
 * overwritten, leaving the subtitle menu showing "Off" while the track rendered.
 *
 * Covered:
 *   - Programmatic subtitle set → menu marks the track active (not Off)
 *   - `mediaReady` after programmatic set does NOT reset the checked item
 *   - Audio menu equivalent
 */

import type { SubtitleTrack } from '@nomercy-entertainment/nomercy-player-core';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { desktopUiPlugin } from '../../plugins/desktop-ui';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

const SUBTITLE_TRACKS: SubtitleTrack[] = [
	{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' },
	{ id: 'nl', language: 'nl', label: 'Dutch', kind: 'subtitles', default: false, url: '' },
];

async function makePlayer(): Promise<NMVideoPlayer> {
	const player = new NMVideoPlayer('test').setup({});
	await player.addPlugin(desktopUiPlugin, {
		buttons: {
			subtitles: true,
			audio: true,
		},
	}).ready();
	return player;
}

describe('DesktopUiPlugin — menu sync with programmatic track selection', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const container = document.createElement('div');
		container.id = 'test';
		container.className = 'nomercyplayer';
		document.body.appendChild(container);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	// ── Subtitle menu ──────────────────────────────────────────────────────────

	it('subtitle menu marks the programmatically-set track active, not Off', async () => {
		const player = await makePlayer();

		// Stub the player getters to report Dutch (index 1) as the active track.
		Object.assign(player, {
			subtitles: () => SUBTITLE_TRACKS,
			subtitle: () => ({ index: 1, track: SUBTITLE_TRACKS[1] }),
		});

		// Emit `subtitle` as the kit would after a programmatic player.subtitle(1) call.
		player.emit('subtitle' as never, { track: 1 } as never);

		// Open the subtitles pane (forces a repaint with current state).
		(player.getPlugin(desktopUiPlugin) as unknown as { openSubMenu: (id: string) => void })
			.openSubMenu('subtitles');

		// No `type` on the track → variant slug defaults to 'full' (menus.ts).
		const offBtn = document.querySelector<HTMLButtonElement>('[id^="off-button-"]');
		const dutchBtn = document.querySelector<HTMLButtonElement>('[id^="full-button-nl"]');

		expect(offBtn).toBeTruthy();
		expect(dutchBtn).toBeTruthy();
		expect(offBtn!.classList.contains('is-active')).toBe(false);
		expect(dutchBtn!.classList.contains('is-active')).toBe(true);
	});

	it('mediaReady after programmatic subtitle set does NOT reset menu to Off', async () => {
		const player = await makePlayer();

		// Simulate the preferences plugin having already restored subtitle 1.
		Object.assign(player, {
			subtitles: () => SUBTITLE_TRACKS,
			subtitle: () => ({ index: 1, track: SUBTITLE_TRACKS[1] }),
			audioTrack: () => null,
			audioTracks: () => [],
			quality: () => 'auto' as const,
		});

		// Fire subtitle event (kit emits this on player.subtitle(idx)).
		player.emit('subtitle' as never, { track: 1 } as never);

		// Now mediaReady fires — this is where syncActiveIndexes used to
		// overwrite activeSubtitleIdx back to -1.
		player.emit('mediaReady' as never, {} as never);

		// Open the pane after mediaReady.
		(player.getPlugin(desktopUiPlugin) as unknown as { openSubMenu: (id: string) => void })
			.openSubMenu('subtitles');

		const offBtn = document.querySelector<HTMLButtonElement>('[id^="off-button-"]');
		const dutchBtn = document.querySelector<HTMLButtonElement>('[id^="full-button-nl"]');

		expect(offBtn!.classList.contains('is-active')).toBe(false);
		expect(dutchBtn!.classList.contains('is-active')).toBe(true);
	});

	// ── Audio menu ─────────────────────────────────────────────────────────────

	it('audio menu marks the programmatically-set track active', async () => {
		const player = await makePlayer();

		const audioTracks = [
			{ id: 'en', language: 'en', label: 'English', default: true },
			{ id: 'nl', language: 'nl', label: 'Dutch', default: false },
		];

		Object.assign(player, {
			audioTracks: () => audioTracks,
			audioTrack: () => ({ index: 1, track: audioTracks[1] }),
			subtitles: () => [],
			subtitle: () => null,
			quality: () => 'auto' as const,
		});

		// Emit audioTrack as the kit would after player.audioTrack(1).
		player.emit('audioTrack' as never, { id: 1 } as never);

		// mediaReady — must NOT overwrite the audio index back to default.
		player.emit('mediaReady' as never, {} as never);

		(player.getPlugin(desktopUiPlugin) as unknown as { openSubMenu: (id: string) => void })
			.openSubMenu('language');

		const englishBtn = document.querySelector<HTMLButtonElement>('[id^="audio-button-en-0"]');
		const dutchBtn = document.querySelector<HTMLButtonElement>('[id^="audio-button-nl-1"]');

		expect(englishBtn).toBeTruthy();
		expect(dutchBtn).toBeTruthy();
		expect(englishBtn!.classList.contains('is-active')).toBe(false);
		expect(dutchBtn!.classList.contains('is-active')).toBe(true);
	});
});
