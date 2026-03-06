import { describe, expect, it } from 'vitest';
import { playlistMethods } from './playlist';
import type { SubtitleTrack, Track } from '../types';

function createMockPlayer(tracks: Track[] = []) {
	const player: any = {
		_playlist: [],
		currentPlaylistItem: {
			tracks,
		},
		currentIndex: 0,
	};

	// Bind methods
	player.playlistItem = function (index?: number) {
		if (index === undefined)
			return this.currentPlaylistItem;
	};

	player.tracks = playlistMethods.tracks.bind(player);

	return player;
}

const sampleTracks: Track[] = [
	{ kind: 'subtitles', file: 'eng.full.vtt', label: 'English', language: 'eng', id: 0 },
	{ kind: 'subtitles', file: 'nld.full.vtt', label: 'Dutch', language: 'nld', id: 1 },
	{ kind: 'chapters', file: 'chapters.vtt', id: 2 },
	{ kind: 'thumbnails', file: 'thumbs.vtt', id: 3 },
	{ kind: 'skippers', file: 'skip.vtt', id: 4 },
	{ kind: 'fonts', file: 'custom.ttf', id: 5 },
] as Track[];

describe('playlist tracks()', () => {
	it('returns all tracks when no kind specified', () => {
		const player = createMockPlayer(sampleTracks);
		const result = player.tracks();
		expect(result).toHaveLength(6);
	});

	it('filters subtitles', () => {
		const player = createMockPlayer(sampleTracks);
		const result = player.tracks('subtitles');
		expect(result).toHaveLength(2);
		result.forEach((t: SubtitleTrack) => {
			expect(t.kind).toBe('subtitles');
			// SubtitleTrack has required label and language
			expect(t.label).toBeDefined();
			expect(t.language).toBeDefined();
		});
	});

	it('filters chapters', () => {
		const player = createMockPlayer(sampleTracks);
		const result = player.tracks('chapters');
		expect(result).toHaveLength(1);
		expect(result[0].kind).toBe('chapters');
	});

	it('filters thumbnails', () => {
		const player = createMockPlayer(sampleTracks);
		expect(player.tracks('thumbnails')).toHaveLength(1);
	});

	it('filters skippers', () => {
		const player = createMockPlayer(sampleTracks);
		expect(player.tracks('skippers')).toHaveLength(1);
	});

	it('filters fonts', () => {
		const player = createMockPlayer(sampleTracks);
		expect(player.tracks('fonts')).toHaveLength(1);
	});

	it('returns empty when no tracks match', () => {
		const player = createMockPlayer(sampleTracks);
		expect(player.tracks('sprite')).toHaveLength(0);
	});

	it('returns empty array when playlistItem has no tracks', () => {
		const player = createMockPlayer();
		expect(player.tracks()).toEqual([]);
	});
});
