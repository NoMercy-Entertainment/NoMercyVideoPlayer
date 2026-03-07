import { describe, expect, it, vi } from 'vitest';
import { qualityMethods } from './quality';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		hls: {
			currentLevel: 1,
			nextLevel: -1,
			levels: [
				{ name: '720p', width: 1280, height: 720, _attrs: [{ 'VIDEO-RANGE': 'SDR' }] },
				{ name: '1080p', width: 1920, height: 1080, _attrs: [{ 'VIDEO-RANGE': 'SDR' }] },
			],
		},
		logger: { warn: vi.fn() },
		hdrSupported: vi.fn(() => false),
		...overrides,
	};

	for (const [key, value] of Object.entries(qualityMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('qualityMethods', () => {
	describe('quality() getter', () => {
		it('returns current HLS level', () => {
			const player = createMockPlayer();
			expect(player.quality()).toBe(1);
		});

		it('returns -1 when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			expect(player.quality()).toBe(-1);
		});
	});

	describe('quality(index) setter', () => {
		it('sets hls.nextLevel', () => {
			const player = createMockPlayer();
			player.quality(0);
			expect(player.hls.nextLevel).toBe(0);
		});

		it('accepts -1 for auto', () => {
			const player = createMockPlayer();
			player.quality(-1);
			expect(player.hls.nextLevel).toBe(-1);
		});

		it('warns on out-of-bounds index', () => {
			const player = createMockPlayer();
			player.quality(99);
			expect(player.logger.warn).toHaveBeenCalledWith(
				'quality() index out of bounds',
				expect.objectContaining({ index: 99 }),
			);
		});

		it('does nothing when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			player.quality(0); // should not throw
		});
	});

	describe('qualityLevels()', () => {
		it('returns only real levels (no Auto entry)', () => {
			const player = createMockPlayer();
			const levels = player.qualityLevels();
			expect(levels).toHaveLength(2);
			expect(levels[0]).toMatchObject({ id: 0, label: '720p' });
			expect(levels[1]).toMatchObject({ id: 1, label: '1080p' });
		});

		it('returns empty array when no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			expect(player.qualityLevels()).toEqual([]);
		});

		it('filters PQ when HDR not supported', () => {
			const player = createMockPlayer({
				hls: {
					currentLevel: 0,
					nextLevel: -1,
					levels: [
						{ name: '1080p SDR', _attrs: [{ 'VIDEO-RANGE': 'SDR' }] },
						{ name: '1080p HDR', _attrs: [{ 'VIDEO-RANGE': 'PQ' }] },
					],
				},
				hdrSupported: vi.fn(() => false),
			});
			const levels = player.qualityLevels();
			expect(levels).toHaveLength(1);
			expect(levels[0].label).toBe('1080p SDR');
		});

		it('includes PQ when HDR supported', () => {
			const player = createMockPlayer({
				hls: {
					currentLevel: 0,
					nextLevel: -1,
					levels: [
						{ name: '1080p SDR', _attrs: [{ 'VIDEO-RANGE': 'SDR' }] },
						{ name: '1080p HDR', _attrs: [{ 'VIDEO-RANGE': 'PQ' }] },
					],
				},
				hdrSupported: vi.fn(() => true),
			});
			const levels = player.qualityLevels();
			expect(levels).toHaveLength(2);
		});
	});

	describe('hasQualities()', () => {
		it('returns true with multiple levels', () => {
			const player = createMockPlayer();
			expect(player.hasQualities()).toBe(true);
		});

		it('returns false with no HLS', () => {
			const player = createMockPlayer({ hls: undefined });
			expect(player.hasQualities()).toBe(false);
		});
	});
});
