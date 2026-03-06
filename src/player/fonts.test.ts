import { describe, expect, it, vi } from 'vitest';
import { fontMethods } from './fonts';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		fonts: [],
		currentFontFile: '',
		emit: vi.fn(),
		logger: { error: vi.fn() },
		getFileContents: vi.fn(() => Promise.resolve()),
		playlistItem: vi.fn(() => ({
			tracks: [{ kind: 'fonts', file: 'fonts.json', id: 0 }],
		})),
		...overrides,
	};

	for (const [key, value] of Object.entries(fontMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('fontMethods', () => {
	describe('fontsFile()', () => {
		it('returns fonts track file', () => {
			const player = createMockPlayer();
			expect(player.fontsFile()).toBe('fonts.json');
		});

		it('returns undefined when no fonts track', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({ tracks: [] })),
			});
			expect(player.fontsFile()).toBeUndefined();
		});

		it('returns undefined when no tracks', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({})),
			});
			expect(player.fontsFile()).toBeUndefined();
		});
	});

	describe('fetchFontFile()', () => {
		it('calls getFileContents when file exists and changed', async () => {
			const player = createMockPlayer();
			await player.fetchFontFile();
			expect(player.getFileContents).toHaveBeenCalledWith(
				expect.objectContaining({ url: 'fonts.json' }),
			);
		});

		it('skips fetch when file has not changed', async () => {
			const player = createMockPlayer({ currentFontFile: 'fonts.json' });
			await player.fetchFontFile();
			expect(player.getFileContents).not.toHaveBeenCalled();
		});

		it('skips fetch when no fonts file', async () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({ tracks: [] })),
			});
			await player.fetchFontFile();
			expect(player.getFileContents).not.toHaveBeenCalled();
		});

		it('updates currentFontFile', async () => {
			const player = createMockPlayer();
			await player.fetchFontFile();
			expect(player.currentFontFile).toBe('fonts.json');
		});
	});
});
