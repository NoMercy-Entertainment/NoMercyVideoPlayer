import { describe, expect, it, vi } from 'vitest';
import { audioMethods } from './audio';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		hls: {
			audioTrack: 0,
			audioTracks: [
				{ name: 'English', lang: 'eng' },
				{ name: 'Dutch', lang: 'nld' },
			],
		},
		storage: {
			get: vi.fn(() => Promise.resolve(null)),
			set: vi.fn(() => Promise.resolve()),
		},
		logger: { warn: vi.fn(), debug: vi.fn() },
		emit: vi.fn(),
		localize: vi.fn((s: string) => s),
		displayMessage: vi.fn(),
		options: { disableAutoPlayback: false },
		...overrides,
	};

	// Bind methods
	for (const [key, value] of Object.entries(audioMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('audioMethods', () => {
	describe('audioTracks()', () => {
		it('maps HLS audioTracks to AudioTrack[]', () => {
			const player = createMockPlayer();
			const tracks = player.audioTracks();
			expect(tracks).toEqual([
				{ id: 0, language: 'eng', label: 'English', name: 'English' },
				{ id: 1, language: 'nld', label: 'Dutch', name: 'Dutch' },
			]);
		});

		it('returns empty array when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			expect(player.audioTracks()).toEqual([]);
		});
	});

	describe('audioTrack() getter', () => {
		it('returns current track from audioTracks()', () => {
			const player = createMockPlayer();
			const track = player.audioTrack();
			expect(track).toMatchObject({ id: 0, language: 'eng' });
		});

		it('returns null when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			expect(player.audioTrack()).toBeNull();
		});
	});

	describe('audioTrack(index) setter', () => {
		it('sets hls.audioTrack and stores language', () => {
			const player = createMockPlayer();
			player.audioTrack(1);
			expect(player.hls.audioTrack).toBe(1);
			expect(player.storage.set).toHaveBeenCalledWith('audio-language', 'nld');
		});

		it('warns on out-of-bounds index', () => {
			const player = createMockPlayer();
			player.audioTrack(99);
			expect(player.logger.warn).toHaveBeenCalledWith(
				'audioTrack() index out of bounds',
				expect.objectContaining({ index: 99 }),
			);
		});

		it('does nothing when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			player.audioTrack(0);
			expect(player.storage.set).not.toHaveBeenCalled();
		});
	});

	describe('hasAudioTracks()', () => {
		it('returns true when multiple tracks', () => {
			const player = createMockPlayer();
			expect(player.hasAudioTracks()).toBe(true);
		});

		it('returns false with single track', () => {
			const player = createMockPlayer({
				hls: { audioTrack: 0, audioTracks: [{ name: 'English', lang: 'eng' }] },
			});
			expect(player.hasAudioTracks()).toBe(false);
		});
	});

	describe('cycleAudioTracks()', () => {
		it('cycles to next track', () => {
			const player = createMockPlayer();
			player.cycleAudioTracks();
			expect(player.hls.audioTrack).toBe(1);
		});

		it('wraps to 0 at end', () => {
			const player = createMockPlayer();
			player.hls.audioTrack = 1;
			player.cycleAudioTracks();
			expect(player.hls.audioTrack).toBe(0);
		});

		it('displays message', () => {
			const player = createMockPlayer();
			player.cycleAudioTracks();
			expect(player.displayMessage).toHaveBeenCalled();
		});
	});

	describe('audioTrackIndexByLanguage()', () => {
		it('finds track by language', () => {
			const player = createMockPlayer();
			expect(player.audioTrackIndexByLanguage('nld')).toBe(1);
		});

		it('returns -1 when not found', () => {
			const player = createMockPlayer();
			expect(player.audioTrackIndexByLanguage('jpn')).toBe(-1);
		});
	});
});
