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
		it('emits message', () => {
			const player = createMockPlayer();
			player.displayMessage('Hello');
			expect(player.emit).toHaveBeenCalledWith('message', 'Hello');
		});

		it('emits message-dismiss after timeout', async () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			player.displayMessage('Hello', 100);
			vi.advanceTimersByTime(100);
			expect(player.emit).toHaveBeenCalledWith('message-dismiss', 'Hello');
			vi.useRealTimers();
		});

		it('clears previous timeout on rapid calls', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			player.displayMessage('First', 1000);
			player.displayMessage('Second', 1000);
			vi.advanceTimersByTime(1000);
			// Only 'Second' should be in the message-dismiss call
			const removeCalls = player.emit.mock.calls.filter(
				(c: any[]) => c[0] === 'message-dismiss',
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

	describe('debounce()', () => {
		it('returns a function', () => {
			const player = createMockPlayer();
			const fn = vi.fn();
			const debounced = player.debounce(fn, 100);
			expect(typeof debounced).toBe('function');
		});

		it('does not call function immediately', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			const fn = vi.fn();
			const debounced = player.debounce(fn, 200);
			debounced();
			expect(fn).not.toHaveBeenCalled();
			vi.useRealTimers();
		});

		it('calls function after wait period', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			const fn = vi.fn();
			const debounced = player.debounce(fn, 200);
			debounced();
			vi.advanceTimersByTime(200);
			expect(fn).toHaveBeenCalledOnce();
			vi.useRealTimers();
		});

		it('resets timer on subsequent calls', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			const fn = vi.fn();
			const debounced = player.debounce(fn, 200);
			debounced();
			vi.advanceTimersByTime(100);
			debounced(); // reset
			vi.advanceTimersByTime(100);
			expect(fn).not.toHaveBeenCalled();
			vi.advanceTimersByTime(100);
			expect(fn).toHaveBeenCalledOnce();
			vi.useRealTimers();
		});

		it('passes arguments to the debounced function', () => {
			vi.useFakeTimers();
			const player = createMockPlayer();
			const fn = vi.fn();
			const debounced = player.debounce(fn, 100);
			debounced('arg1', 'arg2');
			vi.advanceTimersByTime(100);
			expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
			vi.useRealTimers();
		});
	});

	describe('isInViewport()', () => {
		it('returns a boolean', () => {
			const player = createMockPlayer();
			const result = player.isInViewport();
			expect(typeof result).toBe('boolean');
		});

		it('returns true when video element is in viewport (default position)', () => {
			const player = createMockPlayer();
			// In happy-dom, elements at default position (0,0) with 0 dimensions
			// The check is (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0)
			// and (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)
			// For a 0x0 element at 0,0: (0 <= height) && (0 >= 0) && (0 <= width) && (0 >= 0) = true
			expect(player.isInViewport()).toBe(true);
		});
	});

	describe('getClosestSeekableInterval()', () => {
		it('returns start of interval containing currentTime', () => {
			const player = createMockPlayer({
				currentTime: vi.fn(() => 15),
				previewTime: [
					{ start: 0, end: 10 },
					{ start: 10, end: 20 },
					{ start: 20, end: 30 },
				],
			});
			expect(player.getClosestSeekableInterval()).toBe(10);
		});

		it('returns start of first interval for time at start', () => {
			const player = createMockPlayer({
				currentTime: vi.fn(() => 0),
				previewTime: [
					{ start: 0, end: 10 },
					{ start: 10, end: 20 },
				],
			});
			expect(player.getClosestSeekableInterval()).toBe(0);
		});

		it('returns undefined when currentTime is outside all intervals', () => {
			const player = createMockPlayer({
				currentTime: vi.fn(() => 50),
				previewTime: [
					{ start: 0, end: 10 },
					{ start: 10, end: 20 },
				],
			});
			expect(player.getClosestSeekableInterval()).toBeUndefined();
		});

		it('returns undefined when previewTime is empty', () => {
			const player = createMockPlayer({
				currentTime: vi.fn(() => 5),
				previewTime: [],
			});
			expect(player.getClosestSeekableInterval()).toBeUndefined();
		});

		it('does not match when currentTime equals end (exclusive)', () => {
			const player = createMockPlayer({
				currentTime: vi.fn(() => 10),
				previewTime: [
					{ start: 0, end: 10 },
					{ start: 10, end: 20 },
				],
			});
			// currentTime=10 is >= 10 start and < 20 end, so matches second interval
			expect(player.getClosestSeekableInterval()).toBe(10);
		});
	});

	describe('nearestValue()', () => {
		it('finds exact match', () => {
			const player = createMockPlayer();
			expect(player.nearestValue([10, 20, 30], 20)).toBe(20);
		});

		it('finds nearest lower value', () => {
			const player = createMockPlayer();
			expect(player.nearestValue([10, 20, 30], 22)).toBe(20);
		});

		it('finds nearest higher value', () => {
			const player = createMockPlayer();
			expect(player.nearestValue([10, 20, 30], 28)).toBe(30);
		});

		it('handles single element array', () => {
			const player = createMockPlayer();
			expect(player.nearestValue([42], 100)).toBe(42);
		});

		it('handles negative values', () => {
			const player = createMockPlayer();
			expect(player.nearestValue([-10, 0, 10], -7)).toBe(-10);
		});
	});
});
