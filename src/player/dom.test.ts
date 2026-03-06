import { describe, expect, it, vi } from 'vitest';
import { domMethods } from './dom';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');
	const videoElement = document.createElement('video');

	const player: any = {
		container,
		videoElement,
		message: undefined as any,
		options: { doubleClickDelay: 300 },
		previewTime: [],
		emit: vi.fn(),
		localize: vi.fn((s: string) => s),
		fullscreen: vi.fn(() => false),
		muted: vi.fn(() => false),
		isPlaying: false,
		element: vi.fn(() => container),
		currentTime: vi.fn(() => 30),
		...overrides,
	};

	for (const [key, value] of Object.entries(domMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('domMethods', () => {
	describe('createElement()', () => {
		it('creates element with correct type and id', () => {
			const player = createMockPlayer();
			const result = player.createElement('div', 'test-id');
			const el = result.get();
			expect(el.tagName).toBe('DIV');
			expect(el.id).toBe('test-id');
		});

		it('reuses existing element when unique=true', () => {
			const existing = document.createElement('div');
			existing.id = 'unique-test';
			document.body.appendChild(existing);

			const player = createMockPlayer();
			const result = player.createElement('div', 'unique-test', true);
			expect(result.get()).toBe(existing);

			document.body.removeChild(existing);
		});

		it('creates new element when unique=true but none exists', () => {
			const player = createMockPlayer();
			const result = player.createElement('span', 'non-existing-unique', true);
			expect(result.get().tagName).toBe('SPAN');
		});

		it('appendTo adds to parent', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const result = player.createElement('span', 'child-el');
			result.appendTo(parent);
			expect(parent.children).toHaveLength(1);
			expect(parent.children[0].id).toBe('child-el');
		});

		it('prependTo prepends to parent', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const existing = document.createElement('div');
			existing.id = 'existing';
			parent.appendChild(existing);

			player.createElement('span', 'prepended').prependTo(parent);
			expect(parent.children[0].id).toBe('prepended');
		});
	});

	describe('addClasses()', () => {
		it('adds classes to element', () => {
			const player = createMockPlayer();
			const el = document.createElement('div');
			player.addClasses(el, ['foo', 'bar']);
			expect(el.classList.contains('foo')).toBe(true);
			expect(el.classList.contains('bar')).toBe(true);
		});

		it('skips empty strings', () => {
			const player = createMockPlayer();
			const el = document.createElement('div');
			player.addClasses(el, ['valid', '', 'also-valid']);
			expect(el.classList.contains('valid')).toBe(true);
			expect(el.classList.contains('also-valid')).toBe(true);
			expect(el.classList).toHaveLength(2);
		});

		it('returns chainable object', () => {
			const player = createMockPlayer();
			const el = document.createElement('div');
			const result = player.addClasses(el, ['foo']);
			expect(result.get()).toBe(el);
			expect(typeof result.appendTo).toBe('function');
			expect(typeof result.prependTo).toBe('function');
			expect(typeof result.addClasses).toBe('function');
		});
	});

	describe('displayMessage()', () => {
		it('emits display-message', () => {
			const player = createMockPlayer();
			player.displayMessage('Hello');
			expect(player.emit).toHaveBeenCalledWith('display-message', 'Hello');
		});

		it('emits remove-message after timeout', async () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			player.displayMessage('Hello', 100);
			vi.advanceTimersByTime(100);
			expect(player.emit).toHaveBeenCalledWith('remove-message', 'Hello');
			vi.useRealTimers();
		});

		it('clears previous timeout on rapid calls', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			player.displayMessage('First', 1000);
			player.displayMessage('Second', 1000);
			vi.advanceTimersByTime(1000);
			// Only 'Second' should be in the remove-message call
			const removeCalls = player.emit.mock.calls.filter(
				(c: any[]) => c[0] === 'remove-message',
			);
			expect(removeCalls).toHaveLength(1);
			expect(removeCalls[0][1]).toBe('Second');
			vi.useRealTimers();
		});
	});

	describe('snakeToCamel()', () => {
		it('converts snake_case to camelCase', () => {
			const player = createMockPlayer();
			expect(player.snakeToCamel('hello_world')).toBe('helloWorld');
		});

		it('handles multiple underscores', () => {
			const player = createMockPlayer();
			expect(player.snakeToCamel('my_long_variable_name')).toBe('myLongVariableName');
		});

		it('returns unchanged if no underscores', () => {
			const player = createMockPlayer();
			expect(player.snakeToCamel('hello')).toBe('hello');
		});
	});

	describe('spaceToCamel()', () => {
		it('converts space-separated to camelCase', () => {
			const player = createMockPlayer();
			expect(player.spaceToCamel('hello world')).toBe('helloWorld');
		});
	});

	describe('isNumber()', () => {
		it('returns true for numbers', () => {
			const player = createMockPlayer();
			expect(player.isNumber(42)).toBe(true);
			expect(player.isNumber('42')).toBe(true);
		});

		it('returns false for non-numbers', () => {
			const player = createMockPlayer();
			expect(player.isNumber('abc')).toBe(false);
			expect(player.isNumber(undefined)).toBe(false);
		});
	});

	describe('getButtonKeyCode()', () => {
		it('returns (SPACE) for play', () => {
			const player = createMockPlayer();
			expect(player.getButtonKeyCode('play')).toBe('(SPACE)');
		});

		it('returns (m) for volume buttons', () => {
			const player = createMockPlayer();
			expect(player.getButtonKeyCode('volumeMuted')).toBe('(m)');
			expect(player.getButtonKeyCode('volumeLow')).toBe('(m)');
		});

		it('returns (f) for fullscreen', () => {
			const player = createMockPlayer();
			expect(player.getButtonKeyCode('fullscreen')).toBe('(f)');
		});

		it('returns empty string for unknown', () => {
			const player = createMockPlayer();
			expect(player.getButtonKeyCode('unknown')).toBe('');
		});
	});

	describe('getParameterByName()', () => {
		it('extracts parameter from URL', () => {
			const player = createMockPlayer();
			const result = player.getParameterByName('item', 'http://example.com?item=5');
			expect(result).toBe(5);
		});

		it('returns string for non-numeric values', () => {
			const player = createMockPlayer();
			const result = player.getParameterByName('name', 'http://example.com?name=test');
			expect(result).toBe('test');
		});

		it('returns null when not found', () => {
			const player = createMockPlayer();
			const result = player.getParameterByName('missing', 'http://example.com?other=1');
			expect(result).toBeNull();
		});
	});

	describe('appendScriptFilesToDocument()', () => {
		it('rejects for unsupported file type', async () => {
			const player = createMockPlayer();
			await expect(player.appendScriptFilesToDocument('file.txt')).rejects.toThrow('Unsupported file type');
		});

		it('accepts string and array input', async () => {
			const player = createMockPlayer();
			// Should not throw for valid file extensions (may not load in test env)
			const promise = player.appendScriptFilesToDocument(['test.js']);
			expect(promise).toBeInstanceOf(Promise);
			// happy-dom may reject script loading — catch to avoid unhandled rejection
			await promise.catch(() => {});
		});
	});

	describe('doubleTap()', () => {
		it('returns a function', () => {
			const player = createMockPlayer();
			const handler = player.doubleTap(vi.fn());
			expect(typeof handler).toBe('function');
		});
	});

	describe('isMobile()', () => {
		it('returns a boolean', () => {
			const player = createMockPlayer();
			expect(typeof player.isMobile()).toBe('boolean');
		});
	});

	describe('isTv()', () => {
		it('returns a boolean', () => {
			const player = createMockPlayer();
			expect(typeof player.isTv()).toBe('boolean');
		});
	});
});
