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

test.describe('Event emitter: on/emit', () => {
	test('on() registers a listener that receives data', async ({ page }) => {
		const data = await page.evaluate(() => {
			const p = (window as any).player;
			let received: any = null;
			p.on('custom-event', (d: any) => { received = d; });
			p.emit('custom-event', { key: 'value' });
			return received;
		});
		expect(data).toEqual({ key: 'value' });
	});

	test('on() supports multiple listeners for same event', async ({ page }) => {
		const count = await page.evaluate(() => {
			const p = (window as any).player;
			let calls = 0;
			p.on('multi', () => { calls++; });
			p.on('multi', () => { calls++; });
			p.on('multi', () => { calls++; });
			p.emit('multi');
			return calls;
		});
		expect(count).toBe(3);
	});

	test('emit with no listeners does not throw', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.emit('nonexistent-event', { data: 1 });
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('emit passes correct data to listener', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const received: any[] = [];
			p.on('data-test', (d: any) => { received.push(d); });
			p.emit('data-test', 42);
			p.emit('data-test', 'hello');
			p.emit('data-test', [1, 2, 3]);
			return received;
		});
		expect(result).toEqual([42, 'hello', [1, 2, 3]]);
	});
});

test.describe('Event emitter: once', () => {
	test('once() fires only once', async ({ page }) => {
		const count = await page.evaluate(() => {
			const p = (window as any).player;
			let calls = 0;
			p.once('once-test', () => { calls++; });
			p.emit('once-test');
			p.emit('once-test');
			p.emit('once-test');
			return calls;
		});
		expect(count).toBe(1);
	});

	test('once() receives correct data', async ({ page }) => {
		const data = await page.evaluate(() => {
			const p = (window as any).player;
			let received: any = null;
			p.once('once-data', (d: any) => { received = d; });
			p.emit('once-data', { msg: 'first' });
			return received;
		});
		expect(data).toEqual({ msg: 'first' });
	});
});

test.describe('Event emitter: off', () => {
	test('off() with callback removes specific listener', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			let aCalls = 0;
			let bCalls = 0;
			const handlerA = () => { aCalls++; };
			const handlerB = () => { bCalls++; };
			p.on('off-test', handlerA);
			p.on('off-test', handlerB);
			p.off('off-test', handlerA);
			p.emit('off-test');
			return { aCalls, bCalls };
		});
		expect(result.aCalls).toBe(0);
		expect(result.bCalls).toBe(1);
	});

	test('off() without callback removes all listeners for event', async ({ page }) => {
		const count = await page.evaluate(() => {
			const p = (window as any).player;
			let calls = 0;
			p.on('off-all', () => { calls++; });
			p.on('off-all', () => { calls++; });
			p.off('off-all');
			p.emit('off-all');
			return calls;
		});
		expect(count).toBe(0);
	});

	test('off("all") clears all events', async ({ page }) => {
		const count = await page.evaluate(() => {
			const p = (window as any).player;
			let calls = 0;
			p.on('event-a', () => { calls++; });
			p.on('event-b', () => { calls++; });
			p.off('all');
			p.emit('event-a');
			p.emit('event-b');
			return calls;
		});
		expect(count).toBe(0);
	});
});

test.describe('Built-in events', () => {
	test('volume event fires when player.volume() is called', async ({ page }) => {
		const emitted = await page.evaluate(async () => {
			const p = (window as any).player;
			let received = false;
			// The player emits 'volume' via its own volume mixin when volume(v)
			// is called — NOT by bridging the native element's volumechange event.
			p.on('volume', () => { received = true; });
			await p.volume(30);
			return received;
		});
		expect(emitted).toBe(true);
	});

	test('mute event fires when player.muted(true) is called', async ({ page }) => {
		const emitted = await page.evaluate(async () => {
			const p = (window as any).player;
			let received = false;
			// The player emits 'mute' via its own volume mixin when muted(true)
			// is called — NOT by bridging the native element's volumechange event.
			// muted() is the v1-compat shim, a synchronous void wrapper around
			// the now-async mute()/unmute(); flush a macrotask before asserting.
			p.on('mute', () => { received = true; });
			p.muted(true);
			await new Promise(resolve => setTimeout(resolve, 0));
			return received;
		});
		expect(emitted).toBe(true);
	});

	test('speed change emits speed event', async ({ page }) => {
		const emitted = await page.evaluate(async () => {
			const p = (window as any).player;
			let received = false;
			// speed() is the v1-compat shim around the now-async playbackRate();
			// flush a macrotask before asserting.
			p.on('speed', () => { received = true; });
			p.speed(1.5);
			await new Promise(resolve => setTimeout(resolve, 0));
			return received;
		});
		expect(emitted).toBe(true);
	});

	test('displayMessage emits display-message event', async ({ page }) => {
		const msg = await page.evaluate(() => {
			const p = (window as any).player;
			let received: any = null;
			p.on('display-message', (d: any) => { received = d; });
			p.displayMessage('Hello E2E');
			return received;
		});
		expect(msg).toBe('Hello E2E');
	});

	test('dispose emits dispose event exactly once', async ({ page }) => {
		const count = await page.evaluate(async () => {
			const p = (window as any).player;
			let calls = 0;
			p.on('dispose', () => { calls++; });
			await p.dispose();
			return calls;
		});
		expect(count).toBe(1);
	});
});

test.describe('Event chaining', () => {
	test('events can trigger other events', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const chain: string[] = [];
			p.on('step-1', () => {
				chain.push('step-1');
				p.emit('step-2');
			});
			p.on('step-2', () => {
				chain.push('step-2');
				p.emit('step-3');
			});
			p.on('step-3', () => {
				chain.push('step-3');
			});
			p.emit('step-1');
			return chain;
		});
		expect(result).toEqual(['step-1', 'step-2', 'step-3']);
	});
});
