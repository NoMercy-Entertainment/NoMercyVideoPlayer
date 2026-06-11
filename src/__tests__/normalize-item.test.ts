/**
 * Built-in wire-format normalizer tests.
 *
 * `normalizeVideoPlaylistItem` must:
 *   - Accept the v1 / NoMercy server format (file, "H:MM:SS" duration,
 *     ms-based chapters, {time, date} progress, tracks[]) and produce the
 *     canonical v2 shape.
 *   - Be idempotent: canonical input passes through unchanged.
 */

import type { VideoPlaylistItem } from '../types';
import { describe, expect, it } from 'vitest';
import { normalizeVideoPlaylistItem } from '../player/normalize-item';
import { pickStartItem } from '../player/start-selection';

const SERVER_ROW = {
	id: 4237712,
	title: 'Maomao',
	file: '/01HQ/show/episode/video.m3u8',
	duration: '24:14',
	progress: { time: 600, date: '2026-06-10T12:00:00Z' },
	chapters: [
		{ id: 0, start_time: 0, end_time: 90006, title: 'Opening' },
		{ id: 1, start_time: 90006, end_time: 825991, title: 'Part A' },
	],
	tracks: [
		{ file: '/chapters.vtt', kind: 'chapters' },
		{ file: '/fonts.json', kind: 'fonts' },
		{ file: '/fonts.json', kind: 'fonts' },
		{ file: '/thumbs.vtt', kind: 'thumbnails' },
		{ file: '/eng.full.ass', kind: 'subtitles', label: 'full', language: 'eng' },
		{ file: '/eng.sign.ass', kind: 'subtitles', label: 'sign', language: 'eng' },
	],
} as unknown as VideoPlaylistItem;

describe('normalizeVideoPlaylistItem()', () => {
	it('normalizes the full server wire format', () => {
		const item = normalizeVideoPlaylistItem(SERVER_ROW);

		expect(item.url).toBe('/01HQ/show/episode/video.m3u8');
		expect(item.duration).toBe(24 * 60 + 14);
		expect(item.chapters).toEqual([
			{ index: 0, start: 0, end: 90.006, title: 'Opening' },
			{ index: 1, start: 90.006, end: 825.991, title: 'Part A' },
		]);
		expect(item.progress).toEqual({
			timestamp: Date.parse('2026-06-10T12:00:00Z'),
			percentage: (600 / (24 * 60 + 14)) * 100,
			time: 600,
		});
		expect(item.previewSpriteUrl).toBe('/thumbs.vtt');
		expect(item.fonts).toEqual([{ file: '/fonts.json' }]);
	});

	it('marks subtitle variants with type from label, keeping tracks intact', () => {
		const item = normalizeVideoPlaylistItem(SERVER_ROW) as VideoPlaylistItem & {
			tracks: Array<{ kind?: string; label?: string; type?: string }>;
		};

		const subtitleTracks = item.tracks.filter(track => track.kind === 'subtitles');
		expect(subtitleTracks.map(track => track.type)).toEqual(['full', 'sign']);
		expect(item.tracks).toHaveLength(6);
	});

	it('is idempotent — canonical input passes through unchanged', () => {
		const canonical: VideoPlaylistItem = {
			id: 1,
			url: 'https://cdn.test/video.m3u8',
			duration: 1454,
			chapters: [{ index: 0, start: 0, end: 90.006, title: 'Opening' }],
			progress: { timestamp: 1765360800000, percentage: 41, time: 600 },
			previewSpriteUrl: 'https://cdn.test/thumbs.vtt',
			fonts: [{ file: 'https://cdn.test/fonts.json' }],
		};

		expect(normalizeVideoPlaylistItem(canonical)).toEqual(canonical);
		expect(normalizeVideoPlaylistItem(normalizeVideoPlaylistItem(SERVER_ROW)))
			.toEqual(normalizeVideoPlaylistItem(SERVER_ROW));
	});

	it('tolerates minimal items', () => {
		const item = normalizeVideoPlaylistItem({ id: 1, url: 'https://cdn.test/a.mp4' });
		expect(item.url).toBe('https://cdn.test/a.mp4');
		expect(item.progress).toBeUndefined();
		expect(item.chapters).toBeUndefined();
	});
});

describe('pickStartItem()', () => {
	const item = (id: number, progress?: { timestamp: number; percentage: number; time?: number }): VideoPlaylistItem =>
		({ id, url: `https://cdn.test/${id}.m3u8`, progress });

	it('starts at 0 when nothing carries progress', () => {
		expect(pickStartItem([item(1), item(2)])).toEqual({ index: 0 });
	});

	it('resumes the most recently watched item at its saved position', () => {
		const items = [
			item(1, { timestamp: 100, percentage: 50, time: 300 }),
			item(2, { timestamp: 200, percentage: 30, time: 120 }),
			item(3),
		];
		expect(pickStartItem(items)).toEqual({ index: 1, resumeTime: 120 });
	});

	it('rolls over to the next item past 90%', () => {
		const items = [
			item(1, { timestamp: 200, percentage: 95, time: 1400 }),
			item(2),
		];
		expect(pickStartItem(items)).toEqual({ index: 1 });
	});

	it('clamps the rollover at the last item', () => {
		const items = [
			item(1),
			item(2, { timestamp: 200, percentage: 95, time: 1400 }),
		];
		expect(pickStartItem(items)).toEqual({ index: 1 });
	});
});
