import { describe, expect, it, vi } from 'vitest';
import { theaterMethods } from './theater';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');

	const player: any = {
		container,
		_theaterMode: false,
		options: {},
		emit: vi.fn(),
		storage: {
			set: vi.fn(() => Promise.resolve()),
			get: vi.fn(() => Promise.resolve(false)),
		},
		...overrides,
	};

	for (const [key, value] of Object.entries(theaterMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('theaterMethods', () => {
	describe('theater() getter', () => {
		it('returns false by default', () => {
			const player = createMockPlayer();
			expect(player.theater()).toBe(false);
		});

		it('returns true when in theater mode', () => {
			const player = createMockPlayer({ _theaterMode: true });
			expect(player.theater()).toBe(true);
		});
	});

	describe('theater() setter', () => {
		it('sets theater mode and adds CSS class', () => {
			const player = createMockPlayer();
			player.theater(true);
			expect(player._theaterMode).toBe(true);
			expect(player.container.classList.contains('theater')).toBe(true);
			expect(player.container.classList.contains('not-theater')).toBe(false);
			expect(player.emit).toHaveBeenCalledWith('theater', true);
		});

		it('removes theater mode and adds not-theater class', () => {
			const player = createMockPlayer({ _theaterMode: true });
			player.container.classList.add('theater');
			player.theater(false);
			expect(player._theaterMode).toBe(false);
			expect(player.container.classList.contains('not-theater')).toBe(true);
			expect(player.container.classList.contains('theater')).toBe(false);
			expect(player.emit).toHaveBeenCalledWith('theater', false);
		});

		it('does not emit when value unchanged', () => {
			const player = createMockPlayer({ _theaterMode: false });
			player.theater(false);
			expect(player.emit).not.toHaveBeenCalled();
		});

		it('persists state to storage', () => {
			const player = createMockPlayer();
			player.theater(true);
			expect(player.storage.set).toHaveBeenCalledWith('theater', true);
		});
	});

	describe('_initTheater()', () => {
		it('does nothing when theater config is not set', () => {
			const player = createMockPlayer({ options: {} });
			player._initTheater();
			expect(player.storage.get).not.toHaveBeenCalled();
		});

		it('restores theater state from storage', async () => {
			const player = createMockPlayer({
				options: { theater: true },
				storage: {
					get: vi.fn(() => Promise.resolve(true)),
					set: vi.fn(() => Promise.resolve()),
				},
			});
			player._initTheater();
			await vi.waitFor(() => {
				expect(player.storage.get).toHaveBeenCalledWith('theater', false);
			});
		});
	});
});
