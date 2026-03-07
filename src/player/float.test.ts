import { describe, expect, it, vi } from 'vitest';
import { floatMethods } from './float';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');

	const player: any = {
		container,
		shouldFloat: false,
		isPlaying: false,
		options: {},
		emit: vi.fn(),
		isMobile: vi.fn(() => false),
		...overrides,
	};

	for (const [key, value] of Object.entries(floatMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('floatMethods', () => {
	describe('float() getter', () => {
		it('returns false by default', () => {
			const player = createMockPlayer();
			expect(player.float()).toBe(false);
		});

		it('returns true when floating', () => {
			const player = createMockPlayer({ shouldFloat: true });
			expect(player.float()).toBe(true);
		});
	});

	describe('float() setter', () => {
		it('sets floating state and adds CSS class', () => {
			const player = createMockPlayer();
			player.float(true);
			expect(player.shouldFloat).toBe(true);
			expect(player.container.classList.contains('floating')).toBe(true);
			expect(player.container.classList.contains('not-floating')).toBe(false);
			expect(player.emit).toHaveBeenCalledWith('float', true);
		});

		it('removes floating state and adds not-floating class', () => {
			const player = createMockPlayer({ shouldFloat: true });
			player.container.classList.add('floating');
			player.float(false);
			expect(player.shouldFloat).toBe(false);
			expect(player.container.classList.contains('not-floating')).toBe(true);
			expect(player.container.classList.contains('floating')).toBe(false);
			expect(player.emit).toHaveBeenCalledWith('float', false);
		});

		it('does not emit when value unchanged', () => {
			const player = createMockPlayer({ shouldFloat: false });
			player.float(false);
			expect(player.emit).not.toHaveBeenCalled();
		});
	});

	describe('_initFloatObserver()', () => {
		it('does nothing when float config is not set', () => {
			const player = createMockPlayer({ options: {} });
			player._initFloatObserver();
			expect(player._floatObserver).toBeUndefined();
		});

		it('does nothing on mobile', () => {
			const player = createMockPlayer({
				options: { float: true },
				isMobile: vi.fn(() => true),
			});
			player._initFloatObserver();
			expect(player._floatObserver).toBeUndefined();
		});

		it('creates IntersectionObserver when float is enabled', () => {
			const observe = vi.fn();
			const MockObserver = vi.fn(function (this: any) {
				this.observe = observe;
				this.disconnect = vi.fn();
			});
			vi.stubGlobal('IntersectionObserver', MockObserver);

			const player = createMockPlayer({ options: { float: true } });
			player._initFloatObserver();
			expect(player._floatObserver).toBeDefined();
			expect(observe).toHaveBeenCalledWith(player.container);

			vi.unstubAllGlobals();
		});
	});

	describe('_destroyFloatObserver()', () => {
		it('disconnects observer', () => {
			const disconnect = vi.fn();
			const player = createMockPlayer();
			player._floatObserver = { disconnect };
			player._destroyFloatObserver();
			expect(disconnect).toHaveBeenCalled();
			expect(player._floatObserver).toBeUndefined();
		});

		it('does nothing when no observer exists', () => {
			const player = createMockPlayer();
			expect(() => player._destroyFloatObserver()).not.toThrow();
		});
	});
});
