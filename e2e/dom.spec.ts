import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/e2e/fixture.html');
	await page.waitForFunction(
		() => (window as any).__playerReady !== undefined,
		{ timeout: 10_000 },
	);
	const error = await page.evaluate(() => (window as any).__playerError);
	if (error) {
		throw new Error(`Player init failed: ${error}`);
	}
});

test.describe('createElement()', () => {
	test('creates an element with correct tag and id', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const el = p.createElement('div', 'test-el').get();
			return { tag: el.tagName, id: el.id };
		});
		expect(result.tag).toBe('DIV');
		expect(result.id).toBe('test-el');
	});

	test('appendTo inserts into parent', async ({ page }) => {
		const childId = await page.evaluate(() => {
			const p = (window as any).player;
			p.createElement('span', 'child-test').appendTo(p.container);
			return p.container.querySelector('#child-test')?.id;
		});
		expect(childId).toBe('child-test');
	});

	test('prependTo inserts before existing children', async ({ page }) => {
		const firstChildId = await page.evaluate(() => {
			const p = (window as any).player;
			p.createElement('div', 'prepended-el').prependTo(p.container);
			return p.container.children[0].id;
		});
		expect(firstChildId).toBe('prepended-el');
	});

	test('addClasses adds CSS classes', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const el = p.createElement('div', 'classed-el').addClasses(['foo', 'bar']).get();
			return {
				hasFoo: el.classList.contains('foo'),
				hasBar: el.classList.contains('bar'),
			};
		});
		expect(result.hasFoo).toBe(true);
		expect(result.hasBar).toBe(true);
	});

	test('unique flag reuses existing element', async ({ page }) => {
		const same = await page.evaluate(() => {
			const p = (window as any).player;
			const first = p.createElement('div', 'unique-el').appendTo(p.container).get();
			const second = p.createElement('div', 'unique-el', true).get();
			return first === second;
		});
		expect(same).toBe(true);
	});
});

test.describe('addClasses()', () => {
	test('adds classes to existing element', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const el = document.createElement('div');
			p.addClasses(el, ['alpha', 'beta']);
			return {
				hasAlpha: el.classList.contains('alpha'),
				hasBeta: el.classList.contains('beta'),
			};
		});
		expect(result.hasAlpha).toBe(true);
		expect(result.hasBeta).toBe(true);
	});

	test('returns chainable object', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const el = document.createElement('div');
			const chain = p.addClasses(el, ['x']);
			return {
				hasGet: typeof chain.get === 'function',
				hasAppendTo: typeof chain.appendTo === 'function',
				hasPrependTo: typeof chain.prependTo === 'function',
			};
		});
		expect(result.hasGet).toBe(true);
		expect(result.hasAppendTo).toBe(true);
		expect(result.hasPrependTo).toBe(true);
	});
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
