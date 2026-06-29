// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * render-touch-grid.spec.ts
 *
 * Proves that the TouchZonesPlugin renders the correct COMPUTED layout in a
 * real browser. jsdom cannot prove these because:
 *
 *   - jsdom does not compute CSS grid layout (getComputedStyle returns empty strings)
 *   - jsdom has no z-index stacking context
 *   - getBoundingClientRect() always returns zeros in jsdom
 *
 * Contracts under test (source: plugins/touch-zones/index.ts + ensureStyles()):
 *
 *   GRID STRUCTURE:
 *     - .nm-touch-zones-root has computed display:grid
 *     - grid-template-columns is 3 equal fractional columns (1fr 1fr 1fr)
 *     - The root covers the full player area (boundingBox matches #player)
 *
 *   Z-INDEX LAYERING:
 *     - .nm-touch-zones-root has computed z-index: 10
 *     - The overlay (.overlay) has z-index > touch-zones z-index
 *       (controls must sit above zones so button clicks are not eaten)
 *
 *   DESKTOP LAYOUT (3 zones):
 *     - Exactly 3 .nm-touch-box children span the full 6-row grid height
 *
 *   MOBILE LAYOUT (5 zones):
 *     - On a touch-emulated viewport, 5 .nm-touch-box children are rendered
 *       (left-seek, playback, right-seek, vol-up, vol-down)
 *
 * Mobile detection in TouchZonesPlugin uses `'ontouchstart' in window` or
 * `navigator.maxTouchPoints > 0`. Playwright touch emulation sets maxTouchPoints
 * via device descriptor, which triggers the 5-zone layout.
 */

import { expect, test } from '@playwright/test';

// ── z-index and grid layout tests (desktop, no touch emulation) ────────────────

test.describe('Render: touch zones root computed layout', () => {
	test('.nm-touch-zones-root has display:grid in computed style', async ({ page }) => {
		// Inject TouchZonesPlugin into the fixture page.
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		// The fixture-full.html does not add TouchZonesPlugin. We need to import it
		// and add it via evaluate after the module is available on window.
		const error = await page.evaluate(() => (window as any).__playerError);
		if (error)
			throw new Error(`Player init failed: ${error}`);

		// Import TouchZonesPlugin dynamically on the page so it is available.
		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).TouchZonesPlugin = mod.TouchZonesPlugin;
			(window as any).player.addPlugin(mod.TouchZonesPlugin);

			(window as any).player.setup({
				playlist: [{ id: 'grid-layout', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

		const display = await page.evaluate(() => {
			const root = document.querySelector<HTMLElement>('.nm-touch-zones-root');
			return root ? getComputedStyle(root).display : null;
		});

		expect(display).toBe('grid');
	});

	test('.nm-touch-zones-root has computed z-index 10', async ({ page }) => {
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).player.addPlugin(mod.TouchZonesPlugin);
			(window as any).player.setup({
				playlist: [{ id: 'grid-zidx', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

		const zIndex = await page.evaluate(() => {
			const root = document.querySelector<HTMLElement>('.nm-touch-zones-root');
			return root ? Number(getComputedStyle(root).zIndex) : null;
		});

		// Source: ensureStyles() in touch-zones/index.ts — `.nm-touch-zones-root { z-index: 10 }`.
		expect(zIndex).toBe(10);
	});

	test('controls overlay (.overlay) has higher z-index than touch zones', async ({ page }) => {
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).player.addPlugin(mod.TouchZonesPlugin);
			(window as any).player.setup({
				playlist: [{ id: 'overlay-zidx', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });
		await page.waitForSelector('.overlay', { timeout: 5_000 });

		const result = await page.evaluate(() => {
			const zones = document.querySelector<HTMLElement>('.nm-touch-zones-root');
			const overlay = document.querySelector<HTMLElement>('.overlay');
			if (!zones || !overlay)
				return null;
			return {
				zonesZ: Number(getComputedStyle(zones).zIndex),
				overlayZ: Number(getComputedStyle(overlay).zIndex),
			};
		});

		expect(result).not.toBeNull();
		// The controls overlay must sit above the touch zones so button clicks
		// are not eaten by the zone boxes underneath.
		expect(result!.overlayZ).toBeGreaterThan(result!.zonesZ);
	});

	test('.nm-touch-zones-root bounding box covers the player container', async ({ page }) => {
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).player.addPlugin(mod.TouchZonesPlugin);
			(window as any).player.setup({
				playlist: [{ id: 'bbox-src', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

		const result = await page.evaluate(() => {
			const zones = document.querySelector<HTMLElement>('.nm-touch-zones-root');
			const container = (window as any).player.container as HTMLElement | null;
			if (!zones || !container)
				return null;
			const zr = zones.getBoundingClientRect();
			const cr = container.getBoundingClientRect();
			return {
				zonesWidth: Math.round(zr.width),
				zonesHeight: Math.round(zr.height),
				containerWidth: Math.round(cr.width),
				containerHeight: Math.round(cr.height),
			};
		});

		expect(result).not.toBeNull();
		// inset:0 means the zone root must fill the container exactly.
		expect(result!.zonesWidth).toBe(result!.containerWidth);
		expect(result!.zonesHeight).toBe(result!.containerHeight);
	});

	test('desktop layout has 3 .nm-touch-box children', async ({ page }) => {
		// Headless Chromium has no touch support → detectMobile() returns false → 3 zones.
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).player.addPlugin(mod.TouchZonesPlugin);
			(window as any).player.setup({
				playlist: [{ id: 'desktop-zones', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

		const boxCount = await page.evaluate(() => {
			return document.querySelectorAll('.nm-touch-zones-root .nm-touch-box').length;
		});

		// Desktop path: left-seek + center-playback + right-seek = 3.
		expect(boxCount).toBe(3);
	});

	test('grid-template-columns produces 3 equal columns', async ({ page }) => {
		await page.goto('/e2e/fixture-full.html');
		await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

		await page.evaluate(async () => {
			const mod = await import('/src/plugins/touch-zones/index.ts');
			(window as any).player.addPlugin(mod.TouchZonesPlugin);
			(window as any).player.setup({
				playlist: [{ id: 'col-grid', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

		const colResult = await page.evaluate(() => {
			const root = document.querySelector<HTMLElement>('.nm-touch-zones-root');
			if (!root)
				return null;
			const cols = getComputedStyle(root).gridTemplateColumns;
			return cols;
		});

		expect(colResult).not.toBeNull();
		// `1fr 1fr 1fr` resolves to three equal pixel widths in computed style.
		// Chromium reports them as pixel values (e.g. "213.333px 213.333px 213.333px").
		// Assert there are exactly 3 space-separated values.
		const parts = (colResult ?? '').trim().split(/\s+/);
		expect(parts).toHaveLength(3);

		// All three values must be equal (equal fractions).
		const unique = new Set(parts);
		expect(unique.size).toBe(1);
	});
});

// ── mobile layout test (touch emulation) ──────────────────────────────────────

test.describe('Render: touch zones mobile layout (5 zones)', () => {
	test('mobile touch emulation produces 5 .nm-touch-box zones', async ({ browser }) => {
		// Use a touch-enabled context so navigator.maxTouchPoints > 0 → detectMobile()=true.
		const context = await browser.newContext({
			...{
				hasTouch: true,
				isMobile: true,
				viewport: { width: 390, height: 844 },
			},
		});
		const page = await context.newPage();

		try {
			await page.goto('/e2e/fixture-full.html');
			await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

			const error = await page.evaluate(() => (window as any).__playerError);
			if (error)
				throw new Error(`Player init failed: ${error}`);

			await page.evaluate(async () => {
				const mod = await import('/src/plugins/touch-zones/index.ts');
				(window as any).player.addPlugin(mod.TouchZonesPlugin);
				(window as any).player.setup({
					playlist: [{ id: 'mobile-zones', file: '/e2e/media/sample.mp4' }],
					muted: true,
					autoPlay: false,
				});
			});

			await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

			const boxCount = await page.evaluate(() => {
				return document.querySelectorAll('.nm-touch-zones-root .nm-touch-box').length;
			});

			// Mobile path: left-seek + center-playback + right-seek + vol-up + vol-down = 5.
			expect(boxCount).toBe(5);
		}
		finally {
			await context.close();
		}
	});

	test('mobile layout centre column splits into 3 vertical zones', async ({ browser }) => {
		const context = await browser.newContext({
			hasTouch: true,
			isMobile: true,
			viewport: { width: 390, height: 844 },
		});
		const page = await context.newPage();

		try {
			await page.goto('/e2e/fixture-full.html');
			await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

			await page.evaluate(async () => {
				const mod = await import('/src/plugins/touch-zones/index.ts');
				(window as any).player.addPlugin(mod.TouchZonesPlugin);
				(window as any).player.setup({
					playlist: [{ id: 'mobile-col', file: '/e2e/media/sample.mp4' }],
					muted: true,
					autoPlay: false,
				});
			});

			await page.waitForSelector('.nm-touch-zones-root', { timeout: 5_000 });

			// In mobile layout: col 2 (centre) has vol-up (rows 1-2), playback (rows 3-5),
			// vol-down (rows 5-6). Each of the three col-2 boxes has gridColumnStart=2.
			const col2Count = await page.evaluate(() => {
				const boxes = document.querySelectorAll<HTMLElement>('.nm-touch-zones-root .nm-touch-box');
				let count = 0;
				for (const box of boxes) {
					if (box.style.gridColumnStart === '2')
						count++;
				}
				return count;
			});

			// 3 boxes in column 2 (vol-up, playback, vol-down).
			expect(col2Count).toBe(3);
		}
		finally {
			await context.close();
		}
	});
});
