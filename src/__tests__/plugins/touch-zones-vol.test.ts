// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * TouchZonesPlugin — mobile volume zones (buildVolUp / buildVolDown).
 *
 * Lines 410-413 (volUp double-tap → volumeUp()) and 424-427 (volDown double-tap
 * → volumeDown()) were uncovered because the existing tests run in JSDOM which
 * has maxTouchPoints=0 so detectMobile()=false and the mobile zones are never
 * built. This test forces mobile mode before plugin init.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { touchZonesPlugin } from '../../plugins/touch-zones';

describe('TouchZonesPlugin — mobile volume zones', () => {
	let originalMax: number;

	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);

		// Force mobile detection.
		originalMax = navigator.maxTouchPoints;
		Object.defineProperty(navigator, 'maxTouchPoints', { value: 1, configurable: true });
	});

	afterEach(() => {
		Object.defineProperty(navigator, 'maxTouchPoints', { value: originalMax, configurable: true });
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	function findZoneBox(container: Element, colStart: string, colEnd: string, rowStart?: string): HTMLElement | undefined {
		return Array.from(container.querySelectorAll<HTMLElement>('.nm-touch-box')).find(
			box => box.style.gridColumnStart === colStart
				&& box.style.gridColumnEnd === colEnd
				&& (rowStart === undefined || box.style.gridRowStart === rowStart),
		);
	}

	it('double-tap on vol-up zone calls player.volumeUp()', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(touchZonesPlugin, { doubleTapThreshold: 300 });
		await player.ready();

		const volUpSpy = vi.fn();
		(player as unknown as Record<string, unknown>).volumeUp = volUpSpy;

		const container = document.getElementById('test')!;

		// Vol-up zone: col 2–3, row 1–3 on mobile.
		const volUpBox = findZoneBox(container, '2', '3', '1');
		expect(volUpBox).toBeDefined();

		// Double-tap: two clicks within doubleTapThreshold.
		volUpBox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await new Promise(resolve => setTimeout(resolve, 50));
		volUpBox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await new Promise(resolve => setTimeout(resolve, 350));

		expect(volUpSpy).toHaveBeenCalledTimes(1);
	});

	it('double-tap on vol-down zone calls player.volumeDown()', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(touchZonesPlugin, { doubleTapThreshold: 300 });
		await player.ready();

		const volDownSpy = vi.fn();
		(player as unknown as Record<string, unknown>).volumeDown = volDownSpy;

		const container = document.getElementById('test')!;

		// Vol-down zone: col 2–3, row 5–7 on mobile.
		const volDownBox = findZoneBox(container, '2', '3', '5');
		expect(volDownBox).toBeDefined();

		volDownBox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await new Promise(resolve => setTimeout(resolve, 50));
		volDownBox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await new Promise(resolve => setTimeout(resolve, 350));

		expect(volDownSpy).toHaveBeenCalledTimes(1);
	});

	it('mobile mode builds 5 zones (seek-back, playback, seek-fwd, vol-up, vol-down)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(touchZonesPlugin);
		await player.ready();

		const container = document.getElementById('test')!;
		const zones = container.querySelectorAll('.nm-touch-box');
		expect(zones.length).toBe(5);
	});

	it('dispose removes the root element', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(touchZonesPlugin);
		await player.ready();

		const { TouchZonesPlugin } = await import('../../plugins/touch-zones');
		const plugin = player.getPlugin(TouchZonesPlugin)!;

		const container = document.getElementById('test')!;
		expect(container.querySelector('.nm-touch-zones-root')).not.toBeNull();

		plugin.dispose();

		expect(container.querySelector('.nm-touch-zones-root')).toBeNull();
	});
});
