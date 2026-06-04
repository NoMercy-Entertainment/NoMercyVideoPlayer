/**
 * Regression test: disabling DesktopUiPlugin must HIDE its overlay, not merely
 * short-circuit handlers.
 *
 * A peer plugin that owns the screen (e.g. a disc-menu interpreter painting the
 * disc's own chrome) disables desktop-ui to take over. Before this fix `disable()`
 * only flipped the enabled flag, so the already-rendered control bar stayed
 * painted on top of the menu. The fix hides the overlay root on disable and
 * restores it on enable.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DesktopUiPlugin, desktopUiPlugin } from '../../plugins/desktop-ui';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

function overlay(): HTMLElement | null {
	return document.querySelector<HTMLElement>('#test .overlay');
}

describe('DesktopUiPlugin — disable hides the overlay', () => {
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
		vi.useRealTimers();
	});

	it('hides the overlay root when disabled and restores it when re-enabled', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(desktopUiPlugin, { inactivityMs: 4000 });
		await player.ready();

		const root = overlay();
		expect(root).not.toBeNull();
		expect(root!.hidden).toBe(false);

		const plugin = player.getPlugin(DesktopUiPlugin)!;

		plugin.disable();
		expect(root!.hidden).toBe(true);
		expect(plugin.enabled()).toBe(false);

		plugin.enable();
		expect(root!.hidden).toBe(false);
		expect(plugin.enabled()).toBe(true);
	});

	it('emits a final activity:false when disabled so nothing re-shows it', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(desktopUiPlugin, { inactivityMs: 4000 });
		await player.ready();

		const activityEvents: Array<{ active: boolean }> = [];
		player.on('activity' as never, ((data: { active: boolean }) => {
			activityEvents.push(data);
		}) as never);

		player.getPlugin(DesktopUiPlugin)!.disable();

		expect(activityEvents.at(-1)).toEqual({ active: false });
	});
});
