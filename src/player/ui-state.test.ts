import { describe, expect, it, vi } from 'vitest';
import { uiStateMethods } from './ui-state';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');

	const player: any = {
		container,
		lockActive: false,
		inactivityTimeout: undefined as any,
		inactivityTime: 3000,
		emit: vi.fn(),
		...overrides,
	};

	for (const [key, value] of Object.entries(uiStateMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('uiStateMethods', () => {
	describe('ui_addActiveClass()', () => {
		it('adds active class and removes inactive', () => {
			const player = createMockPlayer();
			player.container.classList.add('inactive');
			player.ui_addActiveClass();
			expect(player.container.classList.contains('active')).toBe(true);
			expect(player.container.classList.contains('inactive')).toBe(false);
		});

		it('emits active true', () => {
			const player = createMockPlayer();
			player.ui_addActiveClass();
			expect(player.emit).toHaveBeenCalledWith('active', true);
		});
	});

	describe('ui_removeActiveClass()', () => {
		it('adds inactive class and removes active', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			player.ui_removeActiveClass();
			expect(player.container.classList.contains('inactive')).toBe(true);
			expect(player.container.classList.contains('active')).toBe(false);
		});

		it('emits active false', () => {
			const player = createMockPlayer();
			player.ui_removeActiveClass();
			expect(player.emit).toHaveBeenCalledWith('active', false);
		});
	});

	describe('ui_resetInactivityTimer()', () => {
		it('adds active class immediately', () => {
			const player = createMockPlayer();
			player.ui_resetInactivityTimer();
			expect(player.container.classList.contains('active')).toBe(true);
		});

		it('removes active class after inactivity timeout', () => {
			vi.useFakeTimers();
			const player = createMockPlayer({ inactivityTime: 100 });
			player.ui_resetInactivityTimer();
			expect(player.container.classList.contains('active')).toBe(true);

			vi.advanceTimersByTime(100);
			expect(player.container.classList.contains('inactive')).toBe(true);
			expect(player.container.classList.contains('active')).toBe(false);
			vi.useRealTimers();
		});

		it('clears previous timeout on reset', () => {
			vi.useFakeTimers();
			const player = createMockPlayer({ inactivityTime: 100 });
			player.ui_resetInactivityTimer();
			vi.advanceTimersByTime(50);
			player.ui_resetInactivityTimer(); // reset
			vi.advanceTimersByTime(50);
			// Should still be active because we reset
			expect(player.container.classList.contains('active')).toBe(true);

			vi.advanceTimersByTime(50);
			expect(player.container.classList.contains('inactive')).toBe(true);
			vi.useRealTimers();
		});

		it('does not schedule timeout when lockActive is true', () => {
			vi.useFakeTimers();
			const player = createMockPlayer({ lockActive: true, inactivityTime: 100 });
			player.ui_resetInactivityTimer();
			vi.advanceTimersByTime(200);
			// Should still be active
			expect(player.container.classList.contains('active')).toBe(true);
			expect(player.container.classList.contains('inactive')).toBe(false);
			vi.useRealTimers();
		});
	});

	describe('handleMouseLeave()', () => {
		it('removes active class on mouse leave', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			const event = new MouseEvent('mouseleave', { relatedTarget: null });
			player.handleMouseLeave(event);
			expect(player.container.classList.contains('inactive')).toBe(true);
		});

		it('keeps active when leaving to a button', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			const button = document.createElement('button');
			const event = new MouseEvent('mouseleave', { relatedTarget: button });
			player.handleMouseLeave(event);
			expect(player.container.classList.contains('active')).toBe(true);
		});

		it('keeps active when leaving to an input', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			const input = document.createElement('input');
			const event = new MouseEvent('mouseleave', { relatedTarget: input });
			player.handleMouseLeave(event);
			expect(player.container.classList.contains('active')).toBe(true);
		});

		it('does nothing when lockActive is true', () => {
			const player = createMockPlayer({ lockActive: true });
			player.container.classList.add('active');
			const event = new MouseEvent('mouseleave', { relatedTarget: null });
			player.handleMouseLeave(event);
			expect(player.container.classList.contains('active')).toBe(true);
		});
	});

	describe('handleMouseEnter()', () => {
		it('adds active class when entering a button', () => {
			const player = createMockPlayer();
			const button = document.createElement('button');
			const event = new MouseEvent('mouseenter', { target: button } as any);
			Object.defineProperty(event, 'target', { value: button });
			player.handleMouseEnter(event);
			expect(player.container.classList.contains('active')).toBe(true);
		});

		it('adds active class when entering an input', () => {
			const player = createMockPlayer();
			const input = document.createElement('input');
			const event = new MouseEvent('mouseenter');
			Object.defineProperty(event, 'target', { value: input });
			player.handleMouseEnter(event);
			expect(player.container.classList.contains('active')).toBe(true);
		});
	});
});
