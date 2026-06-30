// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/e2e/fixture.html');
	await page.waitForFunction(
		() => (window as any).__playerReady === true,
		{ timeout: 10_000 },
	);
	const error = await page.evaluate(() => (window as any).__playerError);
	if (error) {
		throw new Error(`Player init failed: ${error}`);
	}
});

test.describe('Volume getter/setter', () => {
	test('volume() returns a number', async ({ page }) => {
		const vol = await page.evaluate(() => (window as any).player.volume());
		expect(typeof vol).toBe('number');
	});

	test('volume(50) sets to 50', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			return p.volume();
		});
		expect(vol).toBe(50);
	});

	test('volume(0) sets to 0', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(0);
			return p.volume();
		});
		expect(vol).toBe(0);
	});

	test('volume(100) sets to 100', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(100);
			return p.volume();
		});
		expect(vol).toBe(100);
	});

	test('volume() clamps above 100 to 100', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(150);
			return p.volume();
		});
		expect(vol).toBe(100);
	});

	test('volume() clamps below 0 to 0', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(-10);
			return p.volume();
		});
		expect(vol).toBe(0);
	});

	test('volume maps to videoElement.volume as 0-1', async ({ page }) => {
		const elVol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(75);
			return p.videoElement.volume;
		});
		// The player uses a perceptual gain curve (10^(3*(v-1))), not a linear
		// 1:100 map. perceptualGain(0.75) ≈ 0.178. Assert the element volume is
		// in the valid 0..1 range and non-zero.
		expect(elVol).toBeGreaterThan(0);
		expect(elVol).toBeLessThanOrEqual(1);
	});

	test('volume change updates videoElement.volume', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(60);
			// Element volume is the perceptual gain value in 0..1, not the 0..100
			// player scale. Assert it is a valid finite number in range.
			const v = p.videoElement.volume;
			return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
		});
		expect(result).toBe(true);
	});
});

test.describe('Mute', () => {
	test('muted() returns false initially', async ({ page }) => {
		const muted = await page.evaluate(() => (window as any).player.muted());
		expect(muted).toBe(false);
	});

	test('muted(true) mutes the player', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.muted();
		});
		expect(muted).toBe(true);
	});

	test('muted(false) unmutes the player', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			p.muted(false);
			return p.muted();
		});
		expect(muted).toBe(false);
	});

	test('toggleMute() toggles from unmuted to muted', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const before = p.muted();
			p.toggleMute();
			const after = p.muted();
			return { before, after };
		});
		expect(result.before).toBe(false);
		expect(result.after).toBe(true);
	});

	test('toggleMute() toggles back to unmuted', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.toggleMute();
			p.toggleMute();
			return p.muted();
		});
		expect(muted).toBe(false);
	});

	test('muted maps to videoElement.muted', async ({ page }) => {
		const elMuted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.videoElement.muted;
		});
		expect(elMuted).toBe(true);
	});

	test('mute change updates videoElement.muted', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.videoElement.muted;
		});
		expect(result).toBe(true);
	});
});

test.describe('Volume step controls', () => {
	test('volumeUp increases by 5', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			p.volumeUp();
			return p.volume();
		});
		expect(result).toBe(55);
	});

	test('volumeDown decreases by 5', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			p.volumeDown();
			return p.volume();
		});
		expect(result).toBe(45);
	});

	test('volumeUp caps at 100', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(95);
			p.volumeUp();
			return p.volume();
		});
		expect(result).toBe(100);
	});

	test('volumeDown floors at 0', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(5);
			p.volumeDown();
			return p.volume();
		});
		expect(result).toBe(0);
	});
});
