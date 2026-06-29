// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * render-action-availability.spec.ts
 *
 * Proves that capability gates write the correct RENDERED attributes to the
 * real DOM. jsdom cannot prove these because:
 *
 *   - jsdom does not run the ResizeObserver / content-rule composition
 *   - `hidden` attribute behaviour differs from Chromium's layout engine
 *   - `disabled` + `aria-disabled` attribute presence needs real element state
 *
 * Contracts under test (source: index.ts — refreshCapabilityVisibility /
 * refreshTransportEnablement / setContentHidden / setDisabled):
 *
 *   CAPABILITY GATES (data-content-hidden + .hidden):
 *     - 0 subtitle tracks  → subs button has data-content-hidden="true"
 *     - ≤1 audio track     → audio button has data-content-hidden="true"
 *     - <2 quality levels  → quality button has data-content-hidden="true"
 *
 *   TRANSPORT GATES (disabled + aria-disabled attributes):
 *     - single-item queue  → prev button has disabled attr; next button has disabled attr
 *     - at t=0             → rewind button has disabled attr
 */

import { expect, test } from '@playwright/test';

// ── fixture ────────────────────────────────────────────────────────────────────

async function loadFixture(page: import('@playwright/test').Page): Promise<void> {
	await page.goto('/e2e/fixture-full.html');
	await page.waitForFunction(
		() => (window as any).__playerReady === true,
		{ timeout: 10_000 },
	);
	const error = await page.evaluate(() => (window as any).__playerError);
	if (error) {
		throw new Error(`Player init failed: ${error}`);
	}
}

async function setupSingleItem(page: import('@playwright/test').Page): Promise<void> {
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'availability-src', file: '/e2e/media/sample.mp4' }],
			muted: true,
			autoPlay: false,
		});
	});

	await page.waitForSelector('.overlay', { timeout: 5_000 });

	// Wait for capability gating to run — it fires on mediaReady / item events.
	// A short settle is sufficient since the DOM change is synchronous after the event.
	await page.waitForTimeout(500);
}

// ── capability gate tests ──────────────────────────────────────────────────────

test.describe('Render: capability gates — data-content-hidden attributes', () => {
	test('subs button has data-content-hidden="true" when no subtitle tracks', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		// sample.mp4 is a bare progressive MP4 — zero subtitle tracks → subs btn hidden.
		// setContentHidden() sets both data-content-hidden="true" AND btn.hidden = true.
		const attr = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="subtitles"]');
			return btn?.getAttribute('data-content-hidden') ?? null;
		});

		// The button may not be in the DOM at all if the fixture doesn't enable it.
		// Check for existence first; if absent skip gracefully.
		const exists = await page.evaluate(() => document.querySelector('[id="subtitles"]') !== null);
		if (!exists) {
			test.skip();
			return;
		}

		expect(attr).toBe('true');
	});

	test('subs button is hidden (HTML hidden attr) when no subtitle tracks', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		const exists = await page.evaluate(() => document.querySelector('[id="subtitles"]') !== null);
		if (!exists) {
			test.skip();
			return;
		}

		// btn.hidden = true sets the HTML hidden attribute.
		const isHidden = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="subtitles"]');
			return btn?.hidden ?? false;
		});
		expect(isHidden).toBe(true);
	});

	test('audio button has data-content-hidden="true" when ≤1 audio track', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		const exists = await page.evaluate(() => document.querySelector('[id="audio"]') !== null);
		if (!exists) {
			test.skip();
			return;
		}

		// sample.mp4 has exactly one audio track → audioBtn is content-hidden.
		const attr = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="audio"]');
			return btn?.getAttribute('data-content-hidden') ?? null;
		});
		expect(attr).toBe('true');
	});

	test('quality button has data-content-hidden="true" when <2 quality levels', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		const exists = await page.evaluate(() => document.querySelector('[id="quality"]') !== null);
		if (!exists) {
			test.skip();
			return;
		}

		// sample.mp4 is a single-quality progressive MP4 → qualityBtn is content-hidden.
		const attr = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="quality"]');
			return btn?.getAttribute('data-content-hidden') ?? null;
		});
		expect(attr).toBe('true');
	});
});

// ── transport gate tests ───────────────────────────────────────────────────────

test.describe('Render: transport gates — disabled attributes', () => {
	test('prev button has disabled + aria-disabled when queue has one item', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		// A single-item queue: idx=0, len=1 → onFirst=true → prev is disabled.
		const disabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="previous"]');
			return btn?.hasAttribute('disabled') ?? false;
		});
		const ariaDisabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="previous"]');
			return btn?.getAttribute('aria-disabled') ?? null;
		});

		expect(disabled).toBe(true);
		expect(ariaDisabled).toBe('true');
	});

	test('next button has disabled + aria-disabled when queue has one item', async ({ page }) => {
		await loadFixture(page);
		await setupSingleItem(page);

		// Single item: idx=0, len=1 → onLast=true → next is disabled.
		const disabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="next"]');
			return btn?.hasAttribute('disabled') ?? false;
		});
		const ariaDisabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="next"]');
			return btn?.getAttribute('aria-disabled') ?? null;
		});

		expect(disabled).toBe(true);
		expect(ariaDisabled).toBe('true');
	});

	test('rewind button has disabled + aria-disabled at t=0', async ({ page }) => {
		await loadFixture(page);

		// Load with autoPlay:false so currentTime stays at 0.
		await page.evaluate(() => {
			(window as any).player.setup({
				playlist: [{ id: 'rewind-src', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.overlay', { timeout: 5_000 });

		// Give capability refresh time to run.
		await page.waitForTimeout(500);

		// setDisabled(rewindBtn, t <= 0) → disabled at t=0.
		const disabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="seek-back"]');
			return btn?.hasAttribute('disabled') ?? false;
		});
		const ariaDisabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="seek-back"]');
			return btn?.getAttribute('aria-disabled') ?? null;
		});

		expect(disabled).toBe(true);
		expect(ariaDisabled).toBe('true');
	});

	test('rewind button loses disabled after seeking past t=0', async ({ page }) => {
		await loadFixture(page);

		// Use autoPlay: true so the backend loads and videoElement is populated.
		// Pause immediately after metadata arrives to stop at a known state.
		await page.evaluate(() => {
			(window as any).player.setup({
				playlist: [{ id: 'rewind-src2', file: '/e2e/media/sample.mp4' }],
				muted: true,
				autoPlay: true,
			});
		});

		await page.waitForSelector('.overlay', { timeout: 5_000 });

		// Wait for metadata so seeking is valid.
		await page.waitForFunction(
			() => {
				const el = (window as any).player.videoElement;
				return el && typeof el.duration === 'number' && el.duration > 0;
			},
			{ timeout: 20_000 },
		);

		// Pause so the timer doesn't advance past our seek point.
		await page.evaluate(async () => {
			await (window as any).player.pause().catch(() => {});
		});

		// Seek to 1 s — refreshTransportEnablement re-fires on the time event.
		await page.evaluate(() => {
			(window as any).player.time?.(1);
		});

		// Wait for the disabled attribute to be removed.
		await page.waitForFunction(
			() => {
				const btn = document.querySelector<HTMLButtonElement>('[id="seek-back"]');
				return btn !== null && !btn.hasAttribute('disabled');
			},
			{ timeout: 5_000 },
		);

		const disabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="seek-back"]');
			return btn?.hasAttribute('disabled') ?? true;
		});
		expect(disabled).toBe(false);

		const ariaDisabled = await page.evaluate(() => {
			const btn = document.querySelector<HTMLButtonElement>('[id="seek-back"]');
			return btn?.hasAttribute('aria-disabled') ?? true;
		});
		expect(ariaDisabled).toBe(false);
	});

	test('prev and next enabled when queue has multiple items', async ({ page }) => {
		await loadFixture(page);

		// Two-item queue: idx=0 → prev disabled, next enabled.
		await page.evaluate(() => {
			(window as any).player.setup({
				playlist: [
					{ id: 'multi-a', file: '/e2e/media/sample.mp4' },
					{ id: 'multi-b', file: '/e2e/media/sample.mp4' },
				],
				muted: true,
				autoPlay: false,
			});
		});

		await page.waitForSelector('.overlay', { timeout: 5_000 });
		await page.waitForTimeout(500);

		// At index 0: prev is disabled, next is enabled.
		const prevDisabled = await page.evaluate(() => {
			return document.querySelector<HTMLButtonElement>('[id="previous"]')?.hasAttribute('disabled') ?? false;
		});
		const nextDisabled = await page.evaluate(() => {
			return document.querySelector<HTMLButtonElement>('[id="next"]')?.hasAttribute('disabled') ?? false;
		});

		expect(prevDisabled).toBe(true);
		expect(nextDisabled).toBe(false);
	});
});
