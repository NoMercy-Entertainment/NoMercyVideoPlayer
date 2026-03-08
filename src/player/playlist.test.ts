import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playlistMethods } from './playlist';
import type { PlaylistItem, SubtitleTrack, Track } from '../types';

const samplePlaylistItems: PlaylistItem[] = [
	{
		id: '1',
		title: 'Episode 1',
		description: 'First episode',
		file: '/videos/s01e01.m3u8',
		image: '/images/s01e01.jpg',
		duration: '00:42:00',
		season: 1,
		episode: 1,
		seasonName: 'Season 1',
		tracks: [],
	},
	{
		id: '2',
		title: 'Episode 2',
		description: 'Second episode',
		file: '/videos/s01e02.m3u8',
		image: '/images/s01e02.jpg',
		duration: '00:44:00',
		season: 1,
		episode: 2,
		seasonName: 'Season 1',
		tracks: [],
	},
	{
		id: '3',
		title: 'Episode 3',
		description: 'Third episode',
		file: '/videos/s02e01.m3u8',
		image: '/images/s02e01.jpg',
		duration: '00:40:00',
		season: 2,
		episode: 1,
		seasonName: 'Season 2',
		tracks: [],
	},
];

const sampleTracks: Track[] = [
	{ kind: 'subtitles', file: 'eng.full.vtt', label: 'English', language: 'eng', id: 0 },
	{ kind: 'subtitles', file: 'nld.full.vtt', label: 'Dutch', language: 'nld', id: 1 },
	{ kind: 'chapters', file: 'chapters.vtt', id: 2 },
	{ kind: 'thumbnails', file: 'thumbs.vtt', id: 3 },
	{ kind: 'skippers', file: 'skip.vtt', id: 4 },
	{ kind: 'fonts', file: 'custom.ttf', id: 5 },
] as Track[];

function createMockPlayer(
	playlist: PlaylistItem[] = [...samplePlaylistItems],
	currentIndex = 0,
	tracks: Track[] = [],
) {
	const subtitleText = { textContent: '' } as HTMLElement;
	const subtitleOverlay = { style: { display: '' } } as unknown as HTMLElement;
	const videoElement = { poster: '' } as HTMLVideoElement;

	const player: any = {
		_playlist: playlist,
		_subtitles: {},
		currentPlaylistItem: playlist[currentIndex] ?? null,
		currentIndex,
		currentSubtitleFile: '',
		currentSubtitleIndex: -1,
		subtitleText,
		subtitleOverlay,
		videoElement,
		options: {
			basePath: '',
			disableAutoPlayback: false,
			autoPlay: false,
			playlist: undefined as string | PlaylistItem[] | undefined,
		},
		emit: vi.fn(),
		logger: {
			debug: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			verbose: vi.fn(),
		},
		loadSource: vi.fn(),
		resolveImageUrl: vi.fn((url: string) => url),
		subtitle: vi.fn(() => null),
		play: vi.fn(() => Promise.resolve()),
		storage: {
			get: vi.fn(() => Promise.resolve('en')),
		},
	};

	// Override tracks on the current playlist item if provided
	if (tracks.length > 0 && player.currentPlaylistItem) {
		player.currentPlaylistItem = { ...player.currentPlaylistItem, tracks };
	}

	// Bind all playlist methods
	player.playlist = playlistMethods.playlist.bind(player);
	player.tracks = playlistMethods.tracks.bind(player);
	player.playlistIndex = playlistMethods.playlistIndex.bind(player);
	player.playlistItem = playlistMethods.playlistItem.bind(player);
	player.playVideo = playlistMethods.playVideo.bind(player);
	player.loadPlaylist = playlistMethods.loadPlaylist.bind(player);
	player.setPlaylist = playlistMethods.setPlaylist.bind(player);
	player.load = playlistMethods.load.bind(player);
	player.next = playlistMethods.next.bind(player);
	player.previous = playlistMethods.previous.bind(player);
	player.setEpisode = playlistMethods.setEpisode.bind(player);
	player.isFirstPlaylistItem = playlistMethods.isFirstPlaylistItem.bind(player);
	player.isLastPlaylistItem = playlistMethods.isLastPlaylistItem.bind(player);
	player.hasPlaylists = playlistMethods.hasPlaylists.bind(player);
	player.seasons = playlistMethods.seasons.bind(player);

	return player;
}

// ─── tracks() ───────────────────────────────────────────────────────────────

describe('playlist tracks()', () => {
	it('returns all tracks when no kind specified', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		const result = player.tracks();
		expect(result).toHaveLength(6);
	});

	it('filters subtitles', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		const result = player.tracks('subtitles');
		expect(result).toHaveLength(2);
		result.forEach((t: SubtitleTrack) => {
			expect(t.kind).toBe('subtitles');
			expect(t.label).toBeDefined();
			expect(t.language).toBeDefined();
		});
	});

	it('filters chapters', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		const result = player.tracks('chapters');
		expect(result).toHaveLength(1);
		expect(result[0].kind).toBe('chapters');
	});

	it('filters thumbnails', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		expect(player.tracks('thumbnails')).toHaveLength(1);
	});

	it('filters skippers', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		expect(player.tracks('skippers')).toHaveLength(1);
	});

	it('filters fonts', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		expect(player.tracks('fonts')).toHaveLength(1);
	});

	it('returns empty when no tracks match', () => {
		const player = createMockPlayer(samplePlaylistItems, 0, sampleTracks);
		expect(player.tracks('sprite')).toHaveLength(0);
	});

	it('returns empty array when playlistItem has no tracks', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		expect(player.tracks()).toEqual([]);
	});
});

// ─── playlist() ─────────────────────────────────────────────────────────────

describe('playlist()', () => {
	it('returns the internal _playlist array', () => {
		const player = createMockPlayer();
		const result = player.playlist();
		expect(result).toBe(player._playlist);
		expect(result).toHaveLength(3);
	});

	it('returns empty array when playlist is empty', () => {
		const player = createMockPlayer([]);
		expect(player.playlist()).toEqual([]);
	});
});

// ─── playlistIndex() ────────────────────────────────────────────────────────

describe('playlistIndex()', () => {
	it('returns 0 when on the first item', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		expect(player.playlistIndex()).toBe(0);
	});

	it('returns 1 when on the second item', () => {
		const items = [...samplePlaylistItems];
		const player = createMockPlayer(items, 1);
		// currentPlaylistItem must be the same reference as _playlist[1]
		expect(player.playlistIndex()).toBe(1);
	});

	it('returns 2 when on the last item', () => {
		const items = [...samplePlaylistItems];
		const player = createMockPlayer(items, 2);
		expect(player.playlistIndex()).toBe(2);
	});

	it('returns -1 when currentPlaylistItem is not in _playlist', () => {
		const player = createMockPlayer();
		player.currentPlaylistItem = { ...samplePlaylistItems[0], id: 'orphan' };
		expect(player.playlistIndex()).toBe(-1);
	});
});

// ─── playlistItem() getter / setter ─────────────────────────────────────────

describe('playlistItem()', () => {
	it('returns currentPlaylistItem when called with no argument', () => {
		const player = createMockPlayer();
		expect(player.playlistItem()).toBe(player.currentPlaylistItem);
	});

	it('returns currentPlaylistItem when called with the current index', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const result = player.playlistItem(0);
		expect(result).toBe(player.currentPlaylistItem);
	});

	it('calls playVideo when called with a different index', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const spy = vi.spyOn(player, 'playVideo');
		player.playlistItem(2);
		expect(spy).toHaveBeenCalledWith(2);
	});
});

// ─── playVideo() ────────────────────────────────────────────────────────────

describe('playVideo()', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('sets currentPlaylistItem to the item at the given index', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(1);
		expect(player.currentPlaylistItem).toBe(player._playlist[1]);
	});

	it('resets subtitle state', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.currentSubtitleFile = 'old.vtt';
		player.currentSubtitleIndex = 3;
		player.playVideo(1);
		expect(player.currentSubtitleFile).toBe('');
		expect(player.currentSubtitleIndex).toBe(-1);
	});

	it('clears subtitle overlay text and hides it', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.subtitleText.textContent = 'old text';
		player.subtitleOverlay.style.display = 'block';
		player.playVideo(1);
		expect(player.subtitleText.textContent).toBe('');
		expect(player.subtitleOverlay.style.display).toBe('none');
	});

	it('emits subtitleChanged and captionsChanged', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(1);
		expect(player.emit).toHaveBeenCalledWith('subtitleChanged', null);
		expect(player.emit).toHaveBeenCalledWith('captionsChanged', null);
	});

	it('sets video poster from resolved image url', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.resolveImageUrl.mockReturnValue('/resolved/image.jpg');
		player.playVideo(1);
		expect(player.resolveImageUrl).toHaveBeenCalledWith(samplePlaylistItems[1].image);
		expect(player.videoElement.poster).toBe('/resolved/image.jpg');
	});

	it('sets poster to empty string when resolveImageUrl returns null', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.resolveImageUrl.mockReturnValue(null);
		player.playVideo(1);
		expect(player.videoElement.poster).toBe('');
	});

	it('emits "item" in setTimeout when index differs from currentIndex', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(1);
		// Not emitted synchronously
		expect(player.emit).not.toHaveBeenCalledWith('item', expect.anything());
		vi.runAllTimers();
		expect(player.emit).toHaveBeenCalledWith('item', player._playlist[1]);
	});

	it('does not emit "item" when index equals currentIndex', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		// playVideo(0) where currentIndex is already 0
		player.playVideo(0);
		vi.runAllTimers();
		expect(player.emit).not.toHaveBeenCalledWith('item', expect.anything());
	});

	it('updates currentIndex', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(2);
		expect(player.currentIndex).toBe(2);
	});

	it('calls loadSource with basePath + file', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.options.basePath = 'https://cdn.example.com';
		player.playVideo(1);
		expect(player.loadSource).toHaveBeenCalledWith('https://cdn.example.com/videos/s01e02.m3u8');
	});

	it('calls loadSource with just file when basePath is empty', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(1);
		expect(player.loadSource).toHaveBeenCalledWith('/videos/s01e02.m3u8');
	});

	it('logs warning for negative index', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(-1);
		expect(player.logger.warn).toHaveBeenCalledWith(
			'playVideo() index out of range',
			{ index: -1, playlistLength: 3 },
		);
		expect(player.loadSource).not.toHaveBeenCalled();
	});

	it('logs warning for index >= playlist length', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.playVideo(5);
		expect(player.logger.warn).toHaveBeenCalledWith(
			'playVideo() index out of range',
			{ index: 5, playlistLength: 3 },
		);
	});

	it('does nothing for out-of-range index (no state change)', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const original = player.currentPlaylistItem;
		player.playVideo(99);
		expect(player.currentPlaylistItem).toBe(original);
		expect(player.currentIndex).toBe(0);
	});
});

// ─── next() ─────────────────────────────────────────────────────────────────

describe('next()', () => {
	it('advances to the next playlist item', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.next();
		expect(player.currentPlaylistItem).toBe(player._playlist[1]);
	});

	it('does nothing when already at the last item', () => {
		const player = createMockPlayer(samplePlaylistItems, 2);
		const spy = vi.spyOn(player, 'playVideo');
		player.next();
		expect(spy).not.toHaveBeenCalled();
	});

	it('advances from middle to next', () => {
		const player = createMockPlayer(samplePlaylistItems, 1);
		player.next();
		expect(player.currentPlaylistItem).toBe(player._playlist[2]);
	});
});

// ─── previous() ─────────────────────────────────────────────────────────────

describe('previous()', () => {
	it('goes to the previous playlist item', () => {
		const player = createMockPlayer(samplePlaylistItems, 2);
		player.previous();
		expect(player.currentPlaylistItem).toBe(player._playlist[1]);
	});

	it('does nothing when already at the first item', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const spy = vi.spyOn(player, 'playVideo');
		player.previous();
		expect(spy).not.toHaveBeenCalled();
	});

	it('goes from middle to previous', () => {
		const player = createMockPlayer(samplePlaylistItems, 1);
		player.previous();
		expect(player.currentPlaylistItem).toBe(player._playlist[0]);
	});
});

// ─── setEpisode() ───────────────────────────────────────────────────────────

describe('setEpisode()', () => {
	it('finds the correct item by season and episode', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.setEpisode(2, 1);
		expect(player.currentPlaylistItem).toBe(player._playlist[2]);
	});

	it('falls back to index 0 when episode is not found', () => {
		const player = createMockPlayer(samplePlaylistItems, 1);
		player.setEpisode(99, 99);
		// Should call playlistItem(0) which calls playVideo(0) since currentIndex is 1
		expect(player.currentPlaylistItem).toBe(player._playlist[0]);
	});

	it('calls play() when autoPlay is true and disableAutoPlayback is false', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.options.autoPlay = true;
		player.options.disableAutoPlayback = false;
		player.setEpisode(1, 2);
		expect(player.play).toHaveBeenCalled();
	});

	it('does not call play() when disableAutoPlayback is true', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.options.disableAutoPlayback = true;
		player.options.autoPlay = true;
		player.setEpisode(1, 2);
		expect(player.play).not.toHaveBeenCalled();
	});

	it('does not call play() when autoPlay is false', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.options.autoPlay = false;
		player.options.disableAutoPlayback = false;
		player.setEpisode(1, 2);
		expect(player.play).not.toHaveBeenCalled();
	});

	it('warns and returns early for non-finite season', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const spy = vi.spyOn(player, 'playVideo');
		player.setEpisode(Number.NaN, 1);
		expect(player.logger.warn).toHaveBeenCalledWith(
			'setEpisode() expects finite number arguments',
			{ season: Number.NaN, episode: 1 },
		);
		expect(spy).not.toHaveBeenCalled();
	});

	it('warns and returns early for non-finite episode', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		player.setEpisode(1, Infinity);
		expect(player.logger.warn).toHaveBeenCalled();
	});
});

// ─── isFirstPlaylistItem() ──────────────────────────────────────────────────

describe('isFirstPlaylistItem()', () => {
	it('returns true when at index 0', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		expect(player.isFirstPlaylistItem()).toBe(true);
	});

	it('returns false when not at index 0', () => {
		const player = createMockPlayer(samplePlaylistItems, 1);
		expect(player.isFirstPlaylistItem()).toBe(false);
	});
});

// ─── isLastPlaylistItem() ───────────────────────────────────────────────────

describe('isLastPlaylistItem()', () => {
	it('returns true when at the last index', () => {
		const player = createMockPlayer(samplePlaylistItems, 2);
		expect(player.isLastPlaylistItem()).toBe(true);
	});

	it('returns false when not at the last index', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		expect(player.isLastPlaylistItem()).toBe(false);
	});
});

// ─── hasPlaylists() ─────────────────────────────────────────────────────────

describe('hasPlaylists()', () => {
	it('returns true when playlist has more than 1 item', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		expect(player.hasPlaylists()).toBe(true);
	});

	it('returns false when playlist has exactly 1 item', () => {
		const player = createMockPlayer([samplePlaylistItems[0]], 0);
		expect(player.hasPlaylists()).toBe(false);
	});

	it('returns false when playlist is empty', () => {
		const player = createMockPlayer([], 0);
		expect(player.hasPlaylists()).toBe(false);
	});
});

// ─── seasons() ──────────────────────────────────────────────────────────────

describe('seasons()', () => {
	it('groups playlist items by season', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const result = player.seasons();
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ season: 1, seasonName: 'Season 1', episodes: 2 });
		expect(result[1]).toEqual({ season: 2, seasonName: 'Season 2', episodes: 1 });
	});

	it('returns empty array for empty playlist', () => {
		const player = createMockPlayer([], 0);
		expect(player.seasons()).toEqual([]);
	});

	it('returns single season when all items share the same season', () => {
		const items = samplePlaylistItems.filter(i => i.season === 1);
		const player = createMockPlayer(items, 0);
		const result = player.seasons();
		expect(result).toHaveLength(1);
		expect(result[0].episodes).toBe(2);
	});
});

// ─── loadPlaylist() with array input ────────────────────────────────────────

describe('loadPlaylist()', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('loads an array playlist, filters items without file, and calls playVideo(0)', () => {
		const player = createMockPlayer([], 0);
		const items: PlaylistItem[] = [
			...samplePlaylistItems,
			{ id: 'nofile', title: 'Bad', description: '', file: '', image: '', duration: '' } as PlaylistItem,
		];
		player.options.playlist = items;
		player.loadPlaylist();

		// Item without file should be filtered out
		expect(player._playlist).toHaveLength(3);
		expect(player.loadSource).toHaveBeenCalled();
	});

	it('emits "playlist" in setTimeout', () => {
		const player = createMockPlayer([], 0);
		player.options.playlist = [...samplePlaylistItems];
		player.loadPlaylist();

		// Not emitted synchronously
		const playlistCalls = player.emit.mock.calls.filter((c: any[]) => c[0] === 'playlist');
		expect(playlistCalls).toHaveLength(0);

		vi.runAllTimers();
		const playlistCallsAfter = player.emit.mock.calls.filter((c: any[]) => c[0] === 'playlist');
		expect(playlistCallsAfter).toHaveLength(1);
		expect(playlistCallsAfter[0][1]).toHaveLength(3);
	});

	it('does not call playVideo when disableAutoPlayback is true', () => {
		const player = createMockPlayer([], 0);
		player.options.disableAutoPlayback = true;
		player.options.playlist = [...samplePlaylistItems];
		const spy = vi.spyOn(player, 'playVideo');
		player.loadPlaylist();
		expect(spy).not.toHaveBeenCalled();
	});

	it('does nothing when playlist option is undefined', () => {
		const player = createMockPlayer([], 0);
		player.options.playlist = undefined;
		player.loadPlaylist();
		expect(player._playlist).toEqual([]);
		expect(player.loadSource).not.toHaveBeenCalled();
	});

	it('preserves season and episode fields on items', () => {
		const player = createMockPlayer([], 0);
		player.options.playlist = [...samplePlaylistItems];
		player.loadPlaylist();
		expect(player._playlist[0].season).toBe(1);
		expect(player._playlist[0].episode).toBe(1);
		expect(player._playlist[2].season).toBe(2);
	});
});

// ─── setPlaylist() ──────────────────────────────────────────────────────────

describe('setPlaylist()', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('updates options.playlist and calls loadPlaylist', () => {
		const player = createMockPlayer([], 0);
		const newItems = [...samplePlaylistItems];
		player.setPlaylist(newItems);
		expect(player.options.playlist).toBe(newItems);
		expect(player._playlist).toHaveLength(3);
	});

	it('works with string playlist (sets option and calls fetchPlaylist)', () => {
		const player = createMockPlayer([], 0);
		// Mock fetchPlaylist so loadPlaylist's string branch works
		player.fetchPlaylist = vi.fn(() => Promise.resolve([...samplePlaylistItems]));
		player.setPlaylist('https://example.com/playlist.json');
		expect(player.options.playlist).toBe('https://example.com/playlist.json');
		expect(player.fetchPlaylist).toHaveBeenCalledWith('https://example.com/playlist.json');
	});
});

// ─── load() ─────────────────────────────────────────────────────────────────

describe('load()', () => {
	it('directly sets _playlist', () => {
		const player = createMockPlayer([], 0);
		const items = [...samplePlaylistItems];
		player.load(items);
		expect(player._playlist).toBe(items);
		expect(player._playlist).toHaveLength(3);
	});

	it('overwrites existing playlist', () => {
		const player = createMockPlayer(samplePlaylistItems, 0);
		const newItems = [samplePlaylistItems[0]];
		player.load(newItems);
		expect(player._playlist).toHaveLength(1);
	});

	it('does not call loadSource or emit events', () => {
		const player = createMockPlayer([], 0);
		player.load([...samplePlaylistItems]);
		expect(player.loadSource).not.toHaveBeenCalled();
		expect(player.emit).not.toHaveBeenCalled();
	});
});
