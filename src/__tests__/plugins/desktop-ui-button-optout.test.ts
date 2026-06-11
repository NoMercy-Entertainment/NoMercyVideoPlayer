/**
 * Repro: buttons map present, optional keys ABSENT → those buttons must be
 * hidden (unset key falls back to the button's own default, which is off
 * for the menu cluster).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { desktopUiPlugin } from '../../plugins/desktop-ui';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const _observedCallbacks: ResizeCallback[] = [];

function simulateWidth(width: number): void {
	const entry = [{ contentRect: { width } }];
	for (const cb of _observedCallbacks) {
		cb(entry);
	}
}

const MockResizeObserver = vi.fn(function (this: unknown, callback: ResizeCallback) {
	_observedCallbacks.push(callback);
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

describe('DesktopUiPlugin — partial buttons map opt-out', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		(globalThis as unknown as Record<string, unknown>).ResizeObserver = MockResizeObserver;
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		delete (globalThis as unknown as Record<string, unknown>).ResizeObserver;
	});

	it('keys absent from a present buttons map stay hidden', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(desktopUiPlugin, {
			buttons: {
				chapterPrev: true,
				chapterNext: true,
				pip: true,
				quality: true,
				subtitles: true,
				audio: true,
				playlist: true,
			},
		});
		await player.ready();

		const container = document.getElementById('test')!;
		const byId = (id: string) => container.querySelector<HTMLButtonElement>(`#${id}`);

		expect(byId('theater')?.hidden).toBe(true);
		expect(byId('speed')?.hidden).toBe(true);
		expect(byId('aspect-ratio')?.hidden).toBe(true);
		expect(byId('seek-back')?.hidden).toBe(true);
		expect(byId('seek-forward')?.hidden).toBe(true);

		// pip/playlist/subtitles are capability- or content-gated in jsdom
		// (no PiP API, empty queue, no tracks) — assert on an ungated default.
		expect(byId('settings')?.hidden).toBe(false);

		// The responsive fit pass must not resurrect opted-out buttons at a
		// viewport where everything fits.
		simulateWidth(1600);

		expect(byId('theater')?.hidden).toBe(true);
		expect(byId('speed')?.hidden).toBe(true);
		expect(byId('aspect-ratio')?.hidden).toBe(true);
		expect(byId('seek-back')?.hidden).toBe(true);
		expect(byId('seek-forward')?.hidden).toBe(true);
		expect(byId('settings')?.hidden).toBe(false);
	});
});
