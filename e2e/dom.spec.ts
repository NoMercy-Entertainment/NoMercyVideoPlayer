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

test.describe('displayMessage()', () => {
	test('emits display-message event with text', async ({ page }) => {
		const msg = await page.evaluate(() => {
			const p = (window as any).player;
			let received: any = null;
			p.on('display-message', (d: any) => { received = d; });
			p.displayMessage('Test message');
			return received;
		});
		expect(msg).toBe('Test message');
	});

	test('emits remove-message after timeout', async ({ page }) => {
		const removed = await page.evaluate(async () => {
			const p = (window as any).player;
			let removed: any = null;
			p.on('remove-message', (d: any) => { removed = d; });
			p.displayMessage('Timed msg', 100);
			await new Promise(r => setTimeout(r, 200));
			return removed;
		});
		expect(removed).toBe('Timed msg');
	});
});

test.describe('Utility methods', () => {
	test('snakeToCamel() converts snake_case', async ({ page }) => {
		const result = await page.evaluate(() => {
			return (window as any).player.snakeToCamel('hello_world_test');
		});
		expect(result).toBe('helloWorldTest');
	});

	test('spaceToCamel() converts space-separated', async ({ page }) => {
		const result = await page.evaluate(() => {
			return (window as any).player.spaceToCamel('hello world');
		});
		expect(result).toBe('helloWorld');
	});

	test('isMobile() returns a boolean', async ({ page }) => {
		const result = await page.evaluate(() => typeof (window as any).player.isMobile());
		expect(result).toBe('boolean');
	});

	test('isTv() returns a boolean', async ({ page }) => {
		const result = await page.evaluate(() => typeof (window as any).player.isTv());
		expect(result).toBe('boolean');
	});

	test('isMobile() returns false in Playwright Chromium', async ({ page }) => {
		const mobile = await page.evaluate(() => (window as any).player.isMobile());
		expect(mobile).toBe(false);
	});

	test('isTv() returns false in Playwright Chromium', async ({ page }) => {
		const tv = await page.evaluate(() => (window as any).player.isTv());
		expect(tv).toBe(false);
	});
});

test.describe('Localization', () => {
	test('localize() returns key when no translation', async ({ page }) => {
		const result = await page.evaluate(() => {
			return (window as any).player.localize('some.unknown.key');
		});
		expect(result).toBe('some.unknown.key');
	});

	test('addTranslation() adds a single translation', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.addTranslation('hello', 'Hola');
			return p.localize('hello');
		});
		expect(result).toBe('Hola');
	});

	test('addTranslations() adds multiple translations', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.addTranslations([
				{ key: 'play', value: 'Reproducir' },
				{ key: 'pause', value: 'Pausa' },
			]);
			return {
				play: p.localize('play'),
				pause: p.localize('pause'),
			};
		});
		expect(result.play).toBe('Reproducir');
		expect(result.pause).toBe('Pausa');
	});
});
