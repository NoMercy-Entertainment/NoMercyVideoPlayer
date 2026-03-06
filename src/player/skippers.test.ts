import { describe, expect, it, vi } from 'vitest';
import { skipperMethods } from './skippers';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		_skippers: {
			cues: [
				{ id: '1', text: 'Intro', startTime: 0, endTime: 30 },
				{ id: '2', text: 'Recap', startTime: 30, endTime: 60 },
				{ id: '3', text: 'Outro', startTime: 200, endTime: 240 },
			],
		},
		currentSkipFile: '',
		currentTime: vi.fn(() => 35),
		duration: vi.fn(() => 240),
		emit: vi.fn(),
		once: vi.fn(),
		getFileContents: vi.fn(() => Promise.resolve()),
		playlistItem: vi.fn(() => ({
			tracks: [{ kind: 'skippers', file: 'skip.vtt', id: 0 }],
		})),
		...overrides,
	};

	for (const [key, value] of Object.entries(skipperMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('skipperMethods', () => {
	describe('skippers()', () => {
		it('maps cues to Skipper[] with correct shape', () => {
			const player = createMockPlayer();
			const skippers = player.skippers();
			expect(skippers).toHaveLength(3);
			expect(skippers[0]).toMatchObject({
				id: 'Skip 0',
				title: 'Intro',
				startTime: 0,
				endTime: 30,
				type: 'Intro',
			});
		});

		it('returns empty array when no skippers data', () => {
			const player = createMockPlayer({ _skippers: {} });
			expect(player.skippers()).toEqual([]);
		});

		it('returns empty array when _skippers is undefined', () => {
			const player = createMockPlayer({ _skippers: undefined });
			expect(player.skippers()).toEqual([]);
		});
	});

	describe('skip()', () => {
		it('finds current skip at given time', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 35);
			const skip = player.skip();
			expect(skip?.title).toBe('Recap');
		});

		it('returns undefined when no skip at current time', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 100);
			expect(player.skip()).toBeUndefined();
		});

		it('finds skip at exact start time', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 0);
			const skip = player.skip();
			expect(skip?.title).toBe('Intro');
		});

		it('finds skip at exact end time', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 31);
			const skip = player.skip();
			expect(skip?.title).toBe('Recap');
		});
	});

	describe('skipFile()', () => {
		it('returns skipper track file', () => {
			const player = createMockPlayer();
			expect(player.skipFile()).toBe('skip.vtt');
		});

		it('returns undefined when no skipper track', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({ tracks: [] })),
			});
			expect(player.skipFile()).toBeUndefined();
		});

		it('returns undefined when no tracks at all', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({})),
			});
			expect(player.skipFile()).toBeUndefined();
		});
	});
});
